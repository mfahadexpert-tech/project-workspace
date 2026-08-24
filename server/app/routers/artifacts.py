from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from app.database import get_db
from app.models import Artifact, ArtifactVersion, ActivityLog
from app.schemas import ArtifactCreate, ArtifactResponse, ArtifactVersionResponse

router = APIRouter(prefix="/artifacts", tags=["Artifacts Workbench"])

@router.get("/project/{project_id}", response_model=List[ArtifactResponse])
async def list_artifacts(
    project_id: str,
    class_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Artifact).where(Artifact.project_id == project_id)
    if class_id:
        query = query.where(Artifact.class_id == class_id)

    query = query.order_by(Artifact.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/project/{project_id}", response_model=ArtifactResponse)
async def create_artifact(project_id: str, payload: ArtifactCreate, db: AsyncSession = Depends(get_db)):
    artifact = Artifact(
        project_id=project_id,
        class_id=payload.class_id,
        title=payload.title,
        artifact_type=payload.artifact_type,
        content=payload.content,
        language=payload.language,
        status=payload.status or "approved",
        change_summary=payload.change_summary or "Initial artifact creation",
        created_by=payload.created_by or "AI Assistant"
    )
    db.add(artifact)
    await db.flush()

    # Create Version 1 snapshot
    ver = ArtifactVersion(
        artifact_id=artifact.id,
        version=1,
        content=payload.content,
        change_summary=payload.change_summary or "Initial artifact creation",
        created_by=artifact.created_by
    )
    db.add(ver)

    log = ActivityLog(
        project_id=project_id,
        class_id=payload.class_id,
        user_name=artifact.created_by,
        action_type="artifact_created",
        description=f"Created artifact '{artifact.title}' (v1)"
    )
    db.add(log)

    await db.commit()
    await db.refresh(artifact)
    return artifact

@router.get("/{artifact_id}", response_model=ArtifactResponse)
async def get_artifact(artifact_id: str, db: AsyncSession = Depends(get_db)):
    artifact = await db.get(Artifact, artifact_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return artifact

@router.put("/{artifact_id}", response_model=ArtifactResponse)
async def update_artifact(
    artifact_id: str,
    content: str,
    change_summary: Optional[str] = "Updated content",
    status: Optional[str] = None,
    editor_name: Optional[str] = "Developer",
    db: AsyncSession = Depends(get_db)
):
    artifact = await db.get(Artifact, artifact_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")

    artifact.content = content
    artifact.version += 1
    artifact.change_summary = change_summary
    if status:
        artifact.status = status

    # Snapshot new version
    ver = ArtifactVersion(
        artifact_id=artifact.id,
        version=artifact.version,
        content=content,
        change_summary=change_summary,
        created_by=editor_name or "Developer"
    )
    db.add(ver)

    log = ActivityLog(
        project_id=artifact.project_id,
        class_id=artifact.class_id,
        user_name=editor_name or "Developer",
        action_type="artifact_updated",
        description=f"Updated artifact '{artifact.title}' to v{artifact.version}: {change_summary}"
    )
    db.add(log)

    await db.commit()
    await db.refresh(artifact)
    return artifact

@router.get("/{artifact_id}/versions", response_model=List[ArtifactVersionResponse])
async def get_artifact_versions(artifact_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ArtifactVersion)
        .where(ArtifactVersion.artifact_id == artifact_id)
        .order_by(ArtifactVersion.version.desc())
    )
    return result.scalars().all()

@router.post("/{artifact_id}/restore/{version_id}", response_model=ArtifactResponse)
async def restore_artifact_version(artifact_id: str, version_id: str, db: AsyncSession = Depends(get_db)):
    artifact = await db.get(Artifact, artifact_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")

    ver = await db.get(ArtifactVersion, version_id)
    if not ver:
        raise HTTPException(status_code=404, detail="Version not found")

    artifact.content = ver.content
    artifact.version += 1
    artifact.change_summary = f"Restored content from version v{ver.version}"

    new_ver = ArtifactVersion(
        artifact_id=artifact.id,
        version=artifact.version,
        content=ver.content,
        change_summary=f"Restored content from version v{ver.version}",
        created_by="Developer"
    )
    db.add(new_ver)
    await db.commit()
    await db.refresh(artifact)
    return artifact
