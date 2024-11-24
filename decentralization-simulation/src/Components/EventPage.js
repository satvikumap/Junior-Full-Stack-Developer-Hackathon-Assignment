import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { eventId } = useParams();

  useEffect(() => {
    // Fetch event details
    axios
      .get(`http://localhost:4000/api/v1/events/search/${eventId}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      });
  }, [eventId]);

  return (
    <div className="event-page">
      {loading ? (
        <p>Loading event details...</p>
      ) : (
        <div>
          <h1>Event Details</h1>
          {event ? (
            <div>
              <p><strong>Event Type:</strong> {event.eventType}</p>
              <p><strong>Timestamp:</strong> {event.timestamp}</p>
              <p><strong>Source App:</strong> {event.sourceAppId}</p>
              <p><strong>Data Payload:</strong></p>
              <ul>
                <li><strong>User ID:</strong> {event.dataPayload.userId}</li>
                <li><strong>Action:</strong> {event.dataPayload.action}</li>
                <li><strong>Details:</strong> {event.dataPayload.details}</li>
              </ul>
              <p><strong>Hash:</strong> {event.hash}</p>
              <p><strong>Previous Hash:</strong> {event.previousHash}</p>
            </div>
          ) : (
            <p>Event not found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventPage;
