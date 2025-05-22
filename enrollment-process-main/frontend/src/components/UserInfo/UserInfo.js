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
      name: 'Arvind Kumar',
      title: 'Project Manager',
      rating: '⭐⭐⭐⭐⭐',
      hike: '120% Salary Hike',
      message: '“The mentorship and job support were fantastic. Landed a role at Amazon after just 6 months!”',
      image: '/rahul.webp',
    },
    {
      name: 'Sneha Roy',
      title: 'Frontend Developer',
      rating: '⭐⭐⭐⭐',
      hike: '80% Salary Hike',
      message: '“Got into Flipkart as a React developer thanks to the structured learning path.”',
      image: '/rahul.webp',
    },
    {
      name: 'Rahul Singh',
      title: 'Backend Engineer',
      rating: '⭐⭐⭐⭐⭐',
      hike: '150% Salary Hike',
      message: '“Learned MERN stack in 4 months and cracked an interview at Swiggy!”',
      image: '/rahul.webp',
    },
    {
      name: 'Anjali Verma',
      title: 'Full Stack Dev',
      rating: '⭐⭐⭐⭐',
      hike: '110% Salary Hike',
      message: '“Doubt-solving and mock interviews really helped me prepare well.”',
      image: '/rahul.webp',
    },
    {
      name: 'Kunal Mehta',
      title: 'Software Engineer',
      rating: '⭐⭐⭐⭐⭐',
      hike: '90% Salary Hike',
      message: '“Project-based learning helped me build confidence for real jobs.”',
      image: '/rahul.webp',
    },
  ];

  return (
    <div className={styles.topInfoSection}>
      <h2>Personalized Admission Process</h2>
      <div className={styles.main}>
        <div className={styles.leftdiv}>
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
        </div>
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
