import React, { useState } from "react";
import styles from "./SuccessStories.module.css";
import Image from "next/image";

const testimonials = [
 
  {
    name: "Mohamod Israr",
    role: "Data Scientist",
    review: "Thanks to the LearnBay data science course & excellent guidance. I was able to crack the TCS interview and secure a job with a 397% pay raise. The real-world projects helped me develop my concepts as a data scientist.",
    domain: "Sales Domain",
    company: "Teleperformance",
    salaryHike: "397%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/md.webp",
    comIcons: "/company-logos/teleperformance.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/x_EmBJ-h7DE"
  },
  {
    name: "Preksha Mishra",
    role: "Lead Data Scientist",
    review: "Learnbay’s Data Science course helped me switch careers confidently, even from a non-tech background. The real-world projects and expert guidance made all the difference.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/prekhasss.webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/vSjfKdIzUjY"
  },

  {
    name: "Antony Isarel",
    role: "Data Science & ML specialist",
    review: "Transitioning from civil engineering to data science seemed daunting, but Learnbay's comprehensive course and dedicated mentorship made it achievable. The hands-on projects and real-world applications provided the confidence I needed to secure a role in data science.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/one+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 4,
    video: true,
    videoUrl: "https://www.youtube.com/embed/VAqTQpvr7_g?si=nnIg21pOyQlipFmH"
  },

  {
    name: "Venkata Uday Kumar",
    role: "Data Scientist",
    review: "From working as a Data Analyst to upskilling and becoming a Battery Data Scientist at Fluence; hear from Venkata Uday Kumar, his journey into the tech world with Learnbay.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/two+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 4,
    video: true,
    videoUrl: "https://www.youtube.com/embed/QZMhmUcRIP8?si=fmpHaCdVVM246fNN"
  },

  {
    name: "Nachiket Dixit",
    role: "Data Science specialist",
    review: "From working as a Data Analyst to upskilling and becoming a Battery Data Scientist at Fluence; hear from Venkata Uday Kumar, his journey into the tech world with Learnbay.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/three+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/1Zj9PnOzHzA?si=727PkhdVcTCoar-F"
  },

  {
    name: "Ajay Dobliyal",
    role: "Business Analyst",
    review: "From working as a Data Analyst to upskilling and becoming a Battery Data Scientist at Fluence; hear from Venkata Uday Kumar, his journey into the tech world with Learnbay.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/four+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/CaxtNOWgzWs?si=ss8HY5Gn1j1KNe1Y"
  },


  {
    name: "Chandrika",
    role: "data science engineer",
    review: "From working as a Data Analyst to upskilling and becoming a Battery Data Scientist at Fluence; hear from Venkata Uday Kumar, his journey into the tech world with Learnbay.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/five+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/yAfsDFsqW10?si=UK42OD6__tYvF0tM"
  },

  {
    name: "Shravanthi A",
    role: "Data Scientist",
    review: "LearnBay has helped me a lot to learn data science applications in the e-commerce industry. The live class concept was really helpful in receiving proper DS training. Thanks to all my mentors and the placement team.",
    domain: "Mechanical Domain",
    company: "Ford",
    salaryHike: "161%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/sharvann.webp",
    comIcons: "/company-logos/ford.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/ford-testimonial"
  },

  {
    name: "Salvi Harshada",
    role: "business analyst",
    review: "From working as a Data Analyst to upskilling and becoming a Battery Data Scientist at Fluence; hear from Venkata Uday Kumar, his journey into the tech world with Learnbay.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/six+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/qpg_FysX9Z4?si=ulhmiH97qJgHzoqU"
  },

  {
    name: "Khush Narula",
    role: "business analyst",
    review: "From working as a Data Analyst to upskilling and becoming a Battery Data Scientist at Fluence; hear from Venkata Uday Kumar, his journey into the tech world with Learnbay.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "848%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/seven+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/dU6eLmZFpHM?si=omlVONZFNC8zBnna"
  },


  {
    name: "Swathi",
    role: "Power BI Developer",
    review: "From working as a Data Analyst to upskilling and becoming a Battery Data Scientist at Fluence; hear from Venkata Uday Kumar, his journey into the tech world with Learnbay.",
    domain: "Telecom Domain",
    company: "HCL",
    salaryHike: "84%",
    profile: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/testimonals/eight+(1).webp",
    comIcons: "/company-logos/hcl.webp",
    rating: 5,
    video: true,
    videoUrl: "https://www.youtube.com/embed/ghJ1f8huDUI?si=Z0HRXDcKuhUbGiwC"
  },












  // {
  //   name: "Shubham Kumar",
  //   role: "Data Scientist",
  //   review: "LearnBay has helped me a lot to learn data science applications in the e-commerce industry. The live class concept was really helpful in receiving proper DS training. Thanks to all my mentors and the placement team.",
  //   domain: "Mechanical Domain",
  //   company: "Ford",
  //   salaryHike: "161%",
  //   profile: "/testimonials/shravanthi.webp",
  //   comIcons: "/company-logos/ford.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/JoKquvfAhZU"
  // },

  // {
  //   name: "Jaya Sinha",
  //   role: "Data Scientist",
  //   review: "LearnBay has helped me a lot to learn data science applications in the e-commerce industry. The live class concept was really helpful in receiving proper DS training. Thanks to all my mentors and the placement team.",
  //   domain: "Manifacture Domain",
  //   company: "Ford",
  //   salaryHike: "161%",
  //   profile: "/testimonials/shravanthi.webp",
  //   comIcons: "/company-logos/ford.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/A-BkcEM0rQM"
  // },

  // {
  //   name: "Aravind Kumar",
  //   role: "Data Scientist",
  //   review: "LearnBay has helped me a lot to learn data science applications in the e-commerce industry. The live class concept was really helpful in receiving proper DS training. Thanks to all my mentors and the placement team.",
  //   domain: "Manifacture Domain",
  //   company: "Ford",
  //   salaryHike: "161%",
  //   profile: "/testimonials/shravanthi.webp",
  //   comIcons: "/company-logos/ford.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/hewBtR_WoDM"
  // },


  




















  // {
  //   name: "Laxmi Sushmita",
  //   role: "business Analyst",
  //   review: "Swiching to data science with Learnbay was a game changer. after one on one doubt sessions and working on sevral projects I got job offer from netwest with 80% salary hike while i was still in the middle of the course ",
  //   domain: "Banking Domain",
  //   company: "Ford",
  //   salaryHike: "161%",
  //   profile: "/testimonials/shravanthi.webp",
  //   comIcons: "/company-logos/ford.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/myRKzYu1N5E"
  // },


 
 
 
  // {
  //   name: "Rahul Sharma",
  //   role: "Machine Learning Engineer",
  //   review: "The hands-on projects and industry-relevant curriculum helped me transition from a software developer to ML engineer. The career support team was exceptional in preparing me for interviews.",
  //   domain: "IT Domain",
  //   company: "Google",
  //   salaryHike: "220%",
  //   profile: "/testimonials/rahul.webp",
  //   comIcons: "/company-logos/google.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/google-testimonial"
  // },
  // {
  //   name: "Priya Patel",
  //   role: "Data Analyst",
  //   review: "As a fresher, I was struggling to get my first break. The course gave me practical skills and confidence. Got placed within 3 months of completion with a great package at Amazon!",
  //   domain: "Finance Domain",
  //   company: "Amazon",
  //   salaryHike: "180%",
  //   profile: "/testimonials/priya.webp",
  //   comIcons: "/company-logos/amazon.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/amazon-testimonial"
  // },
  // {
  //   name: "Amit Singh",
  //   role: "AI Specialist",
  //   review: "The depth of content and quality of instructors exceeded my expectations. I was able to implement AI solutions at my workplace immediately after the course at IBM.",
  //   domain: "Healthcare Domain",
  //   company: "IBM",
  //   salaryHike: "300%",
  //   profile: "/testimonials/amit.webp",
  //   comIcons: "/company-logos/ibm.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/ibm-testimonial"
  // },
  // {
  //   name: "Neha Gupta",
  //   role: "Business Analyst",
  //   review: "Perfect blend of technical and business concepts. The case study approach helped me understand real business problems and how data can solve them at Microsoft.",
  //   domain: "Retail Domain",
  //   company: "Microsoft",
  //   salaryHike: "150%",
  //   profile: "/testimonials/neha.webp",
  //   comIcons: "/company-logos/microsoft.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/microsoft-testimonial"
  // },
  // {
  //   name: "Vikram Joshi",
  //   role: "Data Engineer",
  //   review: "The big data and cloud modules were game-changers for me. Got certified and promoted within 6 months of completing the course at Accenture.",
  //   domain: "Logistics Domain",
  //   company: "Accenture",
  //   salaryHike: "175%",
  //   profile: "/testimonials/vikram.webp",
  //   comIcons: "/company-logos/accenture.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/accenture-testimonial"
  // },
  // {
  //   name: "Ananya Reddy",
  //   role: "Research Scientist",
  //   review: "Coming from academia, I needed practical ML skills. The course bridged that gap perfectly and helped me land my dream research role at Pfizer.",
  //   domain: "Pharmaceutical Domain",
  //   company: "Pfizer",
  //   salaryHike: "250%",
  //   profile: "/testimonials/ananya.webp",
  //   comIcons: "/company-logos/pfizer.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/pfizer-testimonial"
  // },
  // {
  //   name: "Karthik Nair",
  //   role: "Senior Data Scientist",
  //   review: "The capstone project was instrumental in my career growth. It gave me something substantial to showcase during interviews and helped me negotiate better at Tesla.",
  //   domain: "Automotive Domain",
  //   company: "Tesla",
  //   salaryHike: "200%",
  //   profile: "/testimonials/karthik.webp",
  //   comIcons: "/company-logos/tesla.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/tesla-testimonial"
  // },
  // {
  //   name: "Sneha Verma",
  //   role: "Data Science Consultant",
  //   review: "The industry projects and mentorship helped me transition from banking to data science. Landed a consulting role at Deloitte with 230% hike.",
  //   domain: "Banking Domain",
  //   company: "Deloitte",
  //   salaryHike: "230%",
  //   profile: "/testimonials/sneha.webp",
  //   comIcons: "/company-logos/deloitte.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/deloitte-testimonial"
  // },
  // {
  //   name: "Arjun Mehta",
  //   role: "AI Engineer",
  //   review: "The advanced AI specialization helped me stand out. Got placed at Intel with 280% salary increase immediately after course completion.",
  //   domain: "Electronics Domain",
  //   company: "Intel",
  //   salaryHike: "280%",
  //   profile: "/testimonials/arjun.webp",
  //   comIcons: "/company-logos/intel.webp",
  //   rating: 5,
  //   video: true,
  //   videoUrl: "https://www.youtube.com/embed/intel-testimonial"
  // }
];

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
    <mask id="mask0_63_1373" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="21">
      <rect x="0.76123" y="0.756592" width="20.177" height="20.177" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_63_1373)">
      <path d="M9.16805 12.5265L14.2123 9.16365L9.16805 5.80082V12.5265ZM2.44238 19.2521V4.1194C2.44238 3.65701 2.60702 3.26118 2.9363 2.9319C3.26558 2.60263 3.66141 2.43799 4.1238 2.43799H17.5751C18.0375 2.43799 18.4333 2.60263 18.7626 2.9319C19.0919 3.26118 19.2565 3.65701 19.2565 4.1194V14.2079C19.2565 14.6703 19.0919 15.0661 18.7626 15.3954C18.4333 15.7247 18.0375 15.8893 17.5751 15.8893H5.80521L2.44238 19.2521ZM5.09061 14.2079H17.5751V4.1194H4.1238V15.1537L5.09061 14.2079Z" fill="#F91500"/>
    </g>
  </svg>
);

