import "./App.css";
import GraficoArtilheiros from "./components/GraficoArtilheiros";
import TabelaClassificacao from "./components/TabelaClassificacao";
import ResumoLiga from "./components/ResumoLiga";
import ComparadorTimes from "./components/ComparadorTimes";
import { useState } from "react";
import { GraficoRadarNBA } from "./components/GraficoRadarNBA";
import { useDadosNBA } from "./hooks/useDadosNBA";

function App() {
  const [sport, setSport] = useState<"football" | "basketball">("football");
  const [season, setSeason] = useState(2023);

  const basketballSeason = `${season}-${season + 1}`;
  const nba = useDadosNBA(sport === "basketball" ? basketballSeason : "");

  const seasons = sport === "football" ? [2023, 2024] : [2023];

  const seasonLabel = (s: number) =>
    sport === "football" ? `${s}` : `${s}-${s + 1}`;

  return (
    <div className="min-h-screen bg-app text-muted p-4 md:p-8 relative">
      {/*BLOBS ANIMAODS*/}
      <div className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col gap-y-10 relative" style={{ zIndex: 2 }}>
        {/*TÍTULO PRINCIPAL*/}
        <div className="max-w-7xl mx-auto flex flex-col gap-7">
          <div
            style={{
              position: "relative",
              display: "inline-block",
              textAlign: "center",
              overflow: "visible",
              isolation: "isolate",
              zIndex: 10,
            }}
          >
            {/*DAHSBOARD SOBREPOSTO*/}
            <span
              style={{
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -52%)",
                fontFamily: "Alfa Slab One, serif",
                fontSize: "40px",
                fontWeight: 200,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
                whiteSpace: "nowrap",
                mixBlendMode: "overlay",
                zIndex: 2,
                animation: "slideUp 3.4s cubic-bezier(0.3, 1, 0, 1) 0.5s both",
              }}
            >
              Data
            </span>

            {/*"ESPORTIVO"*/}
            <span
              style={{
                display: "block",
                fontFamily: "Bebas Neue, serif",
                fontStyle: "italic",
                fontSize: "56px",
                fontWeight: 600,
                paddingRight: "10px",
                lineHeight: 1,
                letterSpacing: "0.25em",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "1px rgba(155, 85, 10)",
                color: "transparent",
                whiteSpace: "nowrap",
                zIndex: 2,
                position: 'relative',
                animation: 'pulse 1.5s ease-in-out infinite'  // infinite = repete para sempre
              }}
            >
              Score
            </span>
          </div>

          {/*LINHA DECORATIVA*/}
          <div
            style={{
              width: "100%",
              height: "1.5px",
              background:
                "linear-gradient(to right, transparent, #f59e0b, #d97706, transparent)",
              borderRadius: "2px",
              marginTop: "-20px",
            }}
          />
        </div>

        {/* Seletor de esporte */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            {/*SETA ESQUERDA*/}
            <button
              onClick={() => {
                const sports = ["football", "basketball"] as const;
                const idx = sports.indexOf(sport);
                const prev = sports[(idx - 1 + sports.length) % sports.length];
                setSport(prev);
                setSeason(2023);
              }}
              className="text-muted hover:text-white trasnsition-colors text-xl leading-none select-none"
            >
              ‹
            </button>

            {/* DISPLAY DO ESPORTE ATUAL */}
            <div className="flex items-center gap-2 px-5 py-2 rounded-lg border border-violet-600 bg-violet-900/50 min-w-[140px] justify-center cursor-default">
              <span className="text-base">
                {sport === "football" ? "⚽" : "🏀"}
              </span>
              <span className="text-white font-semibold uppercase tracking-wider text-sm">
                {sport === "football" ? "Futebol" : "Basquete"}
              </span>
            </div>

            {/* SETA DIREITA */}
            <button
              onClick={() => {
                const sports = ["football", "basketball"] as const;
                const idx = sports.indexOf(sport);
                const next = sports[(idx + 1) % sports.length];
                setSport(next);
                setSeason(2023);
              }}
              className="text-violet-400 hover:text-white transition-colors text-xl leading-none select-none"
            >
              ›
            </button>
          </div>
        </div>
        {/*SELETOR DE TEMPORADA*/}
        <div className="flex flex-col items-center gap-1">
            <span className="text-lg text-muted">Temporada</span>
            {/* FUTEBOL: select interativo | BASQUETE: botão estático */}
            {sport === "basketball" ?(

            <div
              style={{
                background: "#4A148C",
                border: "1px solid #6d28d9",
                borderRadius: "8px",
                color: "#fbbf24",
                fontFamily: "Alfa Slab One, serif",
                fontSize: "14px",
                padding: "6px 24px",
                outline: "none",
              }}
            >
              2023-2024
              </div>
            ) : (
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              style={{
                background: "#4A148C",
                border: "1px solid #6d28d9",
                borderRadius: "8px",
                color: "#fbbf24",
                fontFamily: "Alfa Slab One, serif",
                fontSize: "14px",
                padding: "6px 24px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {seasonLabel(s)}
                </option>
              ))}
            </select>
          )}
        
          {/*LEGENDA PARA TEMPORADA BASQUETE*/}
          {sport === "basketball" && (
            <span className="text-muted text-xs tracking-wider">
              Temporada Regular · Out-Abr
            </span>
          )}
          {/*FECHA FLEX FLEX-COL*/}
          </div> 
        {sport === "football" ? (
          <>
            <ResumoLiga season={season} />
            <TabelaClassificacao season={season} sport={sport} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoArtilheiros season={season} />
              <div className="bg-card border border-default rounded-lg overflow-hidden">
                <ComparadorTimes season={season} />
              </div>
            </div>
          </>
        ) : (
          <>
            <GraficoRadarNBA times={nba.times} season={basketballSeason} />
            <TabelaClassificacao season={season} sport={sport} />
          </>
        )}

        {/*FECHA FLEX FLEX-COL*/}
        </div>
      {/*FECHA MIN-H-SCREEN*/}
    </div>
  );
}
export default App;
