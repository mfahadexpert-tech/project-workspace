'use client';

import React from 'react';

export default function Navbar({ activeProject, currentUser, onOpenMembersModal, onOpenNewProject, onOpenSearch }) {
  return (
    <header className="workspace-header py-2 px-4 d-flex justify-content-between align-items-center">
      {/* Left Title & Project Info */}
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center text-white"
          style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
        >
          <i className="bi bi-cpu-fill fs-5"></i>
        </div>

        <div>
          <h6 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
            <span>{activeProject?.name || 'AI Project Workspace'}</span>
            {activeProject?.public_project_id && (
              <span className="badge bg-primary text-white" style={{ fontSize: '0.7rem' }}>
                {activeProject.public_project_id}
              </span>
            )}
          </h6>
          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
            {activeProject ? `Phase: ${activeProject.current_phase || 'Active'}` : 'Developer Multi-Agent Environment'}
          </small>
        </div>
      </div>

      {/* Center Search Trigger & Agent Status Badges */}
      <div className="d-none d-md-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-dark border border-secondary text-muted px-3 py-1 d-flex align-items-center gap-2"
          onClick={onOpenSearch}
          style={{ borderRadius: '20px', fontSize: '0.8rem' }}
        >
          <i className="bi bi-search text-cyan"></i>
          <span>Global Search (Ctrl + K)</span>
        </button>

        <div className="d-none d-xl-flex align-items-center gap-2">
          <span className="agent-badge badge-supervisor">
            <i className="bi bi-shield-check"></i> Supervisor Orchestrator
          </span>
          <span className="agent-badge badge-coding">
            <i className="bi bi-code-slash"></i> Coding
          </span>
          <span className="agent-badge badge-arch">
            <i className="bi bi-diagram-3"></i> Arch
          </span>
          <span className="agent-badge badge-doc">
            <i className="bi bi-search"></i> RAG
          </span>
        </div>
      </div>

      {/* Right User Profile & Action Controls */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
          onClick={onOpenMembersModal}
        >
          <i className="bi bi-people-fill"></i>
          <span className="d-none d-sm-inline">Team ({activeProject?.members?.length || 1})</span>
        </button>

        <button
          className="btn btn-sm btn-cyan text-dark fw-bold d-flex align-items-center gap-1"
          onClick={onOpenNewProject}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="d-none d-sm-inline">New Project</span>
        </button>

        {/* User Member ID Badge */}
        <div className="ps-2 ms-2 border-start border-secondary d-flex align-items-center gap-2">
          <img
            src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="rounded-circle border border-info"
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
          <div className="d-none d-lg-block">
            <span className="d-block fw-bold text-light" style={{ fontSize: '0.75rem', lineHeight: '1.1' }}>
              {currentUser?.full_name || 'Alex Tech Lead'}
            </span>
            <small className="text-cyan font-bold" style={{ fontSize: '0.68rem' }}>
              {currentUser?.public_member_id || 'USR-7K2M9A'}
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}
