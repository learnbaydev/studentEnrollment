import { useState, useRef, useEffect } from "react";
import { courses, categories } from "./data";
import styles from "./CourseBrochures.module.css";
import { Download } from "lucide-react";

const CourseBrochures = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !isMobile) return;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - slider.offsetLeft);
      setScrollLeft(slider.scrollLeft);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Adjust scroll speed
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    // Touch events for mobile
    const handleTouchStart = (e) => {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - slider.offsetLeft);
      setScrollLeft(slider.scrollLeft);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('touchstart', handleTouchStart, { passive: false });
    slider.addEventListener('touchend', handleTouchEnd, { passive: false });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleTouchEnd);
      slider.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging, startX, scrollLeft, isMobile]);

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

  return (
    <section className={styles.courseBrochures}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Download Course Brochures</h2>
        <p className={styles.para}>
          Explore our comprehensive course offerings and download detailed program brochures to learn more.
        </p>
        
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

        {isMobile ? (
          <div 
            ref={sliderRef}
            className={styles.courseSlider}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className={styles.sliderTrack}>
              {filteredCourses.map((course) => (
                <div key={course.id} className={styles.sliderCard}>
                  <div className={styles.cardImage}>
                    <img src={course.image} alt={course.title} />
                  </div>
                  
                  <div className={styles.cardContent}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    
                    <div className={styles.courseDetails}>
                      <span className={styles.duration}>{course.duration}</span>
                      <span className={styles.projects}>{course.projects} Projects</span>
                    </div>
                    
                    <div className={styles.certification}>
                      <ul>
                        <li>{course.certification}</li>
                        <li>{course.for}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.brochureButton}>
                      <a href={course.brochureLink}>Brochure</a>
                      <div className={styles.downloadIcon}>
                        <Download size={20} />
                      </div>
                    </div>

                    <div className={styles.detailsButton}>
                      <a href={course.detailsLink}>View Details</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.courseGrid}>
            {filteredCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.cardImage}>
                  <img src={course.image} alt={course.title} />
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  
                  <div className={styles.courseDetails}>
                    <span className={styles.duration}>{course.duration}</span>
                    <span className={styles.projects}>{course.projects} Projects</span>
                  </div>
                  
                  <div className={styles.certification}>
                    <ul>
                      <li>{course.certification}</li>
                      <li>{course.for}</li>
                    </ul>
                  </div>
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.brochureButton}>
                    <a href={course.brochureLink}>Brochure</a>
                    <div className={styles.downloadIcon}>
                      <Download size={20} />
                    </div>
                  </div>

                  <div className={styles.detailsButton}>
                    <a href={course.detailsLink}>View Details</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseBrochures;