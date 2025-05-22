import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './DemoVideo.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const DemoSessions = () => {
  const [activeTab, setActiveTab] = useState('DataScience');
  const [activeVideo, setActiveVideo] = useState(null);

  const categories = [
    { id: 'DataScience', name: 'Data Science' },
    { id: 'Cloud', name: 'Cloud Computing' },
    { id: 'DevOps', name: 'DevOps' },
    { id: 'CyberSecurity', name: 'Cyber Security' },
    { id: 'DSA', name: 'Data Structures & Algorithms' },
  ];

  const courses = {
    DataScience: [
      {
        id: 1,
        title: "Introduction to Python",
        videoId: "QJMIdnfz2wc",
        description: "Learn Python basics with this introductory course",
        image: "/demo/py_video.webp"
      },
      {
        id: 2,
        title: "Machine Learning Fundamentals",
        videoId: "YOUTUBE_ID_ML",
        description: "Introduction to machine learning concepts",
        image: "/demo/py_video.webp"
      }
    ],
    Cloud: [
      {
        id: 1,
        title: "AWS Fundamentals",
        videoId: "YOUTUBE_ID_AWS",
        description: "Learn core AWS services and concepts",
        image: "/images/aws-course.jpg"
      }
    ],
    DevOps: [
      {
        id: 1,
        title: "Docker & Kubernetes",
        videoId: "YOUTUBE_ID_DOCKER",
        description: "Containerization and orchestration fundamentals",
        image: "/images/docker-course.jpg"
      }
    ],
    CyberSecurity: [
      {
        id: 1,
        title: "Ethical Hacking",
        videoId: "YOUTUBE_ID_HACKING",
        description: "Learn penetration testing techniques",
        image: "/images/security-course.jpg"
      }
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
        <div className={styles.topCourses}>
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
        </div>
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