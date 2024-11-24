const { z } = require("zod");

const eventSchema = z.object({
  eventType: z.enum(["INFO", "ERROR", "WARNING", "DEBUG"]),
  timestamp: z.string(),
  sourceAppId: z.string(),
  dataPayload: z.object({
    userId: z.number(),
    action: z.string(),
    details: z.string(),
  }),
});

module.exports = { eventSchema };
