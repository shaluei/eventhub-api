import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = "./data/events.json";

// POST /api/events
app.post("/api/events", (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  if (!title || !date || !location || !maxAttendees) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (maxAttendees <= 0) {
    return res.status(400).json({ error: "maxAttendees must be positive" });
  }

  const newEvent = {
    eventId: "EVT-" + Date.now(),
    title,
    description: description || "",
    date,
    location,
    maxAttendees,
    currentAttendees: 0,
    status: "upcoming",
  };

  let events = [];
  try {
    const data = fs.readFileSync(DATA_FILE);
    events = JSON.parse(data);
  } catch {
    events = [];
  }

  events.push(newEvent);
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));

  res.status(201).json(newEvent);
});

// GET /api/events
app.get("/api/events", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    const events = JSON.parse(data);
    res.json(events);
  } catch {
    res.status(500).json({ error: "Could not read events file" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
