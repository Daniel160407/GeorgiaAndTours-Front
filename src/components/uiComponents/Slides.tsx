import { useEffect, useState } from "react";
import "../../styles/uiComponents/Slides.scss";

const images = [
  { label: "Ready to explore new sites of Georgia?", image: "/images/Kazbegi.jpeg" },
  { label: "Discover the stunning Black Sea coast", image: "/images/Batumi.jpeg" },
  { label: "Walk the ancient streets of Tbilisi", image: "/images/Tbilisi.jpeg" },
];

const Slides = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slides">
      {images.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="label">{slide.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Slides;
