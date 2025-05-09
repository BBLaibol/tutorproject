import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorProfileForm.css";

export default function TutorProfileForm() {
  const [profile, setProfile] = useState({
    bio: "",
    subjects: "",
    price_per_hour: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const debugAuthInfo = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    console.log("Auth Debug Info:");
    console.log("Token exists:", !!token);
    if (token) console.log("Token preview:", token.substring(0, 10) + "...");
    console.log("User ID:", userId);
    console.log("User Role:", userRole);

    return { token, userId, userRole };
  };

  useEffect(() => {
    const checkAndLoadProfile = async () => {
      setIsLoading(true);

      const { token, userId, userRole } = debugAuthInfo();

      if (!token || !userId || userRole !== "tutor") {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/tutor-profiles/${userId}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        console.log("Profile fetch status:", response.status);

        if (response.ok) {
          const profileData = await response.json();
          console.log("Fetched profile data:", profileData);

          const subjectsString = Array.isArray(profileData.subjects)
            ? profileData.subjects.join(", ")
            : profileData.subjects || "";

          setProfile({
            bio: profileData.bio || "",
            subjects: subjectsString,
            price_per_hour: profileData.price_per_hour || "",
          });
          setIsEditing(true);
        } else if (response.status !== 404) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err.message || "Error loading profile");
      } finally {
        setIsLoading(false);
      }
    };

    checkAndLoadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/");
        return;
      }

      const subjectsArray = profile.subjects
        .split(",")
        .map((subject) => subject.trim())
        .filter((subject) => subject !== "");

      const profileToSubmit = {
        ...profile,
        subjects: subjectsArray,
      };

      console.log("Submitting profile with:", {
        method: isEditing ? "PUT" : "POST",
        profile: profileToSubmit,
        token: token.substring(0, 10) + "...",
      });

      const response = await fetch("http://localhost:5000/api/tutor-profiles", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(profileToSubmit),
      });

      console.log("Server response status:", response.status);

      const data = await response.json();
      console.log("Server response data:", data);

      if (response.ok) {
        setMessage(data.message || "Profile saved successfully");
        setIsEditing(true);
      } else {
        setError(data.message || "Failed to save profile");
      }
    } catch (err) {
      console.error("Profile submission error:", err);
      setError(
        "Connection error. Please check if the server is running or check console for details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tutor-profile-container">
      <h2>
        {isEditing ? "Edit Your Tutor Profile" : "Create Your Tutor Profile"}
      </h2>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form className="tutor-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="5"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell students about your experience, teaching style, and qualifications..."
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subjects">Subjects</label>
          <input
            type="text"
            id="subjects"
            name="subjects"
            value={profile.subjects}
            onChange={handleChange}
            placeholder="Math, Science, History (comma separated)"
            required
            disabled={isLoading}
          />
          <small className="input-helper">
            Enter subjects separated by commas (e.g., Math, Science, History)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="price_per_hour">Price per Hour ($)</label>
          <input
            type="number"
            id="price_per_hour"
            name="price_per_hour"
            min="1"
            max="500"
            value={profile.price_per_hour}
            onChange={handleChange}
            placeholder="45"
            required
            disabled={isLoading}
          />
        </div>

        <button
          className="profile-submit-button"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Profile"
            : "Create Profile"}
        </button>
      </form>
    </div>
  );
}
