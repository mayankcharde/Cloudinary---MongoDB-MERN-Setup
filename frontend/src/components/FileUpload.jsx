import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { 
  MAX_FILE_SIZE_MB, 
  MAX_FILE_SIZE_BYTES, 
  validateFile,
  formatFileSize 
} from '../utils/uploadHelpers';
import '../styles/FileUpload.css';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    setMessage('');

    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.message}`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    setFiles(validFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError('Please select at least one valid file');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      setUploading(true);
      setProgress(0);

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/uploads/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      setMessage(`${res.data.count} files uploaded successfully!`);
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-container">
      <h2>File Upload</h2>
      <div className="upload-box">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*, video/*"
          disabled={uploading}
        />
        <button 
          onClick={uploadFiles}
          disabled={uploading || files.length === 0}
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload Files'}
        </button>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} - {formatFileSize(file.size)}
              </li>
            ))}
          </ul>
          <p>Total: {files.length} file(s), {formatFileSize(
            files.reduce((total, file) => total + file.size, 0)
          )}</p>
        </div>
      )}

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FileUpload;