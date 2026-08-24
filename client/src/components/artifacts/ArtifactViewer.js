'use client';

import React, { useState, useEffect } from 'react';
import { getArtifacts, getArtifactVersions, restoreArtifactVersion } from '../../lib/api';

export default function ArtifactViewer({ project }) {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);

  useEffect(() => {
    if (project?.id) {
      loadArtifacts();
    }
  }, [project?.id]);

  useEffect(() => {
    if (selectedArtifact?.id) {
      loadVersions(selectedArtifact.id);
    }
  }, [selectedArtifact?.id]);

  const loadArtifacts = async () => {
    try {
      const res = await getArtifacts(project.id);
      setArtifacts(res.data);
      if (res.data.length > 0 && !selectedArtifact) {
        setSelectedArtifact(res.data[0]);
      }
    } catch (err) {
      console.error('Error loading artifacts:', err);
    }
  };

  const loadVersions = async (artifactId) => {
    setLoadingVersions(true);
    try {
      const res = await getArtifactVersions(artifactId);
      setVersions(res.data);
    } catch (err) {
      console.error('Error loading artifact versions:', err);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!selectedArtifact?.id) return;
    if (!window.confirm('Restore content from this version snapshot?')) return;

    try {
      const res = await restoreArtifactVersion(selectedArtifact.id, versionId);
      setSelectedArtifact(res.data);
      await loadArtifacts();
      await loadVersions(selectedArtifact.id);
      alert(`Restored artifact to new version v${res.data.version}!`);
    } catch (err) {
      console.error('Error restoring artifact version:', err);
      alert('Failed to restore version.');
    }
  };

  const copyContent = (text) => {
    navigator.clipboard.writeText(text);
    alert('Artifact content copied to clipboard!');
  };

  const downloadArtifact = (title, content, language) => {
    const ext = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'mermaid' ? 'mmd' : 'md';
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="row g-4">
      {/* Left List Column */}
      <div className="col-12 col-md-4">
        <div className="dark-card p-3 h-100">
          <h6 className="text-white fw-bold mb-3 d-flex align-items-center justify-content-between">
            <span className="d-flex align-items-center gap-2">
              <i className="bi bi-journal-code text-purple"></i> Artifacts Studio
            </span>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>{artifacts.length}</span>
          </h6>

          {artifacts.length === 0 ? (
            <div className="text-center py-5 text-muted small">
              No project artifacts generated yet. Ask AI in chat to write code or create architecture blueprints!
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {artifacts.map((art) => (
                <button
                  key={art.id}
                  className={`list-group-item list-group-item-action bg-dark text-light border-secondary mb-2 rounded p-3 ${
                    selectedArtifact?.id === art.id ? 'border-cyan bg-secondary bg-opacity-20' : ''
                  }`}
                  onClick={() => setSelectedArtifact(art)}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-truncate me-2 text-white" style={{ maxWidth: '170px', fontSize: '0.88rem' }}>
                      {art.title}
                    </span>
                    <span className="badge bg-purple text-white" style={{ fontSize: '0.65rem' }}>v{art.version}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.72rem' }}>
                    <span className="text-cyan">{art.artifact_type.toUpperCase()}</span>
                    <span className="text-muted">{art.status || 'Approved'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Content & Version History Inspector */}
      <div className="col-12 col-md-8">
        <div className="dark-card p-4">
          {selectedArtifact ? (
            <div>
              {/* Artifact Header */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3 pb-3 border-bottom border-secondary">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="text-white mb-0 fw-bold">{selectedArtifact.title}</h5>
                    <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>v{selectedArtifact.version}</span>
                    <span className="badge bg-success bg-opacity-20 text-success border border-success" style={{ fontSize: '0.7rem' }}>
                      {selectedArtifact.status?.toUpperCase() || 'PUBLISHED'}
                    </span>
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                    Created by <strong>{selectedArtifact.created_by}</strong> • Language: <code>{selectedArtifact.language}</code>
                  </small>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm ${showVersions ? 'btn-purple text-white' : 'btn-outline-secondary text-light'}`}
                    onClick={() => setShowVersions(!showVersions)}
                  >
                    <i className="bi bi-clock-history me-1"></i> Versions ({versions.length})
                  </button>
                  <button
                    className="btn btn-sm btn-outline-cyan text-info"
                    onClick={() => copyContent(selectedArtifact.content)}
                  >
                    <i className="bi bi-clipboard me-1"></i> Copy
                  </button>
                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => downloadArtifact(selectedArtifact.title, selectedArtifact.content, selectedArtifact.language)}
                  >
                    <i className="bi bi-download me-1"></i> Download
                  </button>
                </div>
              </div>

              {/* Version History Drawer Toggle */}
              {showVersions && (
                <div className="mb-4 p-3 bg-dark rounded border border-secondary">
                  <h6 className="fw-bold text-white mb-2" style={{ fontSize: '0.85rem' }}>
                    <i className="bi bi-clock-history text-purple me-1"></i> Artifact Version History
                  </h6>
                  {loadingVersions ? (
                    <small className="text-muted">Loading version snapshots...</small>
                  ) : (
                    <div className="list-group list-group-flush">
                      {versions.map((ver) => (
                        <div key={ver.id} className="list-group-item bg-transparent text-light border-secondary p-2 d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-purple me-2" style={{ fontSize: '0.68rem' }}>v{ver.version}</span>
                            <small className="text-light">{ver.change_summary || 'Snapshot'}</small>
                            <small className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                              ({new Date(ver.created_at).toLocaleDateString()})
                            </small>
                          </div>
                          {ver.version !== selectedArtifact.version && (
                            <button className="btn btn-xs btn-outline-warning py-0 px-2" onClick={() => handleRestore(ver.id)}>
                              Restore
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Main Artifact Renderer */}
              {selectedArtifact.language === 'mermaid' || selectedArtifact.content.includes('```mermaid') ? (
                <div className="mermaid-diagram-card">
                  <span className="badge bg-purple text-wrap mb-3" style={{ backgroundColor: '#8b5cf6' }}>
                    <i className="bi bi-diagram-3 me-1"></i> Mermaid Architecture Diagram
                  </span>
                  <pre style={{ color: '#c084fc', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {selectedArtifact.content}
                  </pre>
                </div>
              ) : (
                <div className="code-block" style={{ maxHeight: '550px' }}>
                  <header>
                    <span>{selectedArtifact.language || 'markdown'}</span>
                    <span>Version {selectedArtifact.version}</span>
                  </header>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{selectedArtifact.content}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">Select an artifact from the studio list.</div>
          )}
        </div>
      </div>
    </div>
  );
}
