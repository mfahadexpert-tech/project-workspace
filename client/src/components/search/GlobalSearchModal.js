'use client';

import React, { useState, useEffect } from 'react';
import { searchWorkspace } from '../../lib/api';

export default function GlobalSearchModal({ show, onClose, project, onSelectItem }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length > 1) {
      const delayDebounce = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await searchWorkspace(query.trim(), project?.id);
      setResults(res.data);
    } catch (err) {
      console.error('Error performing search:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1080 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content dark-card border-secondary text-light">
          {/* Header Input */}
          <div className="modal-header border-secondary p-3">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-muted">
                <i className="bi bi-search fs-5 text-cyan"></i>
              </span>
              <input
                type="text"
                className="form-control dark-input form-control-lg border-secondary text-white"
                placeholder="Global Workspace Search (Projects, Classes, Tasks, Files, Artifacts)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <button type="button" className="btn-close btn-close-white ms-3" onClick={onClose}></button>
          </div>

          {/* Results Area */}
          <div className="modal-body p-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {loading ? (
              <div className="text-center py-4 text-muted">
                <div className="spinner-border spinner-border-sm text-cyan me-2" role="status"></div>
                <span>Searching workspace entities...</span>
              </div>
            ) : query.trim().length <= 1 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-search fs-1 d-block mb-2 text-secondary"></i>
                <small>Type at least 2 characters to search across all workspace entities.</small>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p className="mb-0">No matching workspace items found for "{query}".</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {results.map((item) => (
                  <button
                    key={`${item.entity_type}-${item.id}`}
                    className="list-group-item list-group-item-action bg-transparent text-light border-secondary p-3 d-flex align-items-center justify-content-between text-start"
                    onClick={() => {
                      if (onSelectItem) onSelectItem(item);
                      onClose();
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-secondary text-cyan" style={{ fontSize: '0.7rem' }}>
                          {item.category || item.entity_type.toUpperCase()}
                        </span>
                        <h6 className="mb-0 fw-bold text-white">{item.title}</h6>
                      </div>
                      <small className="text-muted d-block text-truncate" style={{ maxWidth: '600px', fontSize: '0.78rem' }}>
                        {item.subtitle}
                      </small>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer border-secondary justify-content-between p-2 px-3">
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>
              ProTip: Search covers Projects, Workstreams, Tasks, Code Artifacts, Files, and Messages.
            </small>
            <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
              Esc to Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
