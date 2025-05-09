import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Navbar from "./Navbar";
import HeroSection from "./pages/HeroSection";
import SearchSection from "./SearchSection";
import AboutSection from "./pages/AboutSection";
import FAQSection from "./pages/FAQSection";
import ContactSection from "./pages/ContactSection";
import RegisterModal from "./RegisterModal";
import TutorProfilePage from "./pages/TutorProfilePage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    priceRange: [0, 100],
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Add state for tutors data
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check auth status from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setUserRole(role || "");
  }, []);

  // Fetch tutors data from API
  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/tutor-profiles/all"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tutors");
        }

        const tutorsData = await response.json();
        setTutors(tutorsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Failed to load tutors data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Fetch subjects for filtering
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tutor-profiles/subjects"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const subjectsData = await response.json();
        setSubjects(subjectsData);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        // Don't show error for subjects, as it's not critical
      }
    };

    fetchSubjects();
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    // Handle email/subject search
    const matchesSearch =
      searchQuery === "" ||
      (tutor.email &&
        tutor.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(tutor.subjects) &&
        tutor.subjects.some((subject) =>
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    // Filter by subject - only if a subject is selected
    const matchesSubject =
      filters.subject === "" ||
      (Array.isArray(tutor.subjects) &&
        tutor.subjects.some(
          (subject) => subject.toLowerCase() === filters.subject.toLowerCase()
        ));

    // Filter by price
    const matchesPrice =
      tutor.price_per_hour >= filters.priceRange[0] &&
      tutor.price_per_hour <= filters.priceRange[1];

    return matchesSearch && matchesSubject && matchesPrice;
  });

  return (
    <Router>
      <div className="app">
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          setIsAuthenticated={setIsAuthenticated}
        />

        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          onAuthClick={() => setShowRegisterModal(true)}
          userRole={userRole}
        />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                </>
              }
            />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/faq" element={<FAQSection />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route
              path="/search"
              element={
                <SearchSection
                  tutors={filteredTutors}
                  subjects={subjects}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filters={filters}
                  setFilters={setFilters}
                  loading={loading}
                  error={error}
                />
              }
            />
            <Route
              path="/profile/tutor"
              element={
                isAuthenticated ? <TutorProfilePage /> : <Navigate to="/" />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
