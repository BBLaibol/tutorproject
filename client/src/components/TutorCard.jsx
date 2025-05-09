import "./TutorCard.css";

const TutorCard = ({ tutor }) => {
  const firstLetter = tutor.email ? tutor.email.charAt(0).toUpperCase() : "T";

  const subjectsDisplay = Array.isArray(tutor.subjects)
    ? tutor.subjects.join(", ")
    : "Not specified";

  return (
    <div className="tutor-card">
      <div className="tutor-image">
        <div className="avatar-placeholder">{firstLetter}</div>
      </div>
      <div className="tutor-info">
        <h3>{tutor.email || "Tutor"}</h3>
        <div className="tutor-details">
          <p>
            <span>Bio:</span> {tutor.bio}
          </p>
          <p>
            <span>Subjects:</span> {subjectsDisplay}
          </p>
          <p>
            <span>Price:</span> ${tutor.price_per_hour}/hr
          </p>
        </div>
      </div>
      <a
        href="mailto:test@example.com?subject=Tutoring Inquiry&body=Hi, I'm interested in tutoring."
        target="_blank"
        className="inputemail"
      >
        Contact Tutor
      </a>
    </div>
  );
};

export default TutorCard;
