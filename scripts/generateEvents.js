const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const { eventSchema } = require("../models/eventSchema");
const { generateHash } = require("../utils/hashUtil");
const data = require("../data");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin:satvik@cluster0.lw0dgjg.mongodb.net/event_log", {
    });
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit if connection fails
  }
};

const generateRandomEvents = async (numEvents = 10) => {
  try {
    // Fetch the last event to chain the new events
    const lastEvent = await Event.findOne().sort({ _id: -1 });
    let previousHash = lastEvent ? lastEvent.hash : null; // Initialize previousHash based on the last event

    // If no previous events, the first event should have `previousHash` as null
    if (!previousHash) {
      previousHash = null; // This will be used for the very first event
    }

    for (let i = 0; i < numEvents; i++) {
      const randomEvent = data[Math.floor(Math.random() * data.length)];

      try {
        // Validate the event with Zod schema
        const validatedEvent = eventSchema.parse(randomEvent);

        // Prepare event data without `previousHash` for hash generation
        const eventData = { ...validatedEvent };

        // Generate the hash for the current event (no previousHash here for hash generation)
        const hash = generateHash(eventData);

        // Add the previousHash to the event data
        const eventWithHash = { ...validatedEvent, previousHash, hash };

        // Save event to the database
        const newEvent = new Event(eventWithHash);
        await newEvent.save();

        // Update previousHash for the next iteration
        previousHash = hash;

        console.log(`Event ${i + 1} generated successfully.`);
      } catch (err) {
        console.error("Validation or saving failed for event:", randomEvent, err.errors || err);
      }
    }

    console.log(`${numEvents} events generated successfully.`);
  } catch (err) {
    console.error("Error generating events:", err);
  }
};

  

(async () => {
  await connectDB();  // Connect to DB
  await generateRandomEvents(20); // Generate 20 random events
  mongoose.connection.close(); // Close DB connection after generating events
})();
