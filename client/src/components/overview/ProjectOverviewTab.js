'use client';

import React from 'react';

export default function ProjectOverviewTab({ project, classesCount = 0, tasksCount = 0, artifactsCount = 0, onNavigateTab }) {
  if (!project) return null;

  return (
    <div className="container-fluid p-0">
      {/* Top Banner Card */}
      <div className="dark-card p-4 mb-4 border-secondary position-relative overflow-hidden">
        <div
          className="position-absolute top-0 end-0 p-4 opacity-10"
          style={{ pointerEvents: 'none', fontSize: '10rem', lineHeight: '0' }}
        >
          <i className="bi bi-cpu text-cyan"></i>
        </div>

        <div className="row align-items-center">
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary text-white font-bold" style={{ fontSize: '0.75rem' }}>
                {project.public_project_id || 'PRJ-DF7K2Q'}
              </span>
              <span className="badge bg-emerald text-light" style={{ fontSize: '0.75rem' }}>
                {project.status?.toUpperCase() || 'ACTIVE'}
              </span>
              <span className="badge bg-secondary text-light" style={{ fontSize: '0.75rem' }}>
                Visibility: {project.visibility?.toUpperCase() || 'TEAM'}
              </span>
            </div>

            <h3 className="fw-bold text-white mb-2">{project.name}</h3>
            <p className="text-muted small mb-3">{project.description || 'No project description provided.'}</p>

            <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
              <div>
                <i className="bi bi-person-circle text-cyan me-1"></i>
                <span>Owner: <strong>{project.owner_name}</strong></span>
              </div>
              <div>
                <i className="bi bi-rocket-takeoff text-purple me-1"></i>
                <span>Phase: <strong>{project.current_phase || 'Phase 1 — Initialization'}</strong></span>
              </div>
              <div>
                <i className="bi bi-calendar3 text-warning me-1"></i>
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-3 mt-lg-0 text-lg-end">
            <button
              className="btn btn-cyan text-dark font-bold px-4 py-2 me-2"
              onClick={() => onNavigateTab && onNavigateTab('chats')}
            >
              <i className="bi bi-chat-left-dots-fill me-1"></i> Open Chats
            </button>
            <button
              className="btn btn-outline-secondary text-light px-3 py-2"
              onClick={() => onNavigateTab && onNavigateTab('tasks')}
            >
              Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="dark-card p-3 d-flex align-items-center gap-3">
            <div className="rounded-3 p-3 bg-primary bg-opacity-20 text-blue fs-4">
              <i className="bi bi-diagram-3"></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-white">{classesCount || project.classes?.length || 12}</h4>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Workstream Classes</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dark-card p-3 d-flex align-items-center gap-3">
            <div className="rounded-3 p-3 bg-info bg-opacity-20 text-cyan fs-4">
              <i className="bi bi-chat-square-text"></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-white">{project.conversations?.length || 3}</h4>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Team Conversations</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dark-card p-3 d-flex align-items-center gap-3">
            <div className="rounded-3 p-3 bg-warning bg-opacity-20 text-amber fs-4">
              <i className="bi bi-kanban"></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-white">{tasksCount || 3}</h4>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Active Tasks</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dark-card p-3 d-flex align-items-center gap-3">
            <div className="rounded-3 p-3 bg-purple bg-opacity-20 text-purple fs-4">
              <i className="bi bi-journal-code"></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-white">{artifactsCount || 1}</h4>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Versioned Artifacts</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Tech Stack & Goals */}
        <div className="col-12 col-lg-6">
          {/* Tech Stack */}
          <div className="dark-card p-4 mb-4">
            <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-stack text-cyan"></i> Project Technologies
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {(project.technologies || ['Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'LangChain', 'Docker']).map((tech, idx) => (
                <span key={idx} className="badge bg-secondary bg-opacity-40 text-light py-2 px-3 border border-secondary" style={{ fontSize: '0.8rem' }}>
                  <i className="bi bi-check2-circle text-cyan me-1"></i> {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Goals */}
          <div className="dark-card p-4">
            <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-flag-fill text-amber"></i> Strategic Goals & Milestones
            </h6>
            <ul className="list-group list-group-flush bg-transparent">
              {(project.goals || [
                'Build multi-agent supervisor routing engine',
                'Deploy 12 standard workstream classes',
                'Integrate versioned artifacts studio'
              ]).map((goal, idx) => (
                <li key={idx} className="list-group-item bg-transparent text-light border-secondary px-0 py-2 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-check-square-fill text-emerald"></i>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: AI Instructions */}
        <div className="col-12 col-lg-6">
          <div className="dark-card p-4 h-100">
            <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-purple"></i> Persistent AI Project Instructions
            </h6>

            <div className="mb-3">
              <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>SYSTEM & ROLE INSTRUCTIONS</small>
              <div className="p-3 rounded bg-dark border border-secondary text-light small" style={{ whiteSpace: 'pre-wrap' }}>
                {project.system_instructions || 'You are an expert AI software architect and senior developer.'}
              </div>
            </div>

            <div>
              <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>DEVELOPER ARCHITECTURE RULES</small>
              <div className="p-3 rounded bg-dark border border-secondary text-light small" style={{ whiteSpace: 'pre-wrap' }}>
                {project.developer_rules || '1. Always write modular code.\n2. Output Mermaid diagrams.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
