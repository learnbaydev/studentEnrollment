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
  icon,
  timeLeft,
  userEmail,
  onScheduleComplete,
  formSubmitted,
  meetingData,
  fetchData,
}) {
  const statusColors = {
    pending: {
      circleBg: "linear-gradient(90deg, #037FF7 0%, #02529F 100%)",
      border: "0.945px solid #037FF7",
      shadow: "-7px 7px 9.8px 8px rgba(0, 114, 188, 0.08)",
      statusText: "⏱ Pending",
      cardBg: "#FFF",
    },
    in_progress: {
      circleBg: "linear-gradient(90deg, #FFA500 0%, #FF8C00 100%)",
      border: "0.945px solid #FFA500",
      shadow: "-7px 7px 9.8px 8px rgba(255, 165, 0, 0.08)",
      statusText: "🔄 Processing",
      cardBg: "#FFF8E6",
    },
    approved: {
      circleBg: "linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%)",
      border: "0.945px solid #4CAF50",
      shadow: "-7px 7px 9.8px 8px rgba(76, 175, 80, 0.08)",
      statusText: "✓ Completed",
      cardBg: "#F0FFF0",
    },
    locked: {
      circleBg: "linear-gradient(90deg, #9D9D9D 0%, #2F3030 100%)",
      border: "0.945px solid #9D9D9D",
      shadow: "3.781px 3.781px 5.766px 0px rgba(0, 0, 0, 0.15)",
      statusText: "🔒 Locked",
      cardBg: "#F9FAFB",
    },
  };

  const currentStatus = statusColors[status] || statusColors.locked;

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

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Sunday = 0, Saturday = 6
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
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const currentTime = new Date();
    
    // Convert to IST (UTC+5:30)
    const currentIST = new Date(currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000) + (5.5 * 3600000));
    if (time.getDate() === currentIST.getDate() &&
        time.getMonth() === currentIST.getMonth() &&
        time.getFullYear() === currentIST.getFullYear()) {
      return (hours > currentIST.getHours() || 
             (hours === currentIST.getHours() && minutes > currentIST.getMinutes()));
    }

    // Normal business hours (9AM to 5PM IST)
    return hours >= 9 && hours <= 17;
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
      setShowTooltip(false);
      alert("Evaluation scheduled successfully!");
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
              Select a date and time for your evaluation call (Monday-Friday, 9AM-5PM)
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
                filterDate={isWeekday}
                filterTime={filterPassedTime}
                placeholderText="Select date and time (IST)"
                className={styles.datePickerInput}
                timeCaption="Time (IST)"
                utcOffset={5.5 * 60}
                calendarClassName={styles.datePickerCalendar} 
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
                    <span className={styles.spinner}></span> Scheduling...
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
          <Image src={icon} width={50} height={50} alt="icons" loading="lazy" />
          <h3>{title}</h3>
        </div>
        <p className={styles.desc}>{description}</p>

        {children}

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
    weekday: 'short', // e.g., "Mon"
    month: 'short',  // e.g., "Jun"
    day: 'numeric',  // e.g., "5"
    year: 'numeric', // e.g., "2023"
    hour: 'numeric', // e.g., "2"
    minute: '2-digit', // e.g., "30"
    hour12: true     // This ensures 12-hour format
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
                Schedule Evaluation
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
                  <span>⏱</span> Expires in: {formatTime(timeLeft)}
                </p>
                <p className={styles.progressText}>
                  {timeLeft <= 0
                    ? "Expired"
                    : `${Math.round(calculateProgress(timeLeft))}% completed`}
                </p>
              </>
            ) : (
              <p className={styles.timerText}>
                Timer will start after form submission
              </p>
            )}
          </div>
        )}
      </div>

      {showTimer &&
        (status === "pending" || status === "in_progress") &&
        (formSubmitted || status === "in_progress") && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${calculateProgress(timeLeft)}%` }}
            ></div>
          </div>
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
  const [timeLeft, setTimeLeft] = useState(1200);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [meetingData, setMeetingData] = useState(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // const fetchData = async () => {
  //   try {
  //     const statusResponse = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/progress?email=${userEmail}`
  //     );
  //     const statusData = await statusResponse.json();
  
  //     const meetingResponse = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/get-meeting?email=${userEmail}`
  //     );
  //     const meetingData = await meetingResponse.json();
      
  //     setMeetingData(meetingData);
  
  //     if (statusResponse.ok) {
  //       setEnrollmentStatus((prev) => ({
  //         ...prev,
  //         ...statusData,
  //         timestamps: {
  //           ...prev.timestamps,
  //           ...(statusData.timestamps || {}),
  //         },
  //       }));
  
  //       if (statusData.timestamps?.step1) {
  //         setFormSubmitted(true);
  //         const createdAt = new Date(statusData.timestamps.step1);
  //         const now = new Date();
  //         const elapsedSeconds = Math.floor((now - createdAt) / 1000);
  //         const remainingSeconds = Math.max(0, 1200 - elapsedSeconds);
  //         setTimeLeft(remainingSeconds);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    try {
      const statusResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/progress?email=${userEmail}`
      );
      const statusData = await statusResponse.json();
  
      const meetingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/get-meeting?email=${userEmail}`
      );
      const meetingData = await meetingResponse.json();
      
      setMeetingData(meetingData);
  
      if (statusResponse.ok) {
        setEnrollmentStatus((prev) => ({
          ...prev,
          ...statusData,
          timestamps: {
            ...prev.timestamps,
            ...(statusData.timestamps || {}),
            step1: statusData.step1_timestamp // Use the timestamp from backend
          },
        }));
  
        if (statusData.step1_timestamp) {
          const approvalTime = new Date(statusData.step1_timestamp);
          const now = new Date();
          const elapsedSeconds = Math.floor((now - approvalTime) / 1000);
          
          // If step1 is approved, we don't need the timer anymore
          if (statusData.step1 === 'approved') {
            setFormSubmitted(true);
            setTimeLeft(0);
          } else if (statusData.created_at) {
            // If still pending, calculate time left
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

  // const getStepStatus = (stepNumber) => {
  //   const stepKey = `step${stepNumber}`;
  //   let currentStatus = enrollmentStatus[stepKey];
  
  //   if (stepNumber === 1) {
  //     return currentStatus || 'pending';
  //   }
  
  //   if (stepNumber === 2) {
  //     if (enrollmentStatus.step1 !== 'approved') return 'locked';
  //     if (meetingData?.completed) return 'approved';
  //     if (meetingData?.exists) return 'in_progress';
  //     return 'pending';
  //   }
  
  //   if (stepNumber === 3) {
  //     if (enrollmentStatus.step3 === 'approved') return 'approved';
  //     if (meetingData?.completed) return 'pending';
  //     return 'locked';
  //   }
  
  //   if (stepNumber === 4) {
  //     if (enrollmentStatus.step3 !== 'approved') return 'locked';
  //     if (enrollmentStatus.step4 === 'approved') return 'approved';
  //     if (enrollmentStatus.step4 === 'in_progress') return 'in_progress';
  //     return 'pending';
  //   }
  
  //   return 'locked';
  // };

  // Update the getStepStatus function to handle auto-approval
const getStepStatus = (stepNumber) => {
  const stepKey = `step${stepNumber}`;
  let currentStatus = enrollmentStatus[stepKey];

  if (stepNumber === 1) {
    // Check if 2 minutes have passed since creation
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

  // Rest of the logic remains the same...
  if (stepNumber === 2) {
    if (enrollmentStatus.step1 !== 'approved') return 'locked';
    if (meetingData?.completed) return 'approved';
    if (meetingData?.exists) return 'in_progress';
    return 'pending';
  }

  if (stepNumber === 3) {
    if (enrollmentStatus.step3 === 'approved') return 'approved';
    if (meetingData?.completed) return 'pending';
    return 'locked';
  }

  if (stepNumber === 4) {
    if (enrollmentStatus.step3 !== 'approved') return 'locked';
    if (enrollmentStatus.step4 === 'approved') return 'approved';
    if (enrollmentStatus.step4 === 'in_progress') return 'in_progress';
    return 'pending';
  }

  return 'locked';
};
  
  const steps = [
    {
      iconActive: "/icons/icon_pendning.webp",
      iconInactive: "/icons/icon_locked.webp",
      title: "Eligibility & Application Form",
      description:
        "Begin your Learnbay journey by filling out the comprehensive eligibility and application form.",
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
        "Receive and review your official Learnbay offer letter outlining program details and scholarship.",
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
    return <div className={styles.container}>Loading enrollment status...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Learnbay Admission Process</h2>
        <div className={styles.label}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
          >
            <circle cx="7.00949" cy="7.72818" r="6.9094" fill="#F99600" />
          </svg>
          <span>Progress: {enrollmentStatus.progress}% completed</span>
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
            >
              {number === 1 && status === "pending" && (
                <button onClick={openModal} className={styles.enrollButton}>
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
                      step4: "approved",
                      progress: "100%",
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
                          steps: ["step3", "step4"],
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

              {number === 4 && status === "approved" && (
                <button 
                  onClick={() => window.open("https://razorpay.com/payment-link/plink_QWKwR1uZjHH8UG", "_blank")}
                  className={styles.completedButton}
                  style={{ cursor: "pointer" }}
                >
                  Make Payment
                </button>
              )}

              {(number === 3 || number === 4) && status === "locked" && (
                <button className={styles.lockedButton} disabled>
                  Complete Step {number - 1} first
                </button>
              )}
            </StepCard>
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