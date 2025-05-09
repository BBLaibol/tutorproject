import { Link } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <div className="hero">
      <h1 className="title">Welcome!</h1>
      <div className="underline"></div>
      <p className="content">
        Finding the right tutor can make all the difference in your learning
        journey. TutorMe connects you with experienced tutors tailored to your
        needs. You can{" "}
        <Link to="/search" className="link">
          search
        </Link>{" "}
        for tutors by subject, level, and ratings to find the perfect match.
      </p>
    </div>
  );
};

export default HeroSection;
