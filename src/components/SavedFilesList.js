import React from 'react';

function SavedFilesList({ files }) {
  return (
    <ul>
      {files.map((file) => (
        <li key={file.id}>
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            {file.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default SavedFilesList;
