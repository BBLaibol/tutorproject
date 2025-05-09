const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/all", async (req, res) => {
  try {
    const tutorQuery = await pool.query(`
      SELECT tp.*, u.email 
      FROM tutor_profiles tp
      JOIN users u ON tp.user_id = u.id
    `);

    res.json(tutorQuery.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/subjects", async (req, res) => {
  try {
    const subjectsQuery = await pool.query(`
        SELECT DISTINCT UNNEST(subjects) AS subject 
        FROM tutor_profiles
        ORDER BY subject
      `);

    const subjects = subjectsQuery.rows.map((row) => row.subject);

    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const profileQuery = await pool.query(
      "SELECT * FROM tutor_profiles WHERE user_id = $1",
      [userId]
    );

    if (profileQuery.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profileQuery.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  const { bio, subjects, price_per_hour } = req.body;
  const userId = req.user.userId;

  try {
    const userQuery = await pool.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userQuery.rows[0].role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can create profiles",
      });
    }

    const profileCheck = await pool.query(
      "SELECT * FROM tutor_profiles WHERE user_id = $1",
      [userId]
    );

    if (profileCheck.rows.length > 0) {
      return res.status(400).json({
        message: "Profile already exists. Use PUT to update.",
      });
    }

    const subjectsArray = Array.isArray(subjects) ? subjects : [];

    await pool.query(
      `INSERT INTO tutor_profiles (user_id, bio, subjects, price_per_hour)
       VALUES ($1, $2, $3, $4)`,
      [userId, bio, subjectsArray, price_per_hour]
    );

    res.status(201).json({
      message: "Profile created successfully",
      profile: {
        bio,
        subjects: subjectsArray,
        price_per_hour,
        user_id: userId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/", auth, async (req, res) => {
  const { bio, subjects, price_per_hour } = req.body;
  const userId = req.user.userId;

  try {
    const userQuery = await pool.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userQuery.rows[0].role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can update profiles",
      });
    }

    const profileCheck = await pool.query(
      "SELECT * FROM tutor_profiles WHERE user_id = $1",
      [userId]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Profile not found. Create a profile first.",
      });
    }

    const subjectsArray = Array.isArray(subjects) ? subjects : [];

    await pool.query(
      `UPDATE tutor_profiles 
       SET bio = $1, subjects = $2, price_per_hour = $3
       WHERE user_id = $4`,
      [bio, subjectsArray, price_per_hour, userId]
    );

    res.json({
      message: "Profile updated successfully",
      profile: {
        bio,
        subjects: subjectsArray,
        price_per_hour,
        user_id: userId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
