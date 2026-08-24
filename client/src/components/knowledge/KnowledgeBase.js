import React, { useState, useEffect } from 'react';
import { getFiles, uploadFile } from '../../lib/api';

export default function KnowledgeBase({ project }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (project?.id) {
      loadFiles();
    }
  }, [project?.id]);

  const loadFiles = async () => {
    try {
      const res = await getFiles(project.id);
      setFiles(res.data);
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadFile(project.id, file);
      await loadFiles();
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dark-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="text-white mb-1 fw-bold">
            <i className="bi bi-folder-fill text-amber me-2"></i>
            Project Knowledge Base & RAG Engine
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
            Upload PDFs, Markdown specs, Python/JS source files, or database schemas. Automatic chunking & vector indexing.
          </p>
        </div>
        <div>
          <label className="btn btn-warning text-dark fw-bold btn-sm mb-0">
            <i className="bi bi-cloud-upload me-1"></i>
            {uploading ? 'Processing RAG Chunks...' : 'Upload Document'}
            <input type="file" onChange={handleFileUpload} hidden disabled={uploading} />
          </label>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-5 text-muted border border-dashed border-secondary rounded">
          <i className="bi bi-file-earmark-arrow-up fs-1 d-block mb-2 text-amber"></i>
          <h6>No Project Documents Uploaded Yet</h6>
          <small>Upload project manuals, API documentation, or architecture blueprints to empower the RAG Slave Agent.</small>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Type</th>
                <th>Size</th>
                <th>Chunks</th>
                <th>Summary</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td className="fw-bold text-white">
                    <i className="bi bi-file-earmark-code text-cyan me-2"></i>
                    {file.filename}
                  </td>
                  <td><span className="badge bg-secondary">{file.file_type}</span></td>
                  <td>{(file.file_size / 1024).toFixed(1)} KB</td>
                  <td><span className="badge bg-amber text-dark">{file.chunk_count} Chunks</span></td>
                  <td className="text-muted" style={{ fontSize: '0.8rem', maxWidth: '300px' }}>
                    {file.summary || 'Chunked & indexed for RAG vector search.'}
                  </td>
                  <td className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {new Date(file.uploaded_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
