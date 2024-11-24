const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  timestamp: { type: String, required: true },
  sourceAppId: { type: String, required: true },
  dataPayload: {
    userId: { type: Number, required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
  },
  hash: { type: String, required: true },
  previousHash: { type: String, default: null },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
