import { useState, useEffect } from "react";
import "./FilterSection.css";

const FilterSection = ({ filters, setFilters, tutors }) => {
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    if (Array.isArray(tutors) && tutors.length > 0) {
      const allSubjects = new Set();

      tutors.forEach((tutor) => {
        if (Array.isArray(tutor.subjects)) {
          tutor.subjects.forEach((subject) => {
            allSubjects.add(subject);
          });
        }
      });

      setAvailableSubjects(Array.from(allSubjects).sort());
    }
  }, [tutors]);

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  return (
    <div className="filter-section">
      <div className="filter-group">
        <label>Subject:</label>
        <select
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        >
          <option value="">All Subjects</option>
          {availableSubjects.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range:</label>
        <div className="range-values">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
        <div className="range-inputs">
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
          />
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
