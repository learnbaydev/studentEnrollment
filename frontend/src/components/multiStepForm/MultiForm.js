// components/MultiStepForm.js
import { useState } from 'react';
import styles from '../EnrollmentForm/EnrollmentForm.module.css';
import ProgressBar from '../progressBar/ProgressBar';

const initialData = {
  email: '',
  full_name: '',
  domain: '',
  experience_years: '',
  graduation_year: '',
  current_company: '',
  current_job_title: '',
  current_ctc: '',
  expected_ctc: '',
  aspiring_companies: '',
  motivation: '',
  expectations: ''
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) alert("Enrollment successful!");
    else alert(data.message);
  };

  return (
    <div className={styles.formWrapper}>
      <ProgressBar step={step} />
      <form className={styles.form}>
        {step === 1 && (
          <>
            <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} />
            <input name="full_name" placeholder="Full Name" onChange={handleChange} value={formData.full_name} />
            <input name="domain" placeholder="Domain" onChange={handleChange} value={formData.domain} />
            <button type="button" onClick={next}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <input name="experience_years" placeholder="Experience Years" onChange={handleChange} value={formData.experience_years} />
            <input name="graduation_year" placeholder="Graduation Year" onChange={handleChange} value={formData.graduation_year} />
            <input name="current_company" placeholder="Current Company" onChange={handleChange} value={formData.current_company} />
            <input name="current_job_title" placeholder="Job Title" onChange={handleChange} value={formData.current_job_title} />
            <input name="current_ctc" placeholder="Current CTC" onChange={handleChange} value={formData.current_ctc} />
            <input name="expected_ctc" placeholder="Expected CTC" onChange={handleChange} value={formData.expected_ctc} />
            <div className={styles.nav}>
              <button type="button" onClick={back}>Back</button>
              <button type="button" onClick={next}>Next</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <textarea name="aspiring_companies" placeholder="Aspiring Companies" onChange={handleChange} value={formData.aspiring_companies} />
            <textarea name="motivation" placeholder="Why do you want to join?" onChange={handleChange} value={formData.motivation} />
            <textarea name="expectations" placeholder="Expectations from Course" onChange={handleChange} value={formData.expectations} />
            <div className={styles.nav}>
              <button type="button" onClick={back}>Back</button>
              <button type="button" onClick={handleSubmit}>Submit</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MultiStepForm;
