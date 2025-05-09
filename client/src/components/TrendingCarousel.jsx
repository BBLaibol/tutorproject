// import { useState } from "react";
// import TutorCard from "./TutorCard";
// import "./TrendingCarousel.css";

// const TrendingCarousel = ({ tutors, expanded = false }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const visibleCount = expanded ? 3 : 2;

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex >= tutors.length - visibleCount ? 0 : prevIndex + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? tutors.length - visibleCount : prevIndex - 1
//     );
//   };

//   if (tutors.length === 0) return null;

//   return (
//     <div className="trending-section expanded">
//       <h2>Top Rated Tutors</h2>
//       <div className="carousel-container">
//         <button className="carousel-button prev" onClick={prevSlide}>
//           ‹
//         </button>

//         <div className="carousel-slide">
//           {tutors
//             .slice(currentIndex, currentIndex + visibleCount)
//             .map((tutor) => (
//               <TutorCard key={tutor.id} tutor={tutor} />
//             ))}
//         </div>

//         <button className="carousel-button next" onClick={nextSlide}>
//           ›
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TrendingCarousel;

import { useState } from "react";
import TutorCard from "./TutorCard";
import "./TrendingCarousel.css";

const TrendingCarousel = ({ tutors }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= tutors.length - visibleCount ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? tutors.length - visibleCount : prevIndex - 1
    );
  };

  if (tutors.length === 0) return null;

  return (
    <div className="trending-section">
      <h2>Our Top Picks</h2>
      <div className="carousel-container">
        <button className="carousel-button prev" onClick={prevSlide}>
          ‹
        </button>

        <div className="carousel-slide">
          {tutors
            .slice(currentIndex, currentIndex + visibleCount)
            .map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
        </div>

        <button className="carousel-button next" onClick={nextSlide}>
          ›
        </button>
      </div>
    </div>
  );
};

export default TrendingCarousel;
