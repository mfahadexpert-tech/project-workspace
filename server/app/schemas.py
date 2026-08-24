from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# User & Profile Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    availability_status: str = "online"
    role: str = "Developer"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    public_member_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Member Schemas
class MemberBase(BaseModel):
    user_name: str
    user_email: str
    role: str = "editor"
    specialty: Optional[str] = "Full-Stack Developer"

class MemberCreate(MemberBase):
    pass

class MemberResponse(MemberBase):
    id: str
    project_id: str
    public_member_id: str
    joined_at: datetime

    class Config:
        from_attributes = True

# Class / Workstream Schemas
class ProjectClassBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: str = "bi-diagram-3"
    color: str = "#3b82f6"
    lead_member_id: Optional[str] = None
    assigned_agent: str = "Supervisor Orchestrator Agent"
    instructions: Optional[str] = None
    status: str = "active"
    priority: str = "medium"

class ProjectClassCreate(ProjectClassBase):
    project_id: str
    parent_class_id: Optional[str] = None

class ProjectClassUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    lead_member_id: Optional[str] = None
    assigned_agent: Optional[str] = None
    instructions: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class ProjectClassResponse(ProjectClassBase):
    id: str
    project_id: str
    parent_class_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    visibility: str = "team"
    current_phase: str = "Development & Architecture"
    technologies: Optional[List[str]] = ["Next.js", "FastAPI", "PostgreSQL", "Redis", "LangChain"]
    goals: Optional[List[str]] = ["Build multi-agent platform", "Deploy microservices architecture"]
    system_instructions: Optional[str] = "You are an expert AI software architect and senior full-stack developer assistant."
    developer_rules: Optional[str] = "1. Always write modular code.\n2. Provide clean diagrams in Mermaid format when requested."
    is_pinned: bool = False

class ProjectCreate(ProjectBase):
    owner_name: Optional[str] = "Alex Tech Lead"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    visibility: Optional[str] = None
    current_phase: Optional[str] = None
    technologies: Optional[List[str]] = None
    goals: Optional[List[str]] = None
    system_instructions: Optional[str] = None
    developer_rules: Optional[str] = None
    status: Optional[str] = None
    is_pinned: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: str
    public_project_id: str
    owner_name: str
    status: str
    created_at: datetime
    updated_at: datetime
    members: List[MemberResponse] = []
    classes: List[ProjectClassResponse] = []

    class Config:
        from_attributes = True

# Conversation Schemas
class ConversationBase(BaseModel):
    title: str = "New Conversation"
    category: str = "General"
    class_id: Optional[str] = None
    assigned_agent: Optional[str] = None

class ConversationCreate(ConversationBase):
    project_id: str

class ConversationResponse(ConversationBase):
    id: str
    project_id: str
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Message Schemas
class MessageCreate(BaseModel):
    conversation_id: str
    content: str
    sender_name: Optional[str] = "Developer"

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_type: str
    sender_name: str
    content: str
    agent_name: Optional[str] = None
    agent_reasoning: Optional[str] = None
    tool_calls: Optional[Any] = None
    citations: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Personal Assistant Schemas
class PersonalAssistantCreate(BaseModel):
    project_id: Optional[str] = None
    content: str

class PersonalAssistantMessageResponse(BaseModel):
    id: str
    user_id: str
    project_id: Optional[str] = None
    sender_type: str
    content: str
    citations: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TransferDraftRequest(BaseModel):
    project_id: str
    content: str
    target_type: str # 'conversation' or 'artifact'
    conversation_id: Optional[str] = None
    title: Optional[str] = "Transferred Assistant Draft"

# Memory Schemas
class MemoryCreate(BaseModel):
    memory_key: str
    memory_value: str
    category: str = "fact"
    importance: int = 3
    class_id: Optional[str] = None

class MemoryResponse(MemoryCreate):
    id: str
    project_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# File Schemas
class FileResponse(BaseModel):
    id: str
    project_id: str
    class_id: Optional[str] = None
    filename: str
    file_type: str
    file_size: int
    chunk_count: int
    summary: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    assigned_to: Optional[str] = "Unassigned"
    class_id: Optional[str] = None
    deadline: Optional[str] = None
    estimated_hours: Optional[int] = 4
    dependencies: Optional[List[str]] = []
    checklists: Optional[List[Dict[str, Any]]] = []
    labels: Optional[List[str]] = ["Feature"]

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    class_id: Optional[str] = None
    deadline: Optional[str] = None
    estimated_hours: Optional[int] = None
    dependencies: Optional[List[str]] = None
    checklists: Optional[List[Dict[str, Any]]] = None
    labels: Optional[List[str]] = None

class TaskResponse(TaskCreate):
    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Artifact Schemas
class ArtifactCreate(BaseModel):
    title: str
    artifact_type: str = "code"
    content: str
    language: str = "javascript"
    class_id: Optional[str] = None
    status: str = "approved"
    change_summary: Optional[str] = "Initial artifact creation"
    created_by: Optional[str] = "AI Assistant"

class ArtifactVersionResponse(BaseModel):
    id: str
    artifact_id: str
    version: int
    content: str
    change_summary: Optional[str] = None
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class ArtifactResponse(ArtifactCreate):
    id: str
    project_id: str
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Activity & Usage Log Schemas
class ActivityLogResponse(BaseModel):
    id: str
    project_id: str
    class_id: Optional[str] = None
    user_name: str
    action_type: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class ModelUsageLogResponse(BaseModel):
    id: str
    project_id: Optional[str] = None
    user_name: str
    model_name: str
    provider: str
    prompt_tokens: int
    completion_tokens: int
    total_cost: str
    latency_ms: int
    created_at: datetime

    class Config:
        from_attributes = True

# Search Result Schema
class SearchResultItem(BaseModel):
    id: str
    entity_type: str # 'project', 'class', 'conversation', 'message', 'file', 'memory', 'task', 'artifact'
    title: str
    subtitle: str
    category: Optional[str] = None
    project_id: Optional[str] = None
    class_id: Optional[str] = None
