import { teams } from "../data/teams";
import { currentUser } from "../data/currentUser";
import { useState, useEffect } from "react";

function Profile() {
  const [league, setLeague] = useState("");
const [matches, setMatches] = useState([]);
 useEffect(() => {
  const savedLeague = localStorage.getItem("league");

  if (savedLeague) {
    setLeague(savedLeague);
  }

  fetch("http://127.0.0.1:5000/matches")
    .then((res) => res.json())
    .then((data) => setMatches(data));
}, []);
   const userData = teams.find(
  (team) => team.user === currentUser.username
);

const userMatches = matches.filter(
  (match) =>
    match.homeUser === currentUser.username ||
    match.awayUser === currentUser.username
);
  
  return (
    <div style={{ color: "white" }}>
      <h1 style={{ textAlign: "center" }}>
        👤 Profil
      </h1>

      <div
        style={{
          background: "#081544dd",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
        }}
      >
        <h2>Ishtirokchi ma'lumotlari</h2>

        <p><strong>Ism:</strong> {currentUser.username}</p>
        <p>
  <strong>Liga:</strong>{" "}
  {league || "Tanlanmagan"}
</p>

        <p><strong>O'yinlar:</strong> {userData?.p}</p>
<p><strong>G'alaba:</strong> {userData?.w}</p>
<p><strong>Mag'lubiyat:</strong> {userData?.l}</p>
<p><strong>Ochko:</strong> {userData?.pts}</p>
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
  background: index === 34 ? "#00ff66" : "#2a2d3a",
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

    <p style={{ color: "#aaa" }}>
      Tur {match.round}
    </p>

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
  <p style={{ color: "#aaa" }}>
    Hozircha titul yo'q
  </p>
)}
  </div>
</div>
    </div>
  );
}

export default Profile;