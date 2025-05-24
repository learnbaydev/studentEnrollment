import { useState } from "react";
import { courses, categories } from "./data";
import styles from "./CourseBrochures.module.css";
import Image from "next/image";
import { Divide, Download } from "lucide-react";

const CourseBrochures = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const filteredCourses = courses.filter(
    (course) => course.category === selectedCategory
  );

const downloadSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
    <mask id="mask0_237_507" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
      <rect x="0.609863" y="0.51001" width="24.36" height="24.36" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_237_507)">
      <path d="M4.66992 22.84V20.81H20.9099V22.84H4.66992ZM12.7899 18.78L5.68492 9.64504H9.74492V2.54004H15.8349V9.64504H19.8949L12.7899 18.78Z" fill="#1C1B1F" />
    </g>
  </svg>
);
  return (
    <section className={styles.courseBrochures}>
      <div className={styles.container}>
      



        <h2 className={styles.sectionTitle}>Download Course Brochures</h2>
        <p className={styles.para}>Explore our comprehensive course offerings and download detailed program brochures to learn more.</p>
        <div className={styles.categoryDropdown}>
          <div 
            className={styles.dropdownHeader}
            onClick={toggleDropdown}
          >
            <span>Select Course</span>
            <span className={styles.dropdownArrow}>
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          </div>
          
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {categories.map((category) => (
                <div
                  key={category}
                  className={`${styles.dropdownItem} ${
                    selectedCategory === category ? styles.active : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.courseGrid}>
          {filteredCourses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.cardImage}>
                <img src={course.image} alt={course.title} />
                {/* <div className={styles.certificationBadges}>
                  {course.certificationBadges.map((badge, index) => (
                    <img key={index} src={badge} alt="Certification badge" className={styles.badge} />
                  ))}
                </div> */}
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                
                <div className={styles.courseDetails}>
                  <span className={styles.duration}>{course.duration}</span>
            
                  <span className={styles.projects}>{course.projects} Projects</span>
                </div>
                
                <div className={styles.certification}>
              <ul>
                <li>    {course.certification}</li>
                <li>   {course.for}</li>
              </ul>
                </div>

                
                {/* {course.for && (
                  <div className={styles.for}>
                    {course.for}
                  </div>
                )} */}
              </div>
              
              <div className={styles.cardFooter}>
               <div className={styles.brochureButton}> <a href={course.brochureLink} >
                  Brochure 
                </a>
             <div className={styles.downloadIcon}>
              {/* <Image src="/course/download_2.webp" width={30} height={30} loading="lazy" alt="download"/> */}
              <Download />
             </div>
          
                </div>

               <div className={styles.detailsButton}>
               <a href={course.detailsLink} >
                  View Details
                </a>
               </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseBrochures;
