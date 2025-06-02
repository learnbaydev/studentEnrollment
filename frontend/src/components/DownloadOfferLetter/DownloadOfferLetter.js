import React, { useState, useEffect, useCallback } from "react";
import Modal from "../OfferLatter/Model";
import styles from "./DownloadOfferLatter.module.css";

const DownloadOfferLetter = ({ userEmail, onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [seatsLeft, setSeatsLeft] = useState(null);
  const [isFetchingSeats, setIsFetchingSeats] = useState(false);
  const [programName, setProgramName] = useState('');

  const fetchSeatsLeft = useCallback(async () => {
    if (!userEmail) return;
    
    setIsFetchingSeats(true);
    setError(null);
    
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/offer/seats-left/${encodeURIComponent(userEmail)}`;
      const response = await fetch(endpoint, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      
      const data = await response.json();
      
      if (data.success === false) {
        setSeatsLeft(null);
        setProgramName('');
        setError(data.message || "Seat data not available");
      } else {
        setSeatsLeft(data.seatsLeft);
        setProgramName(data.programName || '');
      }
      
    } catch (err) {
      console.error("Error fetching seats:", err);
      setError(err.message || "Failed to fetch seat data");
      setSeatsLeft(null);
      setProgramName('');
    } finally {
      setIsFetchingSeats(false);
    }
  }, [userEmail]);

  const checkLetterStatus = useCallback(async () => {
    if (!userEmail) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/offer/checkStatus/${encodeURIComponent(userEmail)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setLetterGenerated(true);
          setPdfUrl(data.downloadUrl);
          if (data.programName) {
            setProgramName(data.programName);
          }
        }
      }
    } catch (err) {
      console.error("Error checking letter status:", err);
    }
  }, [userEmail]);

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
  
      setPdfUrl(data.downloadUrl);
      setLetterGenerated(true);
      setIsModalOpen(true);
      
      if (data.programName) {
        setProgramName(data.programName);
      }
      
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
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/offer/recordDownload/${encodeURIComponent(userEmail)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

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
      fetchSeatsLeft();
    } else {
      generateLetter();
    }
  }, [letterGenerated, generateLetter, fetchSeatsLeft]);

  useEffect(() => {
    if (userEmail) {
      checkLetterStatus();
    }
  }, [userEmail, checkLetterStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsModalOpen(false);
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className={styles.container}>
      <button
        onClick={handleMainAction}
        disabled={loading}
        className={`${styles.button} ${letterGenerated ? styles.generated : styles.generating}`}
        aria-busy={loading}
        aria-label={letterGenerated ? "View Offer Letter" : "Generate Offer Letter"}
      >
        {loading && <span className={styles.shimmer}></span>}
        <span className={styles.buttonText}>
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Generating...
            </>
          ) : letterGenerated ? (
            "View Offer Letter"
          ) : (
            "Generate Offer Letter"
          )}
        </span>
      </button>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        aria-label="Offer Letter Modal"
      >
        <div className={styles.modalContent}>
          {pdfUrl ? (
            <div className={styles.pdfContainer}>
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                width="100%"
                height="500px"
                className={styles.pdfEmbed}
                title="Offer Letter"
                aria-label="Offer Letter PDF Viewer"
                loading="lazy"
              />
            </div>
          ) : (
            <p>Loading PDF preview...</p>
          )}
          
          <div className={styles.modalFooter}>
            <div className={styles.seatsInfo}>
              {isFetchingSeats ? (
                <p>Checking seat availability...</p>
              ) : seatsLeft !== null ? (
                <p>
  Total Seats Available :<span className={styles.seatsLeft}>0{seatsLeft}</span>
</p>


              ) : (
                <p>Seat information not currently available</p>
              )}
            </div>
            
            <div className={styles.buttons}>
              <button 
                onClick={downloadLetter} 
                disabled={isDownloading}
                className={styles.downloadButton}
                aria-label="Download Offer Letter"
              >
                {isDownloading ? (
                  "Downloading..."
                ) : (
                  "Download Offer Letter"
                )}
              </button>
              
              <button
                onClick={() => window.open("https://pages.razorpay.com/learnbay", "_blank")}
                className={styles.paymentButton}
                aria-label="Block Your Seat"
              >
                Block Your Seat
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(DownloadOfferLetter);