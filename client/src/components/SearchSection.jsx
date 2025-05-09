import { useState } from "react";
import TutorCard from "./TutorCard";
import FilterSection from "./FilterSection";
import "./SearchSection.css";
import "./FilterSection.css";

const SearchSection = ({
  tutors,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  loading,
  error,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="search-section">
      <div className="search-header">
        <input
          type="text"
          placeholder="Search by email or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          tutors={tutors}
        />
      )}

      {loading ? (
        <div className="loading">Loading tutors...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="results-count">
            {tutors.length} {tutors.length === 1 ? "tutor" : "tutors"} found
          </div>

          <div className="tutors-grid">
            {tutors.length > 0 ? (
              tutors.map((tutor, index) => (
                <TutorCard key={index} tutor={tutor} />
              ))
            ) : (
              <div className="no-results">
                <p>No tutors match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      subject: "",
                      priceRange: [0, 100],
                    });
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSection;
