import { useEffect, useState } from "react";
import { API_BASE_URL } from "../data/api";

function Awards() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Eski kodda data/teams.js'dagi statik mock ma'lumotlar ishlatilgan
  // edi — real foydalanuvchilar reytingi o'zgarsa ham bu sahifa
  // yangilanmasdi. Endi /users endpointidan real ma'lumot olinadi.
  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const goldenBall = [...users].sort((a, b) => b.wins - a.wins).slice(0, 3);

  const goldenBoot = [...users]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        <h1 style={{ color: "gold" }}>🥇 Sovrinlar</h1>
        <p style={{ color: "#aaa" }}>Yuklanmoqda...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        <h1 style={{ color: "gold" }}>🥇 Sovrinlar</h1>
        <p style={{ color: "#aaa" }}>
          Hozircha statistika yo'q — o'yinlar boshlanganidan keyin
          nomzodlar shu yerda chiqadi.
        </p>
      </div>
    );
  }

  return (
    <div style={{ color: "white" }}>
      <h1
        style={{
          color: "gold",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        🥇 Sovrinlar
      </h1>

      <div
        style={{
          background: "#1a1f2e",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "gold" }}>🏆 Oltin To'p nomzodlari</h2>

        {goldenBall.map((player, index) => (
          <div key={player.username} style={{ marginBottom: "15px" }}>
            <p>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}{" "}
              @{player.username} | {player.league} | {player.wins}{" "}
              g'alaba
            </p>

            <progress
              value={Math.max(
                20,
                Math.round(
                  (player.wins / (goldenBall[0].wins || 1)) * 100
                )
              )}
              max="100"
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#1a1f2e",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h2 style={{ color: "#7CFC00" }}>👟 Oltin Butsa nomzodlari</h2>

        {goldenBoot.map((player, index) => (
          <div key={player.username} style={{ marginBottom: "15px" }}>
            <p>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}{" "}
              @{player.username} | {player.league} | {player.goals}{" "}
              gol
            </p>

            <progress
              value={Math.max(
                20,
                Math.round(
                  (player.goals / (goldenBoot[0].goals || 1)) * 100
                )
              )}
              max="100"
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Awards;
