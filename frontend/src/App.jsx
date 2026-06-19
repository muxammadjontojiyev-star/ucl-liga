import { useState } from "react";

import Home from "./pages/Home";
import Ranking from "./pages/Ranking";
import Profile from "./pages/Profile";
import Awards from "./pages/Awards";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        color: "white",
        paddingBottom: "80px",
      }}
    >
      <div style={{ padding: "16px" }}>
        {page === "home" && <Home />}
        {page === "ranking" && <Ranking />}
        {page === "profile" && <Profile />}
        {page === "awards" && <Awards />}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          background: "#1a1d29",
          borderTop: "1px solid #333",
          padding: "10px 0",
        }}
      >
        <button
          style={{ fontSize: "11px", padding: "5px" }}
          onClick={() => setPage("home")}
        >
          🏠 Asosiy
        </button>

        <button
          style={{ fontSize: "11px", padding: "5px" }}
          onClick={() => setPage("ranking")}
        >
          🏆 Reyting
        </button>

        <button
          style={{ fontSize: "11px", padding: "5px" }}
          onClick={() => setPage("profile")}
        >
          👤 Profil
        </button>

        <button
          style={{ fontSize: "11px", padding: "5px" }}
          onClick={() => setPage("awards")}
        >
          🥇 Sovrinlar
        </button>
      </div>
    </div>
  );
}

export default App;