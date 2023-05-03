import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

function FileViewer({ filename }) {
  const [fileData, setFileData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    fetch(`/ref-files/${filename}`)
      .then(response => response.blob())
      .then(data => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setFileData(fileReader.result);
        };
        fileReader.readAsArrayBuffer(data);
      })
      .catch(error => console.error(error));
  }, [filename]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function getFileType(extension) {
    switch (extension) {
      case '.jpg':
      case '.jpeg':
      case '.png':
        return 'image';
      case '.pdf':
        return 'pdf';
      default:
        return 'unknown';
    }
  }

  function renderFile() {
    const fileExt = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    const fileType = getFileType(fileExt);
    if (fileType === 'pdf') {
      return (
        <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      );
    } else if (fileType === 'image') {
      return <img src={URL.createObjectURL(new Blob([fileData], { type: 'image/jpeg' }))} alt={filename} />;
    } else {
      return <p>Unsupported file type</p>;
    }
  }

  return (
    <div>
      {fileData ? (
        <div>
          <h2>File: {filename}</h2>
          {renderFile()}
          {numPages && (
            <p>
              Page {pageNumber} of {numPages}
            </p>
          )}
        </div>
      ) : (
        <p>Loading file...</p>
      )}
    </div>
  );
}

export default FileViewer;
