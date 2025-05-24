import { useState, useEffect } from "react";
import { FaUser, FaBriefcase, FaStar } from "react-icons/fa";
import styles from "./EnrollmentForm.module.css";
import { ArrowRight } from "lucide-react";

export default function EnrollmentForm({ onClose, onComplete, user }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState(null); // To store enrollment status from API
  const [loadingStatus, setLoadingStatus] = useState(true); // Loading flag for status
  const [statusError, setStatusError] = useState("");

  // Step 1: Personal Info
  const [formData, setFormData] = useState({
    email: user?.email || "",
    full_name: user?.name|| "",
    domain: "",
    experience_years: "",
    graduation_year: "",
    current_company: "",
    current_job_title: "",
    current_ctc: "",
    expected_ctc: "",
    aspiring_companies: "",
    motivation: "",
    expectations: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // On mount: check enrollment status
  useEffect(() => {
    async function fetchStatus() {
      if (!formData.email) {
        setLoadingStatus(false);
        return;
      }
      setLoadingStatus(true);
      setStatusError("");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll/status?email=${encodeURIComponent(formData.email)}`);
        if (!res.ok) {
          throw new Error("Failed to fetch enrollment status");
        }
        const data = await res.json();
        // Assuming API returns something like { enrolled: true/false, message: "..." }
        setStatus(data);
        // If user is already enrolled, we can consider form as submitted
        if (data.enrolled) {
          setIsSubmitted(true);
        }
      } catch (err) {
        setStatusError(err.message || "Error fetching status");
      } finally {
        setLoadingStatus(false);
      }
    }
    fetchStatus();
  }, [formData.email]);

  // Handle input change for controlled inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation for current step fields
  const validateStep = () => {
    if (step === 1) {
      const requiredFields = ["email", "full_name", "domain", "experience_years", "graduation_year"];
      for (const field of requiredFields) {
        if (!formData[field]) return false;
      }
    }
    if (step === 2) {
      const requiredFields = ["current_company", "current_job_title", "current_ctc", "expected_ctc"];
      for (const field of requiredFields) {
        if (!formData[field]) return false;
      }
    }
    if (step === 3) {
      const requiredFields = ["aspiring_companies", "motivation", "expectations"];
      for (const field of requiredFields) {
        if (!formData[field]) return false;
      }
    }
    return true;
  };

  // Handle next button click
  const handleNext = () => {
    if (!validateStep()) {
      setError("Please fill all required fields in this step");
      return;
    }
    setError("");
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Submit form data to backend
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit");
      } else {
        setIsSubmitted(true);
        onComplete();
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Progress bar percentage
  const progressPercent = (step / 3) * 100;

  // If status is still loading
  if (loadingStatus) {
    return <div className={styles.formContainer}>Checking enrollment status...</div>;
  }

  // If error in fetching status
  if (statusError) {
    return <div className={styles.formContainer}>Error: {statusError}</div>;
  }

  // If user already enrolled
  if (isSubmitted && status?.enrolled) {
    return (
      <div className={styles.formContainer}>
        <h2>You are already enrolled!</h2>
        <p>{status.message || "Thank you for your application."}</p>
        <button className={styles.nextBtn} onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.step}>Start Your Application</h2>
      <p className={styles.para}>Complete this 3-step form to begin your personalized learning journey.</p>
      <div className={styles.progressWrapper}>
        <div className={styles.stepLabels}>
          <div
            className={`${styles.stepLabel} ${
              step >= 1 ? styles.activeStep : ""
            } ${isSubmitted ? styles.completedStep : ""}`}
          >
            <FaUser className={styles.stepIcon} />
            <span>Personal Information</span>
          </div>

          <div
            className={`${styles.stepLabel} ${
              step >= 2 ? styles.activeStep : ""
            }`}
          >
            <FaBriefcase className={styles.stepIcon} />
            <span>Professional Experience</span>
          </div>

          <div
            className={`${styles.stepLabel} ${
              step >= 3 ? styles.activeStep : ""
            }`}
          >
            <FaStar className={styles.stepIcon} />
            <span>Skills & Aspirations</span>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {step === 1 && (
        <div className={styles.stepContent}>
          <div className={styles.info}>
            <h4>Personal Information</h4>
            <span className={styles.spant}>
              Let&apos;s start with some basic information about you
            </span>
          </div>

          <div className={styles.eName}>
            <div className={styles.labelInput}>
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                // onChange={handleChange}
                disabled
                readOnly
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.labelInput}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                readOnly
                className={styles.disabledInput}
              />
            </div>
          </div>
          <div className={styles.eName}>
            <div className={styles.labelInput}>
              <label>Domain *</label>
              <select name="domain" value={formData.domain} onChange={handleChange}>
                <option value="">Select your domain</option>
                <option value="Data Science">Data Science</option>
                <option value="AI/ML">AI / ML</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="IIT Cyber Security">IIT Cyber Security</option>
              </select>
            </div>

            <div className={styles.labelInput}>
              <label>Years of Experience *</label>
              <select
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-2">1-2 years</option>
                <option value="2-3">2-3 years</option>
                <option value="3-4">3-4 years</option>
                <option value="4+">4+ years</option>
              </select>
            </div>
          </div>
          <div className={styles.grad}>
            <label>Graduation Year *</label>
            <input
              type="number"
              placeholder="Graduation... (ex:2012)"
              name="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className={styles.grad}
            />
          </div>
        </div>
      )}

      {/* Step 2: Professional Info */}
      {step === 2 && (
        <div className={styles.stepContent}>
          <div className={`${styles.eName} ${styles.secondf}`}>
            <div className={styles.labelInput}>
              <label>Current Company *</label>
              <input
                type="text"
                name="current_company"
                value={formData.current_company}
                onChange={handleChange}
                placeholder="e.g:current company..."
              />
            </div>

            <div className={styles.labelInput}>
              <label>Current Job Title *</label>
              <input
                type="text"
                name="current_job_title"
                value={formData.current_job_title}
                onChange={handleChange}
                placeholder="e.g:current job title..."
              />
            </div>
          </div>

          <div className={`${styles.eName} ${styles.secondf}`}>
            <div className={styles.labelInput}>
              <label>Current CTC *</label>
              <input
                type="number"
                name="current_ctc"
                value={formData.current_ctc}
                onChange={handleChange}
                min="0"
                placeholder="e.g:current CTC.."
              />
            </div>

            <div className={styles.labelInput}>
              <label>Expected CTC *</label>
              <input
                type="number"
                name="expected_ctc"
                value={formData.expected_ctc}
                onChange={handleChange}
                min="0"
                placeholder="e.g:Expected CTC.."
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Aspiration Info */}
      {step === 3 && (
        <div className={styles.stepContent}>
          <label>Aspiring Companies *</label>
          <textarea
            type="text"
            name="aspiring_companies"
            value={formData.aspiring_companies}
            onChange={handleChange}
            placeholder="e.g., Your Dream Companies"
          />

          <label>Why do you want to join this program?</label>
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Share why you want to join our program...?"
            rows="3"
          />

          <label>What are your expectations from this course?</label>
          <textarea
            name="expectations"
            value={formData.expectations}
            onChange={handleChange}
            placeholder="what outcomes are you looking from this program...?"
            rows="3"
          />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttons}>
        {step > 1 && (
          <button type="button" onClick={handleBack} className={styles.backBtn}>
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className={styles.nextBtn}
        >
          {step === 3 ? (loading ? "Submitting..." : "Submit") : (
            <>
              Next <ArrowRight size={18} style={{ marginLeft: "8px" }} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
