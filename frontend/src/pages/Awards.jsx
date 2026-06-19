import { teams } from "../data/teams";

function Awards() {
  const goldenBall = [...teams]
    .sort((a, b) => b.w - a.w)
    .slice(0, 3);

  const goldenBoot = [...teams]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);

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
        <h2 style={{ color: "gold" }}>
          🏆 Oltin To'p nomzodlari
        </h2>

        {goldenBall.map((player, index) => (
          <div key={player.id} style={{ marginBottom: "15px" }}>
            <p>
              {index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : "🥉"}{" "}
              {player.user} | {player.club} | {player.w} g'alaba
            </p>

            <progress
              value={Math.max(
                20,
                Math.round(
                  (player.w /
                    (goldenBall[0].w || 1)) *
                    100
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
        <h2 style={{ color: "#7CFC00" }}>
          👟 Oltin Butsa nomzodlari
        </h2>

        {goldenBoot.map((player, index) => (
          <div key={player.id} style={{ marginBottom: "15px" }}>
            <p>
              {index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : "🥉"}{" "}
              {player.user} | {player.club} | {player.goals} gol
            </p>

            <progress
              value={Math.max(
                20,
                Math.round(
                  (player.goals /
                    (goldenBoot[0].goals || 1)) *
                    100
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