const VideoPopup = ({ videoUrl, onClose }) => {
  return (
    <div className={styles.videoPopupOverlay} onClick={onClose}>
      <div className={styles.videoPopupContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.videoWrapper}>
          <iframe
            src={videoUrl}
            title="Testimonial Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [visibleTestimonials, setVisibleTestimonials] = useState(6);

  const openVideo = (videoUrl) => {
    setCurrentVideo(videoUrl);
  };

  const closeVideo = () => {
    setCurrentVideo(null);
  };

  const loadMore = () => {
    setVisibleTestimonials(testimonials.length);
  };

  const showLess = () => {
    setVisibleTestimonials(6);
  };

const getInitials = (name) => {
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  
  return initials;
};

const Avatar = ({ name, profile, width, height }) => {
  const [imageError, setImageError] = useState(false);
  
  if (profile && !imageError) {
    return (
      <Image 
        className={styles.avatarPlaceholder} 
        src={profile} 
        width={width} 
        height={height} 
        alt={name}
        onError={() => setImageError(true)}
      />
    );
  }


  return (
    <div className={styles.avatarInitials} style={{ width, height }}>
      {getInitials(name)}
    </div>
  );
};
  

  return (
    <section className={styles.successSection}>
      <div className={styles.header}>
        <h2>Student Success Stories</h2>
        <p>See how Learning has transformed careers and created life-changing opportunities for our students</p>
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Successful Placements</span>
          </div>
          <div className={`${styles.statBox} ${styles.statBoxc}`}>
            <span className={styles.statNumber}>150%</span>
            <span className={styles.statLabel}>Average Salary Hike</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Hiring Partners</span>
          </div>
        </div>
      </div>

    <div className={styles.testimonialsContainer}>
        <h2 className={styles.testimonialsTitle}>Student Testimonials</h2>
        <div className={styles.testimonials}>
          {testimonials.slice(0, visibleTestimonials).map((item, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.profile}>
             <div className={styles.newprofile}> 

             {/* <Avatar 
                  name={item.name} 
                  profile={item.profile} 
                  width={60} 
                  height={60} 
                /> */}
                <Image src={item.profile} width={120} height={120} loading="lazy" className={styles.profile}/>
                <div className={styles.profileInfo}>
                  <h4>{item.name}</h4>
                  <p>{item.role}</p>
                  <div className={styles.rating}>{"⭐".repeat(item.rating)}</div>
                </div>
             </div>
            <div>
            {item.video && (
                  <button 
                    className={styles.videoTag} 
                    onClick={() => openVideo(item.videoUrl)}
                    aria-label={`Watch ${item.name}'s video testimonial`}
                  >
                    <VideoIcon /> Watch Video
                  </button>
                )}
            </div>
              </div>
              <p className={styles.review}>"{item.review}"</p>
              <div className={styles.cardFooter}>
                <div className={styles.footerInner}>
             <p className={styles.pss}>   {item.domain}    →  <strong>{item.role}</strong></p> 
                  {/* <Image src={item.comIcons} width={50} height={20} alt={item.company} /> */}
                </div>
                <hr className={styles.hr}/>
                <span className={styles.salaryHike}>{item.salaryHike} Salary Hike</span>
              </div>
            </div>
          ))}
       
           
        </div>
        
        <div className={styles.loadMoreContainer}>
          {visibleTestimonials < testimonials.length ? (
            <button className={styles.loadMoreButton} onClick={loadMore}>
              Load More Success Stories
            </button>
          ) : (
            <button className={styles.loadMoreButton} onClick={showLess}>
              Show Less
            </button>
          )}
        </div>
      </div>

      {currentVideo && <VideoPopup videoUrl={currentVideo} onClose={closeVideo} />}
    </section>
  );
};

export default SuccessStories;