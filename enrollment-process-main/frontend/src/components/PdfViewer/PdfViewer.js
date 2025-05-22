import React, { useState } from "react";
import styles from "./PdfViewer.module.css";

const PdfViewer = ({ pdfUrl }) => {
  const [error, setError] = useState(null);

  const handleDownload = () => {
    if (!pdfUrl) {
      setError("PDF not available for download");
      return;
    }
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Offer Letter</h2>

      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          className={styles.pdfFrame}
          onError={() => setError("Failed to load PDF")}
        />
      ) : (
        <p className={styles.message}>PDF preview will appear here.</p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.downloadBtn}
        onClick={handleDownload}
        disabled={!pdfUrl}
      >
        Download PDF
      </button>
    </div>
  );
};

export default PdfViewer;
