const express = require("express");
const Event = require("../models/eventModel");
const { generateHash } = require("../utils/hashUtil");

const router = express.Router();

// Fetch a random event
router.get("/", async (req, res) => {
  const events = await Event.find();
  const randomIndex = Math.floor(Math.random() * events.length);
  const randomEvent = events[randomIndex];
  res.status(200).json(randomEvent);
});

// Search events
router.get("/search", async (req, res) => {
  const { eventType, sourceAppId, startDate, endDate, page = 1, limit = 10 } = req.query;

  const filters = {};
  if (eventType) filters.eventType = eventType;
  if (sourceAppId) filters.sourceAppId = sourceAppId;

  if (startDate && endDate) {
    filters.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const events = await Event.find(filters)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  const totalEvents = await Event.countDocuments(filters);

  res.status(200).json({
    totalEvents,
    page,
    totalPages: Math.ceil(totalEvents / limit),
    events,
  });
});

// Endpoint to verify consistency of event chain
router.get("/verify", async (req, res) => {
    const events = await Event.find().sort({ timestamp: 1 });
  
    let isConsistent = true;
    for (let i = 1; i < events.length; i++) {
      if (events[i].previousHash !== events[i - 1].hash) {
        isConsistent = false;
        break;
      }
    }
  
    if (isConsistent) {
      res.status(200).json({ message: "Event chain is consistent" });
    } else {
      res.status(400).json({ message: "Event chain is inconsistent" });
    }
  });
  

// Add a new event
router.post("/", async (req, res) => {
  const { eventType, timestamp, sourceAppId, dataPayload } = req.body;

  const previousEvent = await Event.findOne().sort({ _id: -1 });
  const previousHash = previousEvent ? previousEvent.hash : null;

  const event = { eventType, timestamp, sourceAppId, dataPayload, previousHash };
  const hash = generateHash(event);

  const newEvent = new Event({ ...event, hash });
  await newEvent.save();

  res.status(201).json({ message: "Event created successfully", event: newEvent });
});


module.exports = router;
