import React from 'react';
import videoThumbnail from '../images/video.svg';
import documentThumbnail from '../images/document.svg';
import audioThumbnail from '../images/audio.svg';
import defaultThumbnail from '../images/default.svg';
import imageThumbnail from '../images/image.svg';

const getThumbnail = (fileType) => {
  switch (fileType) {
    case 'video': 
      return videoThumbnail;
    case 'image':
        return imageThumbnail;
    case 'pdf':
      return documentThumbnail;
    case 'audio':
      return audioThumbnail;
    default:
      return defaultThumbnail;
  }
};

function FileItem({ file }) {  
  return (
    <div className="file-item">
      <img src={getThumbnail(file.type)} alt={file.name} />
      <p>{file.name}</p> 
    </div>
  );
}

export default FileItem;
