import { leagues } from "../data/leagues";
import { API_BASE_URL } from "../data/api";
import { useState, useEffect } from "react";

function Home() {
  // currentUser bo'lmasa (foydalanuvchi hali ro'yxatdan o'tmagan
  // bo'lsa) ilova yiqilmasligi uchun fallback obyekt.
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  ) || { username: null };

  const [leaguePlayers, setLeaguePlayers] = useState({
    "🇪🇸 La Liga": 0,
    "🏴 Premier League": 0,
  });
  const [joinedLeague, setJoinedLeague] = useState(() => {
    const savedLeague = localStorage.getItem("league");
    const league = leagues.find((l) => l.name === savedLeague);
    return league ? league.id : null;
  });
  const [pendingMatches, setPendingMatches] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [loadingLeague, setLoadingLeague] = useState(null);

  const registerLeague = async (league) => {
    if (!currentUser.username) {
      alert("Avval profilingizda foydalanuvchi nomini kiriting.");
      return;
    }

    setLoadingLeague(league.id);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser.username,
          league: league.name,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("league", league.name);
        setJoinedLeague(league.id);
        setLeaguePlayers((prev) => ({
          ...prev,
          [league.name]: (prev[league.name] || 0) + 1,
        }));

        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      } else {
        alert(result.message);
      }
    } catch {
      alert("Serverga ulanishda xatolik yuz berdi. Internetni tekshiring.");
    } finally {
      setLoadingLeague(null);
    }
  };

  useEffect(() => {
    // Avval bu fetch faqat savedLeague mavjud bo'lgandagina
    // chaqirilardi - shuning uchun hali hech qaysi ligaga yozilmagan
    // foydalanuvchida "Ishtirokchilar" va liga sonlari doim 0/bo'sh
    // ko'rinardi. Endi har doim chaqiriladi.
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((users) => {
        const counts = {};

        users.forEach((user) => {
          counts[user.league] = (counts[user.league] || 0) + 1;
        });

        setLeaguePlayers((prev) => ({ ...prev, ...counts }));
      })
      .catch(() => {
        // Server javob bermasa, eski (boshlang'ich) qiymatlar qoladi.
      });

    if (currentUser.username) {
      fetch(`${API_BASE_URL}/matches`)
        .then((res) => res.json())
        .then((data) => {
          const waiting = data.filter(
            (match) =>
              match.status === "waiting" &&
              match.awayUser === currentUser.username
          );

          setPendingMatches(waiting);
        })
        .catch(() => {});
    }
  }, []);

  const participantsCount = Object.values(leaguePlayers).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleConfirm = async (match) => {
    try {
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
    } catch {
      alert("Tasdiqlashda xatolik yuz berdi. Internetni tekshiring.");
    }
  };

  const handleComplain = async (match) => {
    try {
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
    } catch {
      alert("Shikoyat yuborishda xatolik yuz berdi. Internetni tekshiring.");
    }
  };

  return (
    <div>
      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        🏆 eFootball Champions League
      </h1>

      <div
        style={{
          background: "linear-gradient(135deg, #0d3b1e, #1f6b3d)",
          borderRadius: "20px",
          padding: "25px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#90EE90" }}>Joriy mavsum</h2>

        <h1
          style={{
            color: "white",
            fontSize: "60px",
            margin: "10px 0",
          }}
        >
          #1
        </h1>

        <p style={{ color: "white" }}>38 kun bo'ladi</p>

        <span
          style={{
            background: "#00c853",
            color: "white",
            padding: "6px 15px",
            borderRadius: "20px",
          }}
        >
          Faol
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#1a1d29",
            borderRadius: "15px",
            padding: "15px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h3>👥 Ishtirokchilar</h3>
          <h2>{participantsCount}</h2>
        </div>

        <div
          style={{
            background: "#1a1d29",
            borderRadius: "15px",
            padding: "15px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h3>🏆 Mavsum</h3>
          <h2>#1</h2>
        </div>
      </div>

      <div
        style={{
          background: "#1a1d29",
          borderRadius: "20px",
          padding: "20px",
          color: "white",
        }}
      >
        {pendingMatches.length > 0 && (
          <div
            style={{
              background: "#1a1d29",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "20px",
              color: "white",
            }}
          >
            {pendingMatches.map((match) => (
              <div
                key={match.id}
                style={{
                  background: "#252a3d",
                  borderRadius: "15px",
                  padding: "20px",
                  marginBottom: "20px",
                  color: "white",
                }}
              >
                <h2>⚠️ Natijani tasdiqlash</h2>

                <p>@{match.homeUser} natijani yubordi:</p>

                <h3>
                  {match.homeGoals} : {match.awayGoals}
                </h3>

                <button
                  onClick={() => handleConfirm(match)}
                  style={{
                    padding: "10px 20px",
                    background: "#00c853",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ✅ Tasdiqlash
                </button>

                <button
                  onClick={() => handleComplain(match)}
                  style={{
                    padding: "10px 20px",
                    background: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  ❌ Shikoyat qilish
                </button>
              </div>
            ))}
          </div>
        )}

        <h2>🏆 Ligalar</h2>

        {leagues.map((league) => {
          const currentCount = leaguePlayers[league.name] || 0;
          const isFull = currentCount >= league.maxPlayers;

          return (
            <div
              key={league.id}
              onClick={() => {
                if (!joinedLeague) {
                  setSelectedLeague(league);
                }
              }}
              style={{
                background:
                  selectedLeague?.id === league.id
                    ? "#00aa55"
                    : "#252a3d",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "10px",
                cursor: joinedLeague ? "not-allowed" : "pointer",
              }}
            >
              <h3>{league.name}</h3>

              <p>
                👥{currentCount} / {league.maxPlayers}
              </p>

              {selectedLeague?.id === league.id && (
                <button
                  disabled={
                    Boolean(joinedLeague) ||
                    isFull ||
                    loadingLeague === league.id
                  }
                  onClick={() => registerLeague(selectedLeague)}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "10px",
                    background: "#00ff66",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {loadingLeague === league.id
                    ? "Yuborilmoqda..."
                    : isFull
                    ? "Liga to'lgan"
                    : joinedLeague
                    ? "Ro'yxatdan o'tgan"
                    : "Ro'yxatdan o'tish"}
                </button>
              )}

              {joinedLeague === league.id && (
                <p
                  style={{
                    color: "#90EE90",
                    marginTop: "10px",
                  }}
                >
                  ✅ Siz ligadan ro'yxatdan o'tgansiz
                </p>
              )}
            </div>
          );
        })}

        <h2 style={{ marginTop: "20px" }}>📖 Turnir qoidalari</h2>

        <p>⏱️ O'yin davomiyligi: 8 daqiqa</p>
        <p>💪 O'yinchilar holati: Excellent</p>
        <p>📅 Natija yuborish muddati: 24 soat</p>
        <p>✅ Natija ikki tomon tasdiqlagandan keyin hisoblanadi</p>
      </div>
    </div>
  );
}

export default Home;
