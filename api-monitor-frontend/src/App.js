import React, { useEffect, useState } from "react";
import "./index.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [apis, setApis] = useState([]);
  const [history, setHistory] = useState({});
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [responsive, setResponsive] = useState(false); // ✅ NEW

  const fetchApis = async () => {
    const res = await fetch("http://localhost:8080/api/all");
    const data = await res.json();
    data.sort((a, b) => a.id - b.id);
    setApis(data);

    setHistory((prev) => {
      const updated = { ...prev };

      data.forEach((api) => {
        if (!updated[api.id]) updated[api.id] = [];

        updated[api.id] = [
          ...updated[api.id],
          {
            time: new Date().toLocaleTimeString(),
            value: api.responseTime || 0,
          },
        ].slice(-10);
      });

      return updated;
    });
  };

  const addApi = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8080/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, url }),
    });

    setName("");
    setUrl("");
    fetchApis();
  };

  const deleteApi = async (id) => {
    await fetch(`http://localhost:8080/api/delete/${id}`, {
      method: "DELETE",
    });
    fetchApis();
  };

  useEffect(() => {
    fetchApis();
    const interval = setInterval(fetchApis, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>🚀 API Monitoring Dashboard</h1>

      {/* FORM */}
      <form className="form" onSubmit={addApi}>
        <input
          type="text"
          placeholder="API Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="API URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      {/* ✅ TOGGLE SWITCH */}
      <div className="toggle-container">
        <span>Fixed Layout</span>

        <label className="switch">
          <input
            type="checkbox"
            checked={responsive}
            onChange={() => setResponsive(!responsive)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* GRID */}
      {apis.length === 0 ? (
        <p style={{ textAlign: "center" }}>No APIs added yet...</p>
      ) : (
        <div className={responsive ? "grid-responsive" : "grid"}>
          {apis.map((api) => (
            <div className="card" key={api.id}>
              <div className="row">
                <div>
                  <h3>{api.name}</h3>
                  <p style={{ opacity: 0.7 }}>{api.url}</p>
                </div>

                <span
                  className={`status ${
                    api.status === "UP" ? "up" : "down"
                  }`}
                >
                  {api.status || "Checking..."}
                </span>
              </div>

              <div className="row" style={{ marginTop: "10px" }}>
                <small>
                  ⏱ {api.responseTime ? api.responseTime + " ms" : "—"}
                </small>

                <small>
                  🕒{" "}
                  {api.lastChecked
                    ? new Date(api.lastChecked).toLocaleString()
                    : "—"}
                </small>

                <button
                  className="delete-btn"
                  onClick={() => deleteApi(api.id)}
                >
                  Delete
                </button>
              </div>

              {/* BAR GRAPH */}
              <div style={{ height: "150px", marginTop: "15px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={history[api.id] || []}>
                    <XAxis dataKey="time" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;