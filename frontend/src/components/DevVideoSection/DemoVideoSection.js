import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './DemoVideo.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const DemoSessions = () => {
  const [activeTab, setActiveTab] = useState('DevOps');
  const [activeVideo, setActiveVideo] = useState(null);

  const categories = [
    { id: 'DevOps', name: 'GenAI' },
    { id: 'AIML', name: 'AI/ML' },
    { id: 'PythonandStatistics', name: 'Python & Statistics' },
    { id: 'Cloud', name: 'Cloud Computing & DevOps' },

    { id: 'CyberSecurity', name: 'projects' },
    // { id: 'DSA', name: 'Data Structures & Algorithms' },
  ];

  const courses = {
    DevOps: [
      {
        id: 1,
        title: "Master Coding with GenAI",
        videoId: "kNqmngXoTmE",
        description: "An Ed-tech platform dedicated to offering Data Science and Cloud & DevOps programs to working professionals, along with 1:1 personal mentorship from our trainers.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/ten.webp"
      },

      {
        id: 1,
        title: "Best AI Tools for Productivity & Creativity in 2024 ",
        videoId: "0vTOmLDbUbU",
        description: "we'll be exploring the most popular and cutting-edge Gen AI tools that you should know about in 2024.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/elven.webp"
      },
    ],
    AIML: [
      {
        id: 1,
        title: "Linear Algebra and Statistics in Data Science ",
        videoId: "4lcPNSmiYi8",
        description: "we'll explore the crucial role of linear algebra and statistics in data science, covering topics such as:",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/ml_1.webp"
      },

      {
        id: 2,
        title: "Matrix Operations in Data Science  ",
        videoId: "_fZzyb70p9o",
        description: "Learn how to perform matrix addition, subtraction, multiplication, and inversion, and discover how these operations can be used to solve real-world data science problems. ",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/ml_2.webp"
      },

      {
        id: 3,
        title: "Machine Learning and Statistics in Data Science",
        videoId: "eNVK-NlPqU4",
        description: "we'll explore the intersection of machine learning and statistics in data science, and how they work together to extract insights from data. We'll cover key concepts such as:",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/ml_3.webp"
      },
      {
        id: 4,
        title: "Machine Learning Vs Deep Learning Vs Artificial Intelligence",
        videoId: "upv5jmYOMLU",
        description: "Machine learning and deep learning are the subparts of Artificial intelligence, with this video you will know about the difference between them.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/ml_4.webp"
      },

      {
        id: 5,
        title: "K-Nearest Neighbor Classification (Algorithm) - Machine Learning",
        videoId: "a77auiOnuyE",
        description: "According to Wikipedia-The k-nearest neighbors algorithm (k-NN) is a non-parametric classification method first developed by Evelyn Fix and Joseph Hodges in 1951, and later expanded by Thomas Cover.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/ml_5.webp"
      },
    ],
    PythonandStatistics: [
      {
        id: 1,
        title: "List in Python",
        videoId: "zSTEiNN-R6g",
        description: "Master Python Lists with Confidence. Join our comprehensive Python tutorial for beginners and learn how to work with lists in Python.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/one.webp"
      },
      {
        id: 2,
        title: "Tuples in Python",
        videoId: "9s9tvkohoKU",
        description: "Master Python Tuples with Confidence. Join our comprehensive Python tutorial for beginners and learn how to work with tuples in Python.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/two.webp"
      },

      {
        id: 3,
        title: "Linear Algebra and Statistics in Data Science",
        videoId: "4lcPNSmiYi8",
        description: "In this video, we'll explore the crucial role of linear algebra and statistics in data science, covering topics such as",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/three.webp"
      },


      {
        id: 3,
        title: "Machine Learning and Statistics in Data Science",
        videoId: "eNVK-NlPqU4",
        description: "Welcome to our video on Machine Learning and Statistics in Data Science",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/four.webp"
      },

      {
        id: 4,
        title: "Probability for Data Science",
        videoId: "_tNIi3znm3k",
        description: "According to Wikipedia-In probability theory and statistics, a probability distribution is the mathematical function that gives the probabilities of occurrence of different possible outcomes for an experiment.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/five.webp"
      },

      {
        id:5,
        title: "Statistics for Machine Learning Tutoria",
        videoId: "3k3H6SVrWwU",
        description: "Statistics is a branch of mathematics that studies the collection, organisation, analysis, interpretation, and presentation of data.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/six.webp"
      }
    ],
    Cloud: [
      {
        id: 1,
        title: "The Essential Guide to Understanding Linux Basics",
        videoId: "JOTChNJ4UjY",
        description: "This video aims at clearing the basics so you understand what Linux is and how it and why it is very vital.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/seven.webp"
      },

      {
        id: 2,
        title: "DevOps Simplified: Learn the Fundamentals",
        videoId: "uED6iULGEg8",
        description: "In this video, we break down the fundamentals of DevOps, from version control to CI/CD, automation, and real-world workflows. ",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/eight.webp"
      },

      {
        id: 3,
        title: "Top 10 Linux Commands Every User Should Know ",
        videoId: "SL49tF0clUA",
        description: "In this video, discover 10 essential Linux commands that every user should know to navigate, manage files, and optimize their system efficiently.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/nine.webp"
      },

    ],
  
    CyberSecurity: [
      {
        id: 1,
        title: "Real-Time Sentiment Analysis Using AWS Comprehend ",
        videoId: "VFEK4Qbv6Y8",
        description: "This project demonstrates how to perform real-time sentiment analysis on streaming data using AWS Kinesis and AWS Comprehend.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/thirten.webp"
      },

      {
        id: 1,
        title: "Learn CART Model with Real-Life Examples",
        videoId: "jnSwd8FEIJs",
        description: "An Ed-tech platform dedicated to offering Data Science and Cloud & DevOps programs to working professionals, along with 1:1 personal mentorship from our trainers.",
        image: "https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/tut_card/fouten.webp"
      },
    ],
    DSA: [
      {
        id: 1,
        title: "Algorithms Masterclass",
        videoId: "YOUTUBE_ID_ALGO",
        description: "Master common algorithms and problem solving",
        image: "/images/algo-course.jpg"
      }
    ]
  };

  const openVideo = (videoId, title) => {
    setActiveVideo({ videoId, title });
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };
  const allCourses = Object.values(courses).flat();
  return (
    <section className={styles.demoSessions}>
      <div className="container">
        {/* Testimonial Section */}
        <div className={styles.testimonialCard}>
         
          <div className={styles.categories}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryBtn} ${activeTab === category.id ? styles.active : ''}`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards */}
        <div className={styles.courseGrid}>
          {courses[activeTab]?.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.cardImage}  onClick={() => openVideo(course.videoId, course.title)}>
                <img src={course.image} alt={course.title}  />
              </div>
              <div className={styles.cardContent}>
                <h5>{course.title}</h5>
                <p>{course.description}</p>
                <button 
                  className={styles.playBtn}
                  onClick={() => openVideo(course.videoId, course.title)}
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Top Courses Section */}
        {/* Top Courses Slider */}
        {/* <div className={styles.topCourses}>
          <h4 className={styles.sectionTitle}>Top Related Videos</h4>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              }
            }}
            className={styles.swiperContainer}
          >
            {allCourses.map((course) => (
              <SwiperSlide key={`top-${course.id}`}>
                <div className={styles.topCourseCard}>
                  <div className={styles.topCardImage}>
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div className={styles.topCardContent}>
                    <h6>{course.title}</h6>
                    <button 
                      className={styles.smallPlayBtn}
                      onClick={() => openVideo(course.videoId, course.title)}
                    >
                      <span className="material-icons">play_arrow</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div> */}
        {/* Certification Section */}
        <div className={styles.certificationSection}>
          <h4>Earn Your Online Professional Certification from</h4>
          <button className={styles.certificationBtn}>Explore Programs</button>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className={styles.videoModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h5>{activeVideo.title}</h5>
              <button onClick={closeVideo} className={styles.closeBtn}>&times;</button>
            </div>
            <div className={styles.videoContainer}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DemoSessions;