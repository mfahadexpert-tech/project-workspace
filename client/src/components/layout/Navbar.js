'use client';

import React from 'react';

export default function Navbar({ activeProject, currentUser, onOpenMembersModal, onOpenNewProject, onOpenSearch }) {
  return (
    <header className="workspace-header py-2 px-3 px-lg-4 d-flex justify-content-between align-items-center">
      {/* Left Title & Project Info */}
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
          style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)' }}
        >
          <i className="bi bi-cpu-fill fs-5"></i>
        </div>

        <div>
          <div className="d-flex align-items-center gap-2">
            <h6 className="mb-0 fw-bold text-white" style={{ letterSpacing: '0.3px', fontSize: '0.98rem' }}>
              {activeProject?.name || 'AI Project Workspace'}
            </h6>
            {activeProject?.public_project_id && (
              <span className="badge px-2 py-1" style={{ fontSize: '0.7rem', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                {activeProject.public_project_id}
              </span>
            )}
          </div>
          <div className="d-flex align-items-center gap-2 mt-1">
            <span className="badge bg-emerald bg-opacity-20 text-emerald border border-emerald px-2 py-0" style={{ fontSize: '0.65rem' }}>
              <span className="pulse-dot bg-emerald me-1"></span>
              {activeProject?.status?.toUpperCase() || 'ACTIVE'}
            </span>
            <small className="text-secondary" style={{ fontSize: '0.74rem' }}>
              {activeProject ? `Phase: ${activeProject.current_phase || 'Phase 1 — Development'}` : 'Developer Multi-Agent Environment'}
            </small>
          </div>
        </div>
      </div>

      {/* Center Search Trigger & Agent Status Badges */}
      <div className="d-none d-md-flex align-items-center gap-3">
        <button
          className="nav-search-btn"
          onClick={onOpenSearch}
          title="Search all workspace entities (Ctrl + K)"
        >
          <i className="bi bi-search text-cyan"></i>
          <span>Search Workspace...</span>
          <span className="kbd-shortcut">Ctrl K</span>
        </button>

        <div className="d-none d-xl-flex align-items-center gap-2">
          <span className="agent-badge badge-supervisor">
            <span className="pulse-dot" style={{ backgroundColor: '#38bdf8' }}></span>
            <i className="bi bi-shield-check"></i> Supervisor
          </span>
          <span className="agent-badge badge-coding">
            <span className="pulse-dot" style={{ backgroundColor: '#34d399' }}></span>
            <i className="bi bi-code-slash"></i> Coding
          </span>
          <span className="agent-badge badge-arch">
            <span className="pulse-dot" style={{ backgroundColor: '#c084fc' }}></span>
            <i className="bi bi-diagram-3"></i> Arch
          </span>
          <span className="agent-badge badge-doc">
            <span className="pulse-dot" style={{ backgroundColor: '#fbbf24' }}></span>
            <i className="bi bi-search"></i> RAG
          </span>
        </div>
      </div>

      {/* Right User Profile & Action Controls */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-glass d-flex align-items-center gap-2 px-3 py-1"
          onClick={onOpenMembersModal}
        >
          <i className="bi bi-people-fill text-cyan"></i>
          <span className="d-none d-sm-inline">Team ({activeProject?.members?.length || 1})</span>
        </button>

        <button
          className="btn btn-sm btn-cyan d-flex align-items-center gap-2 px-3 py-1"
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
            style={{ width: '34px', height: '34px', objectFit: 'cover', boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)' }}
          />
          <div className="d-none d-lg-block">
            <span className="d-block fw-bold text-white" style={{ fontSize: '0.78rem', lineHeight: '1.1' }}>
              {currentUser?.full_name || 'Alex Tech Lead'}
            </span>
            <small className="text-cyan fw-bold" style={{ fontSize: '0.7rem' }}>
              {currentUser?.public_member_id || 'USR-7K2M9A'}
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}
