// components/ScheduleMeeting/ScheduleMeeting.js
import React, { useState } from 'react';
import styles from './ScheduleMeeting.module.css';

const ScheduleMeeting = ({ userEmail, onComplete, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/schedule-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          meetingDate: selectedDate,
          meetingTime: selectedTime
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule meeting');
      }

      const data = await response.json();
      onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Profile Evaluation/Screening</h2>
      <p>Ready to Schedule</p>
      <p className={styles.description}>
        Schedule your personalized screening session with our advisors to discuss your profile and program fit.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={!!selectedDate}
              readOnly
              className={styles.checkbox}
            />
            Scheduled for {selectedDate || '______'}
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={!!selectedTime}
              readOnly
              className={styles.checkbox}
            />
            {selectedTime || '______'}
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Select Time:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">Select a time</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
          </select>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleMeeting;