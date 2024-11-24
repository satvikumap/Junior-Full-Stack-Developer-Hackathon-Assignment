import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"; // Custom CSS for the updated visualization

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [eventType, setEventType] = useState("");
  const [sourceAppId, setSourceAppId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/v1/events/search", {
        params: {
          eventType,
          sourceAppId,
          startDate,
          endDate,
          page,
          limit: 10,
        },
      });

      if (response.data.events) {
        setEvents(response.data.events); // Load events for the current page
        setTotalPages(response.data.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page
    fetchEvents();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="dashboard">
      <h1>Event Logs</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="filter-form">
        <div>
          <label htmlFor="eventType">Event Type:</label>
          <input
            id="eventType"
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sourceAppId">Source App ID:</label>
          <input
            id="sourceAppId"
            type="text"
            value={sourceAppId}
            onChange={(e) => setSourceAppId(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button type="submit">Search</button>
      </form>

      {/* Event List */}
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div>
          <h2>All Events</h2>
          <div className="event-log">
            {events.map((event, index) => (
              <div key={event._id} className="event-wrapper">
                <div className="event-node">
                  <strong>Event Type:</strong> {event.eventType} <br />
                  <strong>Timestamp:</strong> {event.timestamp} <br />
                  <strong>Source App ID:</strong> {event.sourceAppId}
                </div>
                {index !== events.length - 1 && <div className="arrow">↓</div>}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-button ${pageNum === page ? "active" : ""}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
