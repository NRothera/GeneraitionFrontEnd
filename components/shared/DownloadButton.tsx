"use client"

import React from 'react';
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
  url: string;
  filename: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ url, filename }) => {
  const downloadHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const sanitizedFilename = filename.replace(/\s+/g, ''); // Remove all spaces

    try {
      const response = await fetch(`/api/download?url=${url}&filename=${encodeURIComponent(sanitizedFilename)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      saveAs(blob, sanitizedFilename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Button onClick={downloadHandler} className="btn-download">
      Download
    </Button>
  );
};

export default DownloadButton;