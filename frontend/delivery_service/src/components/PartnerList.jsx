import React, { useEffect, useState } from "react";
import axios from "axios";

const PartnerList = () => {
  const [partners, setPartners] = useState([]);

  const fetchPartners = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5003/api/partners/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPartners(res.data);
    } catch (err) {
      console.error("Error fetching partners", err);
    }
  };

  const toggleAvailability = async (id, isAvailable) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5003/api/partners/${id}/availability`,
        { isAvailable: !isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPartners();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="partner-wrapper">
      <h2 className="title">Delivery Partner Dashboard</h2>
      <table className="partner-table">
        <thead>
          <tr>
            <th>Partner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((p) => (
            <tr key={p._id}>
              <td>
                <div className="partner-info">
                  <img
                    src={p.profileImage || "https://via.placeholder.com/80"}
                    alt="Partner"
                    className="avatar"
                  />
                  <div className="details">
                    <p><strong>Name:</strong> {p.name}</p>
                    <p><strong>Phone:</strong> {p.phone}</p>
                    <p><strong>Vehicle:</strong> {p.vehicleType}</p>
                    <p><strong>Address:</strong> {p.address}</p>
                  </div>
                </div>
              </td>
              <td className="status">
                {p.isAvailable ? (
                  <span className="status-label green">Available</span>
                ) : (
                  <span className="status-label red">Unavailable</span>
                )}
              </td>
              <td>
                <button
                  onClick={() => toggleAvailability(p._id, p.isAvailable)}
                  className={`toggle-btn ${p.isAvailable ? "red" : "green"}`}
                >
                  {p.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .partner-wrapper {
          padding: 2rem;
          background-color: #111;
          color: #fff;
          font-family: 'Segoe UI', sans-serif;
          min-height: 100vh;
        }

        .title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #facc15;
          text-shadow: 1px 1px 2px #000;
        }

        .partner-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 1rem;
          font-size: 1rem;
        }

        .partner-table th {
          background: #222;
          color: #facc15;
          padding: 0.75rem;
          text-align: left;
        }

        .partner-table td {
          background: #1a1a1a;
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
          vertical-align: top;
        }

        .partner-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
          border: 2px solid #facc15;
          box-shadow: 0 4px 8px rgba(250, 204, 21, 0.4);
        }

        .details p {
          margin: 4px 0;
          color: #f4f4f4;
        }

        .status-label {
          font-weight: bold;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
        }

        .status-label.green {
          background-color: #22c55e;
          color: #000;
        }

        .status-label.red {
          background-color: #dc2626;
        }

        .toggle-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          color: #000;
          background-color: #facc15;
          box-shadow: 0 4px 8px rgba(250, 204, 21, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(250, 204, 21, 0.5);
        }

        .toggle-btn.red {
          background-color: #dc2626;
          color: #fff;
        }

        .toggle-btn.green {
          background-color: #22c55e;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default PartnerList;
