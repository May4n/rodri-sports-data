import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { NBATeamStanding } from "../services/basketballApi";

interface Props {
  times: NBATeamStanding[];
  season: string
}

function normalize(val: number, min: number, max: number) {
  if (max === min) return 50;
  return Math.round(
    Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100)),
  );
}

function buildRadarData(time: NBATeamStanding, todos: NBATeamStanding[]) {
  const wins = todos.map((t) => t.games.win.total);
  const losses = todos.map((t) => t.games.lose.total);
  const ptsFor = todos.map(t => t.points?.for ?? 0);
  const ptsAgainst = todos.map(t => t.points?.against ?? 0);
  const winPct = todos.map((t) => {
    const total = t.games.win.total + t.games.lose.total;
    return total > 0 ? t.games.win.total / total : 0;
  });
  const diff = todos.map((t) => {
    const pf = t.points?.for ?? 0;
    const pa = t.points?.against ?? 0;
    return pf - pa;
  });

  const myWinPct = (() => {
    const total = time.games.win.total + time.games.lose.total;
    return total > 0 ? time.games.win.total / total : 0;
  })();

  const myDiff = (() => {
    const pf = time.points?.for ?? 0;
    const pa = time.points?.against ?? 0;
    return pf - pa;
  })();

  return [
    {
      stat: "Vitórias",
      value: normalize(
        time.games.win.total,
        Math.min(...wins),
        Math.max(...wins),
      ),
    },
    {
      stat: "Aproveit.",
      value: normalize(myWinPct, Math.min(...winPct), Math.max(...winPct)),
    },
    {
      stat: "Ataque",
      value: normalize(
        time.points?.for ?? 0,
        Math.min(...ptsFor),
        Math.max(...ptsFor),
      ),
    },
    {
      stat: "Defesa",
      // invertido: menos pontos sofridos = melhor defesa
      value: normalize(
        Math.max(...ptsAgainst) - (time.points?.against ?? 0),
        0,
        Math.max(...ptsAgainst) - Math.min(...ptsAgainst),
      ),
    },
    {
      stat: "Saldo",
      value: normalize(myDiff, Math.min(...diff), Math.max(...diff)),
    },
    {
      stat: "Solidez",
      // inverso de derrotas
      value: normalize(
        Math.max(...losses) - time.games.lose.total,
        0,
        Math.max(...losses) - Math.min(...losses),
      ),
    },
  ];
}

export function GraficoRadarNBA({ times, season }: Props) {
  const [selected, setSelected] = useState(0);

  if (!times || times.length === 0)
    return (
      <p className="text-muted text-center py-8 text-sm">
        Nenhum dado disponível.
      </p>
    );

  // pega top 10 por vitórias
  const top10 = [...times]
  .filter((t, index, self) =>
    index === self.findIndex(x => x.team.id === t.team.id)
)
    .sort((a, b) => b.games.win.total - a.games.win.total)
    .slice(0, 10);

  const time = top10[selected];
  const radarData = buildRadarData(time, times);

  const total = time.games.win.total + time.games.lose.total;
  const winPct = total > 0 ? ((time.games.win.total / total) * 100).toFixed(1) : "—";
  const ptsFor = time.points?.for ?? "—";
  const ptsAgainst = time.points?.against ?? "—";

  return (
    <div className="bg-card border border-default rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-amber-400 font-bold tracking-widest uppercase text-xs text-center">
        Top 10 — Perfil do Time · {season}
      </h2>

      {/* Seletor de time */}
      <div className="flex flex-wrap gap-2 justify-center">
        {top10.map((t, i) => (
          <button
            key={`${t.team.id}-${i}`}
            onClick={() => setSelected(i)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200
              ${
                selected === i
                  ? "bg-violet-600 text-white scale-105"
                  : "bg-violet-900/50 text-violet-300 hover:bg-violet-800 hover:text-white"
              }`}
          >
            <img
              src={t.team.logo}
              alt={t.team.name}
              className="w-4 h-4 object-contain"
            />
            {t.team.name.split(" ").pop()}
          </button>
        ))}
      </div>

      {/* Info do time */}
      <div className="flex items-center gap-3 justify-center">
        <img
          src={time.team.logo}
          alt={time.team.name}
          className="w-8 h-8 object-contain"
        />
        <div className="text-center">
          <p className="text-white font-bold text-sm">{time.team.name}</p>
          <p className="text-violet-300 text-xs">
            {time.games.win.total}V · {time.games.lose.total}D · {winPct}%
            aproveit.
          </p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {[
          { label: "Vitórias", val: time.games.win.total },
          { label: "Derrotas", val: time.games.lose.total },
          { label: "Aproveit.", val: `${winPct}%` },
          { label: "Pts Marc.", val: ptsFor },
          { label: "Pts Sofr.", val: ptsAgainst },
          { label: "Saldo",
            val:
              typeof ptsFor === "number" && typeof ptsAgainst === "number"
                ? ptsFor - ptsAgainst > 0
                  ? `+${ptsFor - ptsAgainst}`
                  : ptsFor - ptsAgainst
                : "—",
          },
        ].map((s) => (
          <div key={s.label} className="bg-violet-900/40 rounded-lg py-1.5">
            <p className="text-amber-400 font-bold">{s.val}</p>
            <p className="text-violet-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Radar */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#4c1d95" />
            <PolarAngleAxis
              dataKey="stat"
              tick={{ fill: "#c4b5fd", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name={time.team.name}
              dataKey="value"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(val) => [`${val}/100`, ""]}
              contentStyle={{
                backgroundColor: "#1e1b4b",
                border: "1px solid #4c1d95",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
