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
  onOpenNewProject
}) {
  return (
    <aside className="workspace-sidebar p-3 d-flex flex-column text-light">
      {/* Brand Header */}
      <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom border-secondary">
        <div
          className="rounded-3 p-2 text-dark fw-bold d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
        >
          <i className="bi bi-box-seam-fill fs-5 text-white"></i>
        </div>
        <div>
          <h6 className="mb-0 fw-bold text-white" style={{ letterSpacing: '0.5px' }}>AI WORKSPACE</h6>
          <small className="text-muted" style={{ fontSize: '0.68rem' }}>Developer Environment</small>
        </div>
      </div>

      {/* Project Switcher */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <label className="text-muted fw-bold mb-0" style={{ fontSize: '0.68rem', letterSpacing: '1px' }}>
            PROJECT WORKSPACE
          </label>
          <button className="btn btn-xs btn-link p-0 text-cyan text-decoration-none" onClick={onOpenNewProject}>
            + New
          </button>
        </div>
        <select
          className="form-select dark-input form-select-sm"
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
      <div className="mb-3">
        <label className="text-muted fw-bold d-block mb-2" style={{ fontSize: '0.68rem', letterSpacing: '1px' }}>
          PROJECT PANELS
        </label>
        <div className="nav flex-column nav-pills nav-pills-custom">
          <button
            className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => onSelectTab('overview')}
          >
            <i className="bi bi-grid-1x2-fill text-cyan"></i>
            <span>Overview Dashboard</span>
          </button>

          <button
            className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => onSelectTab('classes')}
          >
            <i className="bi bi-diagram-3-fill text-purple"></i>
            <span>Classes & Workstreams</span>
          </button>

          <button
            className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => onSelectTab('chats')}
          >
            <i className="bi bi-chat-left-dots-fill text-cyan"></i>
            <span>Team Conversations</span>
          </button>

          <button
            className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => onSelectTab('tasks')}
          >
            <i className="bi bi-kanban-fill text-blue"></i>
            <span>Tasks & Kanban</span>
          </button>

          <button
            className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${activeTab === 'artifacts' ? 'active' : ''}`}
            onClick={() => onSelectTab('artifacts')}
          >
            <i className="bi bi-code-square text-purple"></i>
            <span>Artifacts Studio</span>
          </button>

          <button
            className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => onSelectTab('knowledge')}
          >
            <i className="bi bi-folder-fill text-amber"></i>
            <span>Knowledge Base (RAG)</span>
          </button>

          <button
            className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => onSelectTab('memory')}
          >
            <i className="bi bi-cpu-fill text-emerald"></i>
            <span>Instructions & Memory</span>
          </button>
        </div>
      </div>

      {/* Conversations Sub-list (when on chats tab) */}
      {activeTab === 'chats' && (
        <div className="mb-3 flex-grow-1 overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="text-muted fw-bold mb-0" style={{ fontSize: '0.68rem', letterSpacing: '1px' }}>
              CHATS
            </label>
            <button className="btn btn-sm btn-link p-0 text-cyan text-decoration-none" onClick={onNewConversation}>
              + New Chat
            </button>
          </div>

          <div className="list-group list-group-flush">
            {conversations.map((c) => (
              <button
                key={c.id}
                className={`list-group-item list-group-item-action bg-dark text-light border-0 py-2 px-2 rounded mb-1 text-start d-flex align-items-center justify-content-between ${
                  activeConversation?.id === c.id ? 'bg-secondary bg-opacity-40 text-cyan fw-bold' : ''
                }`}
                onClick={() => onSelectConversation(c)}
              >
                <div className="text-truncate me-2" style={{ fontSize: '0.82rem' }}>
                  <i className="bi bi-hash me-1 text-muted"></i>
                  {c.title}
                </div>
                <span className="badge bg-dark border border-secondary text-muted" style={{ fontSize: '0.65rem' }}>
                  {c.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-3 border-top border-secondary text-center">
        <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>
          Multi-Agent Developer Workspace
        </small>
        <small className="text-cyan font-bold" style={{ fontSize: '0.72rem' }}>
          FastAPI + LangGraph + Next.js
        </small>
      </div>
    </aside>
  );
}
