'use client';

import React from 'react';

export default function Sidebar({
  projects,
  activeProject,
  onSelectProject,
  activeTab,
  onSelectTab,
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onOpenNewProject,
  currentUser
}) {
  const navItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: 'bi-grid-1x2-fill', color: 'text-cyan' },
    { id: 'activity', label: 'History & Audit (2.3/2.5)', icon: 'bi-clock-history', color: 'text-purple' },
    { id: 'classes', label: 'Classes & Workstreams', icon: 'bi-diagram-3-fill', color: 'text-purple' },
    { id: 'chats', label: 'Team Conversations', icon: 'bi-chat-left-dots-fill', color: 'text-cyan' },
    { id: 'tasks', label: 'Tasks & Kanban', icon: 'bi-kanban-fill', color: 'text-emerald' },
    { id: 'artifacts', label: 'Artifacts Studio', icon: 'bi-code-square', color: 'text-purple' },
    { id: 'knowledge', label: 'Knowledge Base (RAG)', icon: 'bi-folder-fill', color: 'text-amber' },
    { id: 'memory', label: 'Instructions & Memory', icon: 'bi-cpu-fill', color: 'text-emerald' },
  ];

  return (
    <aside className="workspace-sidebar text-light">
      {/* Brand Header */}
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
          style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 0 14px rgba(6, 182, 212, 0.3)' }}
        >
          <i className="bi bi-box-seam-fill fs-5"></i>
        </div>
        <div>
          <h6 className="mb-0 fw-bold text-white" style={{ letterSpacing: '0.8px', fontSize: '0.92rem' }}>AI WORKSPACE</h6>
          <small className="text-secondary fw-semibold" style={{ fontSize: '0.72rem' }}>Developer Environment</small>
        </div>
      </div>

      {/* Project Switcher */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <label className="text-secondary fw-bold mb-0" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
            PROJECT WORKSPACE
          </label>
          <button
            className="btn btn-xs text-cyan text-decoration-none fw-bold p-0"
            style={{ fontSize: '0.75rem' }}
            onClick={onOpenNewProject}
          >
            + New
          </button>
        </div>
        <select
          className="form-select dark-input form-select-sm py-2 px-3 fw-semibold"
          style={{ fontSize: '0.82rem' }}
          value={activeProject?.id || ''}
          onChange={(e) => {
            const found = projects.find((p) => p.id === e.target.value);
            if (found) onSelectProject(found);
          }}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              📁 {p.name} ({p.public_project_id || 'PRJ'})
            </option>
          ))}
        </select>
      </div>

      {/* Main Navigation Tabs */}
      <div className="mb-4">
        <label className="text-secondary fw-bold d-block mb-2 px-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
          PROJECT PANELS
        </label>
        <div className="nav-pills-custom">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <div className="nav-icon-box">
                <i className={`bi ${item.icon} ${item.color}`}></i>
              </div>
              <span className="text-truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations Sub-list (when on chats tab) (Requirement 2.4) */}
      {activeTab === 'chats' && (
        <div className="mb-3 flex-grow-1 overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <label className="text-secondary fw-bold mb-0" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
              TEAM CONVERSATIONS (2.4)
            </label>
            <button className="btn btn-xs text-cyan text-decoration-none fw-bold p-0" style={{ fontSize: '0.75rem' }} onClick={onNewConversation}>
              + New Chat
            </button>
          </div>

          <div className="d-flex flex-column gap-1.5">
            {conversations.map((c) => {
              const isSelf = c.member_id === currentUser?.public_member_id;
              const ownerName = isSelf ? 'You' : (c.member_name || 'Member');
              const memberId = c.member_id || currentUser?.public_member_id || 'USR-FE-7A29X4';
              const memberRole = c.member_role || currentUser?.role || 'Frontend Developer';

              return (
                <button
                  key={c.id}
                  className={`btn btn-sm text-start p-2.5 rounded-3 border transition-all ${
                    activeConversation?.id === c.id
                      ? 'btn-outline-cyan bg-cyan bg-opacity-10 text-white shadow-sm'
                      : 'bg-dark bg-opacity-60 border-secondary border-opacity-25 text-secondary hover-bg-dark'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => onSelectConversation(c)}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-white text-truncate me-1" style={{ fontSize: '0.82rem' }}>
                      💬 {c.title}
                    </span>
                    <span className="badge bg-emerald bg-opacity-20 text-emerald border border-emerald border-opacity-30 py-0" style={{ fontSize: '0.62rem' }}>
                      {c.status || 'Active'}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between text-secondary" style={{ fontSize: '0.7rem' }}>
                    <span className="text-truncate">
                      <strong className={isSelf ? 'text-cyan' : 'text-light'}>{ownerName}</strong> ({memberRole})
                    </span>
                    <code className="text-cyan ms-1 fw-bold" style={{ fontSize: '0.64rem' }}>{memberId}</code>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-3 border-top border-secondary border-opacity-25 text-center">
        <small className="text-secondary d-block fw-medium mb-1" style={{ fontSize: '0.7rem' }}>
          Multi-Agent Developer Workspace
        </small>
        <span className="badge bg-cyan bg-opacity-15 text-cyan border border-cyan border-opacity-25 px-2 py-1" style={{ fontSize: '0.7rem' }}>
          FastAPI + LangGraph + Next.js
        </span>
      </div>
    </aside>
  );
}
