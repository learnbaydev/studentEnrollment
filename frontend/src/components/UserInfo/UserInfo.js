'use client';
import React, { useRef, useEffect } from 'react';
import styles from './UserInfor.module.css';
import Image from 'next/image';

const UserInfo = ({ user }) => {

    const sliderRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const card = cardRef.current;

    if (!slider || !card) return;

    const cardWidth = card.offsetWidth + 16; // including gap
    let currentIndex = 0;

    const scrollInterval = setInterval(() => {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      const nextScrollLeft = currentIndex * cardWidth;

      if (nextScrollLeft > maxScrollLeft) {
        // Reset to start
        slider.scrollLeft = 0;
        currentIndex = 0;
      } else {
        slider.scrollTo({
          left: nextScrollLeft,
          behavior: 'smooth',
        });
        currentIndex += 1;
      }
    }, 2000); 
    return () => clearInterval(scrollInterval);
  }, []);

  const infoCards = [
    {
      icon: '/icons/icon-blue.webp',
      bgColor: '#F0F8FF',
      borderColor: '#5FB0FF',
      label: 'Name',
      value: user?.name || 'N/A',
    },
    {
      icon: '/icons/icon-org.webp',
      bgColor: '#FFF7ED',
      borderColor: '#F99600',
      label: 'Email',
      value: user?.email || 'N/A',
    },
    {
      icon: '/icons/icon_green.webp',
      bgColor: '#E9FCF7',
      borderColor: '#53AF97',
      label: 'Program',
      value: user?.program_name || 'N/A',
    },
    {
      icon: '/icons/red-icon.webp',
      bgColor: '#FFF5F5',
      borderColor: '#F10808',
      label: 'Domain',
      value: user?.domain || 'N/A',
    },
  ];

  const testimonials = [
    {
      name: 'Shravanthi A',
      title: 'Data Scientist',
      rating: '⭐⭐⭐⭐⭐',
      hike: '120% Salary Hike',
      message: '“Learnbay has helped me a lot to learn data science applications in the e-commerce industry. The live class concept was really helpful in receiving proper DS training. Thanks to all my mentors and the placement team”',
      image: 'https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/shravanthi_a.webp',
    },
    {
      name: 'Saurabh Kumar',
      title: 'Data Scientist',
      rating: '⭐⭐⭐⭐',
      hike: '135% Salary Hike',
      message: '“The course structure is excellent with emphasis on concept building and tools & software at the same time. The support team is excellent and supportive and quite agile to respond to doubts”',
      image: 'https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/saurabh-round.webp',
    },
    {
      name: 'Preksha Mishra',
      title: 'Backend Engineer',
      rating: '⭐⭐⭐⭐⭐',
      hike: '120% Salary Hike',
      message: 'The course structure is excellent with emphasis on concept building and tools & software at the same time. The support team is excellent and supportive and quite agile to respond to doubts”.',
      image: 'https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/preksha-round.webp',
    },
    {
      name: 'Mohd. Israr',
      title: 'Data Scientist',
      rating: '⭐⭐⭐⭐',
      hike: '110% Salary Hike',
      message: 'Thanks to the Learnbay data science course & excellent guidance, I was able to ace the TCS interview and secure a job with a 210% pay raise. The real-world time projects helped me develop my concepts as a data scientist.',
      image: 'https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/mohd-round.webp',
    },
    {
      name: 'Shravanthi A',
      title: 'Data Scientist',
      rating: '⭐⭐⭐⭐⭐',
      hike: '120% Salary Hike',
      message: '“Learnbay has helped me a lot to learn data science applications in the e-commerce industry. The live class concept was really helpful in receiving proper DS training. Thanks to all my mentors and the placement team”',
      image: 'https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/shravanthi_a.webp',
    },
    {
      name: 'Saurabh Kumar',
      title: 'Data Scientist',
      rating: '⭐⭐⭐⭐',
      hike: '135% Salary Hike',
      message: '“The course structure is excellent with emphasis on concept building and tools & software at the same time. The support team is excellent and supportive and quite agile to respond to doubts”',
      image: 'https://student-enrollment-bucket.s3.ap-south-1.amazonaws.com/saurabh-round.webp',
    },
    // {
    //   name: 'Kunal Mehta',
    //   title: 'Software Engineer',
    //   rating: '⭐⭐⭐⭐⭐',
    //   hike: '90% Salary Hike',
    //   message: '“Project-based learning helped me build confidence for real jobs.”',
    //   image: '/rahul.webp',
    // },
  ];

  return (
    <div className={styles.topInfoSection}>
      {/* <h2>Personalized Admission Process</h2> */}
      <h2>Words From Our Alumni      </h2>
      <div className={styles.main}>
        {/* <div className={styles.leftdiv}>
          {infoCards.map((card, index) => (
            <div
              className={styles.infoCard}
              key={index}
              style={{
                backgroundColor: card.bgColor,
                borderColor: card.borderColor,
              }}
            >
              <div className={styles.iconBox}>
                <Image
                  src={card.icon}
                  alt={card.label}
                  width={50}
                  height={50}
                  loading="lazy"
                />
              </div>
              <div className={styles.textBox}>
                <p>
                  {card.label} <br />
                  <span>{card.value}</span>
                </p>
              </div>
            </div>
          ))}
        </div> */}
        <div className={styles.sliderContainer} ref={sliderRef}>
          <div className={styles.sliderTrack}>
            {testimonials.map((testimonial, index) => (
              <div
                className={styles.testimonialCard}
                key={index}
                ref={index === 0 ? cardRef : null} // only first card needs ref
              >
                <div className={styles.top}>
                  <Image src={testimonial.image} width={70} height={70} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.title}</p>
                    <p>{testimonial.rating}</p>
                  </div>
                </div>
                <div className={styles.hike}>
                  <span>{testimonial.hike}</span>
                </div>
                <p className={styles.desc}>{testimonial.message}</p>
              </div>
            ))}
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default UserInfo;
