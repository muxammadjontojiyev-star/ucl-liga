import { useState, useEffect } from "react";
import { API_BASE_URL } from "../data/api";

function Profile() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  ) || { username: null };

  const [league] = useState(
    () => localStorage.getItem("league") || ""
  );
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Ilgari bu ikki fetch ikki marta (ikki alohida useEffectda)
    // chaqirilardi. Endi bitta joyda, takrorsiz.
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => {});

    fetch(`${API_BASE_URL}/matches`)
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch(() => {});
  }, []);

  const userData = users.find(
    (user) => user.username === currentUser.username
  );

  // Backenddagi haqiqiy ma'lumot ustun turadi — localStorage faqat
  // hali serverdan javob kelmagan paytdagi zaxira (fallback).
  const displayLeague = userData?.league || league;

  const userMatches = currentUser.username
    ? matches.filter(
        (match) =>
          match.homeUser === currentUser.username ||
          match.awayUser === currentUser.username
      )
    : [];

  const gamesPlayed = userData
    ? userData.wins + userData.draws + userData.losses
    : 0;

  if (!currentUser.username) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        <h1>👤 Profil</h1>
        <p style={{ color: "#aaa", marginTop: "20px" }}>
          Profilni ko'rish uchun avval ro'yxatdan o'ting.
        </p>
      </div>
    );
  }

  return (
    <div style={{ color: "white" }}>
      <h1 style={{ textAlign: "center" }}>👤 Profil</h1>

      <div
        style={{
          background: "#081544dd",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
        }}
      >
        <h2>Ishtirokchi ma'lumotlari</h2>

        <p>
          <strong>Ism:</strong> {currentUser.username}
        </p>
        <p>
          <strong>Liga:</strong> {displayLeague || "Tanlanmagan"}
        </p>

        {/* Eski kodda userData?.p / .w / .l / .pts ishlatilgan edi,
            lekin backend (users.json) ularni "wins", "draws",
            "losses", "points" deb nomlaydi — shu sababli bu
            statistikalar har doim bo'sh chiqardi. Endi to'g'ri
            maydon nomlari ishlatildi. */}
        <p>
          <strong>O'yinlar:</strong> {gamesPlayed}
        </p>
        <p>
          <strong>G'alaba:</strong> {userData?.wins ?? 0}
        </p>
        <p>
          <strong>Durang:</strong> {userData?.draws ?? 0}
        </p>
        <p>
          <strong>Mag'lubiyat:</strong> {userData?.losses ?? 0}
        </p>
        <p>
          <strong>Ochko:</strong> {userData?.points ?? 0}
        </p>
      </div>

      <div
        style={{
          background: "#1a1d29",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
        }}
      >
        <h2>📊 Faollik (30 kun)</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 40px)",
            gap: "4px",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          {[...Array(35)].map((_, index) => (
            <div
              key={index}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                background:
                  index === 34 ? "#00ff66" : "#2a2d3a",
              }}
            />
          ))}
        </div>

        <p style={{ marginTop: "10px", color: "#aaa" }}>
          1 kun faol bo'lgan
        </p>
      </div>

      <div
        style={{
          background: "#1a1d29",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>📜 O'yinlar tarixi</h2>

        <div
          style={{
            background: "#252a3d",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        >
          {userMatches.length === 0 && (
            <p style={{ color: "#aaa" }}>Hozircha o'yinlar yo'q.</p>
          )}

          {userMatches.map((match) => (
            <div
              key={match.id}
              style={{
                background: "#252a3d",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <h3>
                @{match.homeUser} vs @{match.awayUser}
              </h3>

              <p style={{ color: "#aaa" }}>Tur {match.round}</p>

              <p>
                {match.homeGoals === null
                  ? "Natija kutilmoqda"
                  : match.homeGoals + " : " + match.awayGoals}
              </p>

              <p>
                {match.status === "pending"
                  ? "⏳ O'ynalmagan"
                  : match.status === "waiting"
                  ? "⌛️ Tasdiq kutilmoqda"
                  : "✅ Tasdiqlangan"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#1a1d29",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>🏅 Qo'lga kiritilgan titullar</h2>

        <div
          style={{
            background: "#252a3d",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "10px",
            textAlign: "center",
          }}
        >
          {userData?.titles?.length > 0 ? (
            userData.titles.map((title, index) => (
              <p key={index}>{title}</p>
            ))
          ) : (
            <p style={{ color: "#aaa" }}>Hozircha titul yo'q</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
