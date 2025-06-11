import { useState, useEffect } from "react";
import { FaUser, FaBriefcase, FaStar } from "react-icons/fa";
import { FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import styles from "./EnrollmentForm.module.css";
import { ArrowRight } from "lucide-react";

export default function EnrollmentForm({ onClose, onComplete, user }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    email: user?.email || "",
    full_name: user?.name|| "",
    // domain: "",
    experience_years: "",
    graduation_year: "",
    current_company: "",
    current_job_title: "",
    aspiring_designation: "",
    current_ctc: "",
    expected_ctc: "",
    aspiring_companies: "",
    motivation: "",
    expectations: "",
    programming_rating: "",
    linkedin_profile: "",
    evaluator_rating: "",
    native_city: ""
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverEvaluatorRating, setHoverEvaluatorRating] = useState(0);

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
        setStatus(data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const errors = {};
    let isValid = true;

    if (step === 1) {
      const requiredFields = ["email", "full_name",  "experience_years", "graduation_year"];
      requiredFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = "This field is required";
          isValid = false;
        }
      });
    }

    if (step === 2) {
      const requiredFields = ["current_company", "current_job_title", "current_ctc", "expected_ctc"];
      requiredFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = "This field is required";
          isValid = false;
        }
      });
    }

    if (step === 3) {
      const requiredFields = [ "motivation", "expectations"];
      requiredFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = "This field is required";
          isValid = false;
        }
      });
    }

    setFieldErrors(errors);
    return isValid;
  };

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

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

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

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, programming_rating: rating });
  };

  const handleEvaluatorRatingClick = (rating) => {
    setFormData({ ...formData, evaluator_rating: rating.toString() });
  };

  const progressPercent = (step / 3) * 100;

  if (loadingStatus) {
    return <div className={styles.formContainer}>Checking enrollment status...</div>;
  }

  if (statusError) {
    return <div className={styles.formContainer}>Error: {statusError}</div>;
  }

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
          <div className={`${styles.stepLabel} ${step >= 1 ? styles.activeStep : ""} ${isSubmitted ? styles.completedStep : ""}`}>
            <FaUser className={styles.stepIcon} />
            <span>Personal Information</span>
          </div>

          <div className={`${styles.stepLabel} ${step >= 2 ? styles.activeStep : ""}`}>
            <FaBriefcase className={styles.stepIcon} />
            <span>Professional Experience</span>
          </div>

          <div className={`${styles.stepLabel} ${step >= 3 ? styles.activeStep : ""}`}>
            <FaStar className={styles.stepIcon} />
            <span>Skills & Aspirations</span>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {step === 1 && (
        <div className={styles.stepContent} data-step="1">
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
            {/* <div className={styles.labelInput}>
              <label>Domain *</label>
              <select 
                name="domain" 
                value={formData.domain} 
                onChange={handleChange}
                className={fieldErrors.domain ? styles.errorField : ""}
              >
                <option value="">Select your domain</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="BFSI">BFSI</option>
                <option value="Helthcare">Healthcare</option>
              </select>
              {fieldErrors.domain && <span className={styles.errorText}>{fieldErrors.domain}</span>}
            </div> */}
     <div className={styles.labelInput}>
  <label>Graduation Year *</label>
  <input
    type="number"
    placeholder="Graduation year (ex: 2012)"
    name="graduation_year"
    value={formData.graduation_year}
    onChange={(e) => {
      const year = e.target.value;

      // Allow only 4-digit numbers
      if (year.length <= 4 && /^[0-9]*$/.test(year)) {
        handleChange(e);
      }
    }}
    min="1900"
    max={new Date().getFullYear()}
    className={fieldErrors.graduation_year ? styles.errorField : ""}
  />
  {fieldErrors.graduation_year && (
    <span className={styles.errorText}>{fieldErrors.graduation_year}</span>
  )}
</div>


<div className={styles.labelInput}>
  <label>Years of Experience *</label>
  <input
    type="number"
    step="0.1"
    min="0"
    placeholder="Enter years of experience (e.g. 2 or 3.5)"
    name="experience_years"
    value={formData.experience_years}
    onChange={handleChange}
    className={fieldErrors.experience_years ? styles.errorField : ""}
  />
  {fieldErrors.experience_years && (
    <span className={styles.errorText}>
      {fieldErrors.experience_years}
    </span>
  )}
</div>

          </div>
          
          <div className={styles.eName}>
     
            
            <div className={styles.labelInput}>
              <label>Native City</label>
              <input
                type="text"
                placeholder="Your native city"
                name="native_city"
                value={formData.native_city}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContent} data-step="2">
          <div className={`${styles.eName} ${styles.secondf}`}>
            <div className={styles.labelInput}>
              <label>Current Company *</label>
              <input
                type="text"
                name="current_company"
                value={formData.current_company}
                onChange={handleChange}
                placeholder="e.g. current company..."
                className={fieldErrors.current_company ? styles.errorField : ""}
              />
              {fieldErrors.current_company && <span className={styles.errorText}>{fieldErrors.current_company}</span>}
            </div>

            <div className={styles.labelInput}>
            <label>Aspiring Companies *</label>
            <input
              type="text"
              name="aspiring_companies"
              value={formData.aspiring_companies}
              onChange={handleChange}
              placeholder="e.g., Your Dream Companies"
              className={fieldErrors.aspiring_companies ? styles.errorField : ""}
            />
            {fieldErrors.aspiring_companies && <span className={styles.errorText}>{fieldErrors.aspiring_companies}</span>}
          </div>

           
          </div>

          <div className={`${styles.eName} ${styles.secondf}`}>
          <div className={styles.labelInput}>
  <label>Your current CTC (in LPA) *</label>
  <input
    type="number"
    name="current_ctc"
    value={formData.current_ctc}
    onChange={handleChange}
    min="0"
    step="0.01"
    placeholder="e.g. 12.5"
    className={fieldErrors.current_ctc ? styles.errorField : ""}
  />
  {fieldErrors.current_ctc && (
    <span className={styles.errorText}>{fieldErrors.current_ctc}</span>
  )}
</div>

<div className={styles.labelInput}>
  <label>Aspiring CTC (in LPA) *</label>
  <input
    type="number"
    name="expected_ctc"
    value={formData.expected_ctc}
    onChange={handleChange}
    min="0"
    step="0.01"
    placeholder="e.g. 15.75"
    className={fieldErrors.expected_ctc ? styles.errorField : ""}
  />
  {fieldErrors.expected_ctc && (
    <span className={styles.errorText}>{fieldErrors.expected_ctc}</span>
  )}
</div>

          </div>
          <div className={`${styles.eName} ${styles.secondf}`}>
          <div className={styles.labelInput}>
              <label>Your Current Designation *</label>
              <input
                type="text"
                name="current_job_title"
                value={formData.current_job_title}
                onChange={handleChange}
                placeholder="e.g. current job title..."
                className={fieldErrors.current_job_title ? styles.errorField : ""}
              />
              {fieldErrors.current_job_title && <span className={styles.errorText}>{fieldErrors.current_job_title}</span>}
            </div>
          <div className={styles.labelInput}>
            <label>Your aspiring designation (if any)</label>
            <input
              type="text"
              name="aspiring_designation"
              value={formData.aspiring_designation}
              onChange={handleChange}
              placeholder="e.g. your desired job title..."
            />
          </div>
        
          </div>

          <div className={styles.labelInput}>
            <label>Your LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin_profile"
              value={formData.linkedin_profile}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>
        </div>
      )}

      {step === 3 && (
  <div className={styles.stepContent} data-step="3">

        

          <div className={styles.labelInput}>
            <label>Why are you specifically targeting these companies? *</label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              placeholder="Share why you're targeting these companies..."
              rows="3"
              className={fieldErrors.motivation ? styles.errorField : ""}
            />
            {fieldErrors.motivation && <span className={styles.errorText}>{fieldErrors.motivation}</span>}
          </div>

          <div className={styles.labelInput}>
            <label>Rate yourself in programming</label>
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={styles.star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(star)}
                >
                  {star <= (hoverRating || formData.programming_rating) ? (
                    <FaStar className={styles.filledStar} />
                  ) : (
                    <FaRegStar className={styles.emptyStar} />
                  )}
                </span>
              ))}
              <span className={styles.ratingText}>
                {formData.programming_rating ? `${formData.programming_rating} star${formData.programming_rating > 1 ? 's' : ''}` : "Not rated"}
              </span>
            </div>
          </div>

          <div className={styles.labelInput}>
            <label>Rate your conversation with your profile Evaluator out of 5</label>
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={styles.star}
                  onMouseEnter={() => setHoverEvaluatorRating(star)}
                  onMouseLeave={() => setHoverEvaluatorRating(0)}
                  onClick={() => handleEvaluatorRatingClick(star)}
                >
                  {star <= (hoverEvaluatorRating || formData.evaluator_rating) ? (
                    <FaStar className={styles.filledStar} />
                  ) : (
                    <FaRegStar className={styles.emptyStar} />
                  )}
                </span>
              ))}
              <span className={styles.ratingText}>
                {formData.evaluator_rating ? `${formData.evaluator_rating} star${formData.evaluator_rating > 1 ? 's' : ''}` : "Not rated"}
              </span>
            </div>
          </div>

          <div className={styles.labelInput}>
            <label>Why do you want join this program? *</label>
            <textarea
              name="expectations"
              value={formData.expectations}
              onChange={handleChange}
              placeholder="Describe in approx 100 words which will be your Statement of Purpose for the Evaluation and career roadmap for team head (SOP)."
              rows="5"
              className={fieldErrors.expectations ? styles.errorField : ""}
            />
            {fieldErrors.expectations && <span className={styles.errorText}>{fieldErrors.expectations}</span>}
          </div>
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