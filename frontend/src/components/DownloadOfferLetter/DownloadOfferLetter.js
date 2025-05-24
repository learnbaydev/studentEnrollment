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

  const checkLetterStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/offer/checkStatus/${encodeURIComponent(userEmail)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setLetterGenerated(true);
          setPdfUrl(data.downloadUrl);
        }
      }
    } catch (err) {
      console.error("Error checking letter status:", err);
    }
  }, [userEmail]);

  // const generateLetter = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/offer/generate/${encodeURIComponent(userEmail)}`
  //     );

  //     if (!response.ok) throw new Error("Failed to generate letter");
      
  //     const data = await response.json();
  //     setPdfUrl(data.downloadUrl);
  //     setLetterGenerated(true);
  //     setIsModalOpen(true);
      
  //     if (onGenerate) onGenerate();
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [userEmail, onGenerate]);

  useEffect(() => {
    if (userEmail) {
      checkLetterStatus();
    }
  }, [userEmail, checkLetterStatus]);

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

      if (!response.ok) {
        throw new Error("Failed to generate scholarship letter");
      }
  
      const data = await response.json();
      
      if (!data.downloadUrl) {
        throw new Error("PDF URL not received from server");
      }
  
      // Use the URL directly from the response (should be S3 signed URL)
      setPdfUrl(data.downloadUrl);
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
      // Record the download first
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/offer/recordDownload/${encodeURIComponent(userEmail)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      // For S3 files, we can just open in new tab (the URL is already signed)
      window.open(pdfUrl, '_blank');
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent}>
          {pdfUrl ? (
            <div className={styles.pdfContainer}>
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                width="100%"
                height="500px"
                className={styles.pdfEmbed}
                title="Scholarship Letter"
              />
              {error && <p className={styles.pdfError}>{error}</p>}
            </div>
          ) : (
            <p>Loading PDF...</p>
          )}
          <button onClick={downloadLetter} className={styles.downloadButton}>
            Download Scholarship Letter
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(DownloadOfferLetter);