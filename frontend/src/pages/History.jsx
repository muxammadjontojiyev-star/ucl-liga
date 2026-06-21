import { useEffect, useState } from "react";
import { API_BASE_URL } from "../data/api";

function History() {
  const [matches, setMatches] = useState([]);

  // Eski kodda data/currentUser.js'dagi hardcoded mock foydalanuvchi
  // ({username: "Aziz"}) ishlatilgan edi — bu Home.jsx/Profile.jsx'dagi
  // real localStorage yondashuvidan farq qilardi. Endi mos qilindi.
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  ) || { username: null };

  useEffect(() => {
    fetch(`${API_BASE_URL}/matches`)
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch(() => {});
  }, []);

  const handleConfirm = async (match) => {
    const response = await fetch(`${API_BASE_URL}/confirm-result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matchId: match.id,
        username: currentUser.username,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Natija tasdiqlandi!");
      window.location.reload();
    }
  };

  const handleComplain = async (match) => {
    // Eski kodda bu tugma bosilganda hech qanday fetch chaqirilmasdi
    // (faqat <button> bor edi, onClick yo'q edi) — shu sababli
    // "Shikoyat qilish" tugmasi vizual jihatdan bor, lekin
    // funksional jihatdan ishlamasdi.
    const response = await fetch(`${API_BASE_URL}/complain-result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matchId: match.id,
        username: currentUser.username,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Shikoyat yuborildi!");
      window.location.reload();
    }
  };

  return (
    <div style={{ color: "white" }}>
      <h1 style={{ textAlign: "center" }}>📜 Turnir Tarixi</h1>

      <div
        style={{
          background: "#1a1d29",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
        }}
      >
        {matches.length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center" }}>
            Hozircha o'yinlar yo'q.
          </p>
        )}

        {matches.map((match) => (
          <div
            key={match.id}
            style={{
              background: "#252a3d",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            <p>🏆 Tur: {match.round}</p>

            <p>
              ⚽️ @{match.homeUser} vs @{match.awayUser}
            </p>

            <p>
              Natija:{" "}
              {match.homeGoals === null
                ? "Kutilmoqda"
                : match.homeGoals + " - " + match.awayGoals}
            </p>

            <p>
              Holat:{" "}
              {match.status === "pending"
                ? "⏳ Boshlanmagan"
                : match.status === "waiting"
                ? "⌛ Tasdiq kutilmoqda"
                : "✅ Tasdiqlangan"}
            </p>

            {match.status === "waiting" &&
              currentUser.username &&
              match.submittedBy !== currentUser.username && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => handleConfirm(match)}
                    style={{
                      padding: "8px 15px",
                      marginRight: "10px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#00c853",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    ✅ Tasdiqlash
                  </button>

                  <button
                    onClick={() => handleComplain(match)}
                    style={{
                      padding: "8px 15px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#d32f2f",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Shikoyat qilish
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
