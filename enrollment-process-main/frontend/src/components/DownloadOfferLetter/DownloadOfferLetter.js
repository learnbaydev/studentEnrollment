import React, { useState, useEffect, useCallback } from "react";
import Modal from "../OfferLatter/Model";
import Image from "next/image";
import styles from "./DownloadOfferLatter.module.css";

const DownloadOfferLetter = ({ userEmail, onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [letterGenerated, setLetterGenerated] = useState(false);

  useEffect(() => {
    const checkLetterStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/offer/checkStatus/${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            setLetterGenerated(true);
            setPdfUrl(`${process.env.NEXT_PUBLIC_API_URL}${data.downloadUrl}`);
            if (onGenerate) onGenerate();
          }
        }
      } catch (err) {
        console.error("Error checking letter status:", err);
      }
    };

    if (userEmail) {
      checkLetterStatus();
    }
  }, [userEmail, onGenerate]);

  const generateLetter = useCallback(async () => {
    if (!userEmail) {
      setError("User email not found. Please log in.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/offer/generate/${encodeURIComponent(userEmail)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
      }
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate scholarship letter");
      }
  
      if (!data.downloadUrl) {
        throw new Error("PDF URL not received from server");
      }
  
      setPdfUrl(`${process.env.NEXT_PUBLIC_API_URL}${data.downloadUrl}`);
      setLetterGenerated(true);
      setIsModalOpen(true);
      
      if (onGenerate) {
        onGenerate();
      }
    } catch (err) {
      setError(err.message || "Failed to generate letter. Please try again.");
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  }, [userEmail, onGenerate]);

  const downloadLetter = useCallback(async () => {
    if (!pdfUrl) return;

    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(pdfUrl, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Scholarship_Letter.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/offer/recordDownload/${encodeURIComponent(userEmail)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
    } catch (err) {
      setError(err.message || "Failed to download letter. Please try again.");
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [pdfUrl, userEmail]);

  const handleMainAction = useCallback(() => {
    if (letterGenerated) {
      setIsModalOpen(true);
    } else {
      generateLetter();
    }
  }, [letterGenerated, generateLetter]);

  return (
    <div className={styles.container}>
      <button
        onClick={handleMainAction}
        disabled={loading}
        className={styles.button}
      >
        {loading && <span className={styles.shimmer}></span>}
        <span className={styles.buttonText}>
          {loading
            ? "Generating..."
            : letterGenerated
            ? "View Scholarship Letter"
            : "Generate Scholarship Letter"}
        </span>
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ maxWidth: "800px" }}
      >
        <div className={styles.modalContent}>
          {pdfUrl && (
            <embed
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              type="application/pdf"
              width="100%"
              height="500px"
              className={styles.pdfEmbed}
            />
          )}

          <button
            onClick={downloadLetter}
            disabled={isDownloading}
            className={styles.downloadButton}
          >
            {isDownloading ? "Downloading..." : "Download Scholarship Letter"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(DownloadOfferLetter);