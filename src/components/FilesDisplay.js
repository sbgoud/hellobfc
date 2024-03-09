import React from 'react';
import FileItem from './FileItem';

function FilesDisplay({ files }) {


  return (
    <div className="files-grid">
        <h1>Files</h1>
      {files.map((file) => (
        <FileItem key={file.id} file={file} /> 
      ))}
    </div>
  );
}

export default FilesDisplay;
