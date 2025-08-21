import { useEffect, useState } from "react";
import "../../styles/uiComponents/Slides.scss";

const images = [
  { label: "Ready to explore the sights of Georgia?", image: "/images/Kazbegi.jpeg" },
  { label: "Discover the stunning Black Sea coast", image: "/images/Batumi.jpeg" },
  { label: "Walk the ancient streets of Tbilisi", image: "/images/Tbilisi.jpeg" },
  { label: "Explore the highest places in the Caucasus", image: "/images/Svaneti.jpeg" },
  { label: "Take an another view of the desert", image: "/images/Vashlovani.jpeg" },
];

const Slides = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="slides"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <div className="label">{slide.label}</div>
          </div>
        </div>
      ))}

      <button className="nav-arrow prev" onClick={prevSlide}>
        <span>&#10094;</span>
      </button>
      <button className="nav-arrow next" onClick={nextSlide}>
        <span>&#10095;</span>
      </button>

      <div className="nav-dots">
        {images.map((_, index) => (
          <div 
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ 
            animationDuration: '7s',
            animationPlayState: isPaused ? 'paused' : 'running'
          }} 
        />
      </div>
    </div>
  );
};

export default Slides;