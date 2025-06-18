import React, { useState, useEffect } from "react";
import styles from "./Steps.module.css";
import Image from "next/image";
import DownloadOfferLetter from "../DownloadOfferLetter/DownloadOfferLetter";
import Modal from "../Model/Model";
import EnrollmentForm from "../EnrollmentForm/EnrollmentForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';

function StepCard({
  number,
  title,
  description,
  status,
  children,
  showTimer,
  timeLeft,
  userEmail,
  onScheduleComplete,
  formSubmitted,
  meetingData,
  fetchData,
  deadline,
  isStep1Locked,
  openModal,
  handlePaymentClick,
  setEnrollmentStatus
}) {
  const statusColors = {
    pending: {
      circleBg: "linear-gradient(90deg, #037FF7 0%, #02529F 100%)",
      border: "0.945px solid #037FF7",
      shadow: "-7px 7px 9.8px 8px rgba(0, 114, 188, 0.08)",
      statusText: "⏱ Pending",
      cardBg: "#FFF",
      descBg: "#EFF7FF",
    },
    in_progress: {
      circleBg: "linear-gradient(90deg, #FFA500 0%, #FF8C00 100%)",
      border: "0.945px solid #FFA500",
      shadow: "-7px 7px 9.8px 8px rgba(255, 165, 0, 0.08)",
      statusText: "🔄 Processing",
      cardBg: "#FFF8E6",
      descBg: "#FFF3E0",
    },
    approved: {
      circleBg: "linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%)",
      border: "0.945px solid #4CAF50",
      shadow: "-7px 7px 9.8px 8px rgba(76, 175, 80, 0.08)",
      statusText: "✓ Completed",
      cardBg: "#F0FFF0",
      descBg: "#E8F5E9",
    },
    locked: {
      circleBg: "linear-gradient(90deg, #9D9D9D 0%, #2F3030 100%)",
      border: "0.945px solid #9D9D9D",
      shadow: "3.781px 3.781px 5.766px 0px rgba(0, 0, 0, 0.15)",
      statusText: "🔒 Locked",
      cardBg: "#F9FAFB",
      descBg: "#F2F2F2",
    },

    token_received: {
      circleBg: "linear-gradient(90deg, #FFD700 0%, #FFA500 100%)", // Gold gradient
      border: "0.945px solid #FFD700",
      shadow: "-7px 7px 9.8px 8px rgba(255, 215, 0, 0.08)",
      statusText: "💰 Registration Fee Received",
      cardBg: "#FFFDE7",
      descBg: "#FFF8DC",
    },
    
    
  };

  
  const stepIcons = {
    1: {
      pending: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/steps_1_blue.webp",
      in_progress: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_1_org.webp",
      approved: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_1_green.webp",
      locked: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_1_lock.webp"
    },
    2: {
      pending: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_2_blue.webp",
      in_progress: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_2_org.webp",
      approved: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_2_green.webp",
      locked: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_2_lock.webp"
    },
    3: {
      pending: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_3_blue.webp",
      in_progress: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_3_org.webp",
      approved: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_3_green.webp",
      locked: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_3_lock.webp"
    },
    4: {
      pending: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_4_blue.webp",
      in_progress: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_4_org.webp",
      approved: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_4_green.webp",
      locked: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/step_4_lock.webp",
      token_received: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/icons/yello_icon.webp",
    },

    
  };

  const currentStatus = statusColors[status] || statusColors.locked;
  const icon = stepIcons[number]?.[status] || stepIcons[number]?.locked;

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00h 00m 00s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  const calculateProgress = (secondsLeft) => {
    const totalTime = 1200; // 20 minutes in seconds
    const elapsed = totalTime - secondsLeft;
    return Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [localMeetingData, setLocalMeetingData] = useState(meetingData);
  const [meetingTimeLeft, setMeetingTimeLeft] = useState(null);
  const [isFetchingMeetingLink, setIsFetchingMeetingLink] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  useEffect(() => {
    if (number === 2 && status === 'in_progress' && meetingData?.meeting_time) {
      const calculateTimeUntilMeeting = () => {
        const meetingTime = new Date(meetingData.meeting_time);
        const now = new Date();
        const diffInSeconds = Math.floor((meetingTime - now) / 1000);
        setMeetingTimeLeft(Math.max(0, diffInSeconds));
      };

      calculateTimeUntilMeeting();
      const interval = setInterval(calculateTimeUntilMeeting, 1000);
      return () => clearInterval(interval);
    }
  }, [number, status, meetingData]);

  const filterPassedTime = (time) => {
    const now = new Date();
  
    // Check if selected date is today
    const selectedDate = new Date(time);
    const isToday =
      now.getDate() === selectedDate.getDate() &&
      now.getMonth() === selectedDate.getMonth() &&
      now.getFullYear() === selectedDate.getFullYear();
  
    if (isToday) {
      return time.getTime() > now.getTime(); // Only allow times later than now
    }
  
    // Allow all times on future days
    return true;
  };
  

  const fetchMeetingLink = async () => {
    try {
      setIsFetchingMeetingLink(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/get-meeting?email=${userEmail}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch meeting link");
      }

      setLocalMeetingData(data);
      return data.scheduled_meeting_link;
    } catch (error) {
      console.error("Error fetching meeting link:", error);
      alert(`Error: ${error.message}`);
      return null;
    } finally {
      setIsFetchingMeetingLink(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (localMeetingData?.scheduled_meeting_link) {
      window.open(localMeetingData.scheduled_meeting_link, "_blank");
      return;
    }

    const meetingLink = await fetchMeetingLink();
    if (meetingLink) {
      window.open(meetingLink, "_blank");
    }
  };

  const handleScheduleSubmit = async () => {
    if (!selectedDateTime || !userEmail) {
      alert("Please select date and time");
      return;
    }

    try {
      setIsScheduling(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/schedule-evaluation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateTime: moment(selectedDateTime).tz("Asia/Kolkata").format(),
            email: userEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule evaluation");
      }

      await fetchData();
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsScheduling(false);
    }
  };

  const shouldShowScheduleButton = 
    number === 2 && 
    status === 'pending' && 
    (!localMeetingData || !localMeetingData.exists);

  return (
    <div
      className={styles.stepCard}
      style={{
        border: currentStatus.border,
        boxShadow: currentStatus.shadow,
        cursor: status === "locked" ? "not-allowed" : "default",
        backgroundColor: currentStatus.cardBg,
        position: "relative",
      }}
    >
      {showSuccessPopup && (
        <div className={styles.successPopupOverlay}>
          <div className={styles.successPopup}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#4CAF50"/>
              </svg>
            </div>
            <h3>Evaluation Scheduled Successfully!</h3>
            <p>Your profile evaluation has been scheduled for:</p>
            <div className={styles.scheduledTime}>
              {moment(selectedDateTime).tz("Asia/Kolkata").format("dddd, MMMM D, YYYY [at] h:mm A")} (IST)
            </div>
            <button 
              onClick={() => {
                setShowSuccessPopup(false);
                setShowTooltip(false);
              }}
              className={styles.successButton}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {number === 2 && showTooltip && (
        <div className={styles.tooltipPopup}>
          <div className={styles.tooltipHeader}>
            <h4>Schedule Your Profile Evaluation</h4>
            <button
              onClick={() => setShowTooltip(false)}
              className={styles.tooltipClose}
            >
              ×
            </button>
          </div>
          <div className={styles.tooltipContent}>
          <p className={styles.tooltipMessage}>
  Select a convenient date and time for your evaluation session. Our expert will review your profile and help you move forward in the admission process.
</p>

            <div className={styles.dateTimePicker}>
            <DatePicker
  selected={selectedDateTime}
  onChange={(date) => setSelectedDateTime(date)}
  showTimeSelect
  timeFormat="HH:mm"
  timeIntervals={30}
  dateFormat="MMMM d, yyyy h:mm aa"
  minDate={new Date()}
  // filterDate={isWeekday}
  filterTime={filterPassedTime} // ✅ ensure this is passed
  placeholderText="Select date and time (IST)"
  className={styles.datePickerInput}
  timeCaption="Time (IST)"
  utcOffset={5.5 * 60}
/>

            </div>

            <div className={styles.tooltipFooter}>
              <button
                onClick={handleScheduleSubmit}
                className={styles.tooltipButton}
                disabled={isScheduling || !selectedDateTime}
              >
                {isScheduling ? (
                  <>
                    <span className={styles.spinnertwo}></span> Scheduling...
                  </>
                ) : (
                  "Confirm Schedule"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={styles.stepCircle}
        style={{ background: currentStatus.circleBg }}
        title={status === "locked" ? "Complete previous steps first" : ""}
      >
        Step {number} out of 4
      </div>

      {status !== "locked" && (
        <div
          className={styles.statusBadge}
          style={{
            border: currentStatus.border,
            backgroundColor: currentStatus.cardBg,
          }}
        >
          {currentStatus.statusText}
        </div>
      )}

      <div className={styles.stepContent}>
        <div className={styles.iconDivs}>
          <Image 
            src={icon} 
            width={50} 
            height={50} 
            alt={`Step ${number} ${status}`} 
            loading="lazy" 
          />
          <h3>{title}</h3>
        </div>
        <p className={styles.desc} style={{ backgroundColor: currentStatus.descBg }}>{description} </p>

        {children}

        {number === 1 && status === "locked" && isStep1Locked && (
          <div className={styles.contactCounselor}>
            <p>⏰ Time's up! Please contact your evaluator to Unlock your evaluation form.</p>
            <a 
              href="mailto:counselor@learnbay.co" 
              className={styles.contactButton}
            >
              Contact Evaluator 
            </a>
          </div>
        )}

        {number === 1 && status === "locked" && !isStep1Locked && (
          <button className={styles.lockedButton} disabled>
            Complete previous steps first
          </button>
        )}

        {number === 2 && (
          <>
            {status === 'locked' ? (
              <button className={styles.lockedButton} disabled>
                Complete Step 1 first
              </button>
            ) : meetingData?.completed ? (
              <button className={styles.completedButton} disabled>
                Evaluation Completed
              </button>
            ) : meetingData?.exists ? (
              <div className={styles.meetingInfo}>
                <p>
                  <strong>Scheduled:</strong>{" "}
                  {new Date(meetingData.meeting_time).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
                <button 
                  onClick={handleJoinMeeting}
                  className={styles.joinButton}
                  disabled={isFetchingMeetingLink}
                >
                  {isFetchingMeetingLink ? 'Loading...' : 'Join Meeting'}
                </button>
              </div>
            ) : status === 'pending' ? (
              <button 
                onClick={() => setShowTooltip(true)} 
                className={styles.enrollButton}
              >
                Schedule Screening
              </button>
            ) : null}
          </>
        )}

        {number === 3 && status === 'in_progress' && meetingData?.meeting_time && (
          <div className={styles.meetingContainer}>
            {meetingTimeLeft > 0 ? (
              <div className={styles.meetingTimer}>
                <p className={styles.timerText}>
                  <span>⏱</span> Meeting starts in: {formatTime(meetingTimeLeft)}
                </p>
              </div>
            ) : (
              <div className={styles.meetingAction}>
                <button 
                  onClick={handleJoinMeeting}
                  className={styles.joinButton}
                  disabled={isFetchingMeetingLink}
                >
                  {isFetchingMeetingLink ? 'Loading...' : 'Join Meeting Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {showTimer && (status === "pending" || status === "in_progress") && (
          <div className={styles.timerSection}>
            {formSubmitted || status === "in_progress" ? (
              <>
                <p className={styles.timerText}>
                  {/* <span>⏱</span> Approved: {formatTime(timeLeft)} */}
                </p>
                {/* <p className={styles.progressText}>
                  {timeLeft <= 0
                    ? "Expired"
                    : `${Math.round(calculateProgress(timeLeft))}% completed`}
                </p> */}
                <p className={styles.gren}>Your request is under review – approval is in progress.</p>
              </>
            ) : (
              ""
            )}
          </div>
        )}

        {number === 1 && status === "pending" && deadline && (
          <div className={styles.timerSection}>
            <p className={styles.timerText}>
              <span>⏱</span> Time left to start: {formatTime(timeLeft)}
            </p>
          </div>
        )}

        {number === 1 && status === "pending" && (
          <button
            onClick={openModal}
            className={styles.enrollButton}
          >
            Start Your Application
          </button>
        )}

        {number === 1 && status === "in_progress" && (
          <button className={styles.processingButton} disabled>
            Application Submitted
          </button>
        )}

        {number === 1 && status === "approved" && (
          <button className={styles.completedButton} disabled>
            Step 1 Completed
          </button>
        )}

        {number === 3 && status === "approved" && (
          <DownloadOfferLetter userEmail={userEmail} />
        )}

        {number === 3 && status === "pending" && (
          <DownloadOfferLetter
            userEmail={userEmail}
            onGenerate={async () => {
              setEnrollmentStatus((prev) => ({
                ...prev,
                step3: "approved",
                progress: "75%",
              }));

              await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/complete-steps`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: userEmail,
                    steps: ["step3"],
                    status: "approved",
                  }),
                }
              );
            }}
          />
        )}

        {number === 3 && status === 'pending' && (
          <div className={styles.hintBubble}>
            <span>✅ Step 2 completed!</span>
            <p>You can now download your offer letter</p>
          </div>
        )}

        {number === 4 && status === "pending" && (
          <button 
            onClick={handlePaymentClick}
            className={styles.enrollButton}
          >
            Block your seat
          </button>
        )}

        {number === 4 && status === "in_progress" && (
          <div className={styles.paymentProcessing}>
            <button 
              onClick={() => window.open("https://pages.razorpay.com/learnbay", "_blank")}
              className={styles.retryButton}
            >
              Open Payment Again
            </button>
          </div>
        )}

        {number === 4 && status === "approved" && (
          <button className={styles.completedButton} disabled>
            Payment Completed
          </button>
        )}

        {(number === 3 || number === 4) && status === "locked" && (
          <button className={styles.lockedButton} disabled>
            Complete Step {number - 1} first
          </button>
        )}

{number === 4 && status === "token_received" && (
  <div className={styles.paymentProcessing}>
    <button className={`${styles.TokenButton} ${styles.TokenButton}`} disabled>
     Registration Fee Received
    </button>
  </div>
)}

      </div>

      {showTimer &&
        (status === "pending" || status === "in_progress") &&
        (formSubmitted || status === "in_progress") && (
          // <div className={styles.progressBarContainer}>
          //   <div
          //     className={styles.progressBarFill}
          //     style={{ width: `${calculateProgress(timeLeft)}%` }}
          //   ></div>
          // </div>
          ''
        )}
    </div>
  );
}

export default function Steps({
  onOpenModal,
  userEmail,
  user,
  currentStep,
  onStepChange,
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    step1: "locked",
    step2: "locked",
    step3: "locked",
    step4: "locked",
    progress: "0%",
    timestamps: {
      step1: null,
      step2: null,
      step3: null,
      step4: null,
    },
  });
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [isStep1Locked, setIsStep1Locked] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const calculateTimeLeft = () => {
    if (!deadline) return 0;
    
    const now = new Date();
    const deadlineTime = new Date(deadline);
    const diffInSeconds = Math.floor((deadlineTime - now) / 1000);
    
    return Math.max(0, diffInSeconds);
  };

  const fetchData = async () => {
    try {
      // Fetch enrollment status
      const statusResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/progress?email=${userEmail}`
      );
      const statusData = await statusResponse.json();
  
      // Fetch meeting data
      const meetingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/get-meeting?email=${userEmail}`
      );
      const meetingData = await meetingResponse.json();

      // Fetch payment status
      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/check-payment?email=${userEmail}`
      );
      const paymentData = await paymentResponse.json();
      
      setMeetingData(meetingData);
      // setPaymentStatus(paymentData.payment_status === '1' ? 1 : 0);
      setPaymentStatus(paymentData.payment_status); // Accepts null, '', 0, or 1


      if (statusResponse.ok) {
        // Calculate progress based on all completed steps
        let completedSteps = 0;
        const totalSteps = 4;

        // Step 1 completed
        if (statusData.step1 === 'approved') completedSteps++;
        
        // Step 2 completed (meeting completed)
        if (meetingData?.completed) completedSteps++;
        
        // Step 3 completed (offer letter exists or status approved)
        if (statusData.step3 === 'approved' || user?.offer_letter_path) completedSteps++;
        
        // Step 4 completed (payment completed)
        if (paymentData.payment_status === '1') {
          completedSteps++;
        }
        
        const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
        const progress = `${progressPercentage}%`;
        
        setEnrollmentStatus((prev) => ({
          ...prev,
          ...statusData,
          progress,
          step4:
          paymentData.payment_status === '1'
            ? 'approved'
            : paymentData.payment_status === '0'
              ? 'in_progress'
              : (statusData.step3 === 'approved' || user?.offer_letter_path)
                ? 'pending'
                : 'locked',
            
          timestamps: {
            ...prev.timestamps,
            ...(statusData.timestamps || {}),
            step1: statusData.step1_timestamp
          },
        }));

        // Calculate deadline based on user_creation_time and application_time
        if (user?.user_creation_time && user?.application_time) {
          const creationTime = new Date(user.user_creation_time);
          const [hours, minutes, seconds] = user.application_time.split(':').map(Number);
        
          const deadlineDate = new Date(creationTime);
          deadlineDate.setHours(creationTime.getHours() + hours);
          deadlineDate.setMinutes(creationTime.getMinutes() + minutes);
          deadlineDate.setSeconds(creationTime.getSeconds() + seconds);
        
          // ✅ Subtract 5:30 manually
          deadlineDate.setHours(deadlineDate.getHours() - 5);
          deadlineDate.setMinutes(deadlineDate.getMinutes() - 30);
        
          // ✅ Add logging
          // console.log("🕒 Adjusted Deadline:", deadlineDate.toISOString());
        
          const now = new Date();
          const initialTimeLeft = Math.floor((deadlineDate - now) / 1000);
          // console.log("⏱ Time left (seconds):", initialTimeLeft);
        
          setDeadline(deadlineDate);
          setTimeLeft(Math.max(0, initialTimeLeft));
        
          if (initialTimeLeft <= 0 && getStepStatus(1) === 'pending') {
            setIsStep1Locked(true);
            setEnrollmentStatus(prev => ({
              ...prev,
              step1: "locked"
            }));
          }
        }
        
          
        //   // Calculate initial time left
        //   const now = new Date();
        //   const initialTimeLeft = Math.floor((deadlineDate - now) / 1000);
        //   setTimeLeft(Math.max(0, initialTimeLeft));
          
        //   // Check if we should lock step 1
        //   if (initialTimeLeft <= 0 && getStepStatus(1) === 'pending') {
        //     setIsStep1Locked(true);
        //     setEnrollmentStatus(prev => ({
        //       ...prev,
        //       step1: "locked"
        //     }));
        //   }
        // }

        if (statusData.step1_timestamp) {
          const approvalTime = new Date(statusData.step1_timestamp);
          const now = new Date();
          const elapsedSeconds = Math.floor((now - approvalTime) / 1000);
          
          if (statusData.step1 === 'approved') {
            setFormSubmitted(true);
            setTimeLeft(0);
          } else if (statusData.created_at) {
            const createdAt = new Date(statusData.created_at);
            const elapsedSeconds = Math.floor((now - createdAt) / 1000);
            const remainingSeconds = Math.max(0, 120 - elapsedSeconds);
            setTimeLeft(remainingSeconds);
            setFormSubmitted(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  useEffect(() => {
    if (deadline && getStepStatus(1) === "pending" && !formSubmitted && !isStep1Locked) {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
        
        if (newTimeLeft <= 0) {
          setIsStep1Locked(true);
          setEnrollmentStatus(prev => ({
            ...prev,
            step1: "locked"
          }));
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [deadline, formSubmitted, isStep1Locked]);

  useEffect(() => {
    if (formSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [formSubmitted, timeLeft]);

  const handleEnrollmentComplete = async () => {
    closeModal();
    setFormSubmitted(true);
    await fetchData();
    if (onStepChange) onStepChange(2);
  };

  const handleScheduleComplete = async () => {
    await fetchData();
  };
  const handlePaymentClick = async () => {
    try {
      setEnrollmentStatus(prev => ({
        ...prev,
        step4: "in_progress"
      }));
  
      console.log("⏳ Initiating payment status update...");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/initiate-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: userEmail })
      });
  
      const result = await res.json();
  
      console.log("🚀 Backend response:", result);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to initiate payment");
      }
      
  
      const paymentWindow = window.open(
        "https://pages.razorpay.com/learnbay",
        "_blank"
      );
  
      // continue polling logic here...
    } catch (error) {
      console.error("❌ Error handling payment:", error);
    }
  };
  

  const getStepStatus = (stepNumber) => {
    const stepKey = `step${stepNumber}`;
    let currentStatus = enrollmentStatus[stepKey];
  
    if (stepNumber === 1) {
      if (isStep1Locked) return 'locked';
      if (currentStatus === 'pending' && enrollmentStatus.timestamps?.step1) {
        const createdAt = new Date(enrollmentStatus.timestamps.step1);
        const now = new Date();
        const elapsedSeconds = Math.floor((now - createdAt) / 1000);
        
        if (elapsedSeconds >= 120) {
          return 'approved';
        }
        return 'in_progress';
      }
      return currentStatus || 'pending';
    }
  
    if (stepNumber === 2) {
      if (enrollmentStatus.step1 !== 'approved') return 'locked';
      if (meetingData?.completed) return 'approved';
      if (meetingData?.exists) return 'in_progress';
      return 'pending';
    }
  
    if (stepNumber === 3) {
      if (user?.offer_letter_path) return 'approved';
      if (enrollmentStatus.step3 === 'approved') return 'approved';
      if (meetingData?.completed) return 'pending';
      return 'locked';
    }
    if (stepNumber === 4) {
      if (paymentStatus === 1) return 'approved';
      if (paymentStatus === 0) return 'token_received';
      if (paymentStatus === '') return 'in_progress'; // ✅ handles '' as "Processing"
      if (paymentStatus === null && (enrollmentStatus.step3 === 'approved' || user?.offer_letter_path)) return 'pending';
      return 'locked';
    }
    
    
    
    
    
    return 'locked';
  };

  const steps = [
    {
      iconActive: "/icons/icon_pendning.webp",
      iconInactive: "/icons/icon_locked.webp",
      title: "Evaluation Form ",
      description:
        "Begin your Learnbay journey by filling out the exclusive Evaluation form and get ready",
      showTimer: true,
    },
    {
      iconActive: "/icons/icon_pendning.webp",
      iconInactive: "/icons/dark_icon.webp",
      title: "Profile evaluation or Screening",
      description:
        "Schedule your personalized screening with our advisors to discuss your profile and program fit.",
      showTimer: false,
    },
    {
      iconActive: "/icons/icon_pendning.webp",
      iconInactive: "/icons/dark_icon.webp",
      title: "Program Offer Letter",
      description:
        "Receive and review your official Learnbay offer letter outlining program details.",
    },
    {
      iconActive: "/icons/icon_pendning.webp",
      iconInactive: "/icons/dark_icon.webp",
      title: "Complete Payment & Enroll",
      description:
        "Secure your spot in the Learnbay program by completing the registration fee payment.",
    },
  ];

if (loading) {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
      <p>Loading enrollment status...</p>
    </div>
  );
}

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Learnbay Admission Process</h2>
        <div className={styles.label}>
          <span>Progress: {enrollmentStatus.progress} completed</span>
        </div>
      </div>

      <div className={styles.stepsGrid}>
        {steps.map((step, idx) => {
          const number = idx + 1;
          const status = getStepStatus(number);
          const icon = status === "locked" ? step.iconInactive : step.iconActive;
          const stepTimeLeft = number === 1 ? timeLeft : null;

          return (
            <StepCard
              key={number}
              number={number}
              title={step.title}
              status={status}
              icon={icon}
              description={step.description}
              showTimer={number === 1 && step.showTimer}
              timeLeft={stepTimeLeft}
              onScheduleComplete={handleScheduleComplete}
              userEmail={userEmail}
              formSubmitted={formSubmitted}
              meetingData={number === 2 ? meetingData : null}
              fetchData={fetchData}
              deadline={number === 1 ? deadline : null}
              isStep1Locked={number === 1 ? isStep1Locked : false}
              openModal={openModal}
              setEnrollmentStatus={setEnrollmentStatus}
              handlePaymentClick={handlePaymentClick}
            />
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <EnrollmentForm
          onComplete={handleEnrollmentComplete}
          onClose={closeModal}
          userEmail={userEmail}
          user={user}
        />
      </Modal>
    </div>
  );
}