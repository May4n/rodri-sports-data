import { useClassificacao } from '../hooks/useClassificacao';
import { useEffect, useState } from 'react';

interface Props {
    season: number;
}

function ResumoLiga({ season }: Props) {
const { data, isLoading } = useClassificacao(season);
const [visivel, setVisivel] = useState(false);
const [indiceAtual, setIndiceAtual] = useState(0);
const [saindo, setSaindo] = useState(false);

// useState simples — sem useRef, sem useMemo
const [ordemAleatoria, setOrdemAleatoria] = useState<number[]>([]);

useEffect(() => {
    // RESETA A ORDEM A TEMPORADA MUDA
    const t = setTimeout(() => {
        setOrdemAleatoria([]);
        setIndiceAtual(0);
        setVisivel(false);
    }, 0);
    return () => clearTimeout(t);
}, [season]);

useEffect(() => {
  // Só roda uma vez quando data chega
    if (!data || ordemAleatoria.length > 0) return;

    const indices = Array.from(
    { length: data.times.length - 1 },
    (_, i) => i + 1
    );
    const embaralhado = [...indices].sort(() => Math.random() - 0.5);

  // setTimeout(0) torna o setState assíncrono
    const t = setTimeout(() => setOrdemAleatoria(embaralhado), 0);
    return () => clearTimeout(t);

}, [data, ordemAleatoria.length]);

// animação de entrada — separado e limpo
useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => setVisivel(true), 100);
    return () => clearTimeout(timer);
}, [data]);

  // Rotação automática a cada 3 segundos
useEffect(() => {
if (!data || ordemAleatoria.length === 0) return;

const intervalo = setInterval(() => {
    // Inicia animação de saída
    setSaindo(true);

    setTimeout(() => {
    setIndiceAtual(prev => (prev + 1) % ordemAleatoria.length);
    setSaindo(false);
    }, 300); // tempo da animação de saída antes de trocar

}, 3000);

return () => clearInterval(intervalo);
}, [data, ordemAleatoria]);

  if (isLoading) return (
    <div className="bg-card border border-default rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-hover rounded w-32 mb-4"></div>
      <div className="flex gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-hover rounded-lg flex-1"></div>
        ))}
      </div>
    </div>
  );

  const lider = data?.times[0];
  const timeAtual = data?.times[ordemAleatoria[indiceAtual]];

return (
    <div className="bg-card border border-default rounded-lg p-4 md:p-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
        <span style={{
            fontFamily: "'Alfa Slab One', serif",
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(167,139,250,0.6)',
        }}>
            Brasileirão {season}
        </span>
        {/* Indicador de posição no carrossel */}
        <div className="flex gap-1">
            {ordemAleatoria.map((_, i) => (
            <div
                key={i}
                style={{
                width: i === indiceAtual ? '16px' : '4px',
                height: '4px',
                borderRadius: '99px',
                background: i === indiceAtual
                    ? '#f59e0b'
                    : 'rgba(167,139,250,0.3)',
                transition: 'width 0.3s ease, background 0.3s ease',
                }}
            />
            ))}
        </div>
        </div>

        {/* Layout: líder fixo + time rotativo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Líder — fixo, sempre visível */}
        {lider && (
            <div
            className="flex items-center gap-3 p-3 md:p-4 rounded-lg"
            style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                opacity: visivel ? 1 : 0,
                transform: visivel ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
            >
            <img
                src={lider.team.logo}
                alt={lider.team.name}
                style={{ width: '44px', height: '44px', objectFit: 'contain' }}
            />
            <div className="flex-1">
                <p className="text-xs text-muted mb-0.5">Líder do campeonato</p>
                <p style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: '16px',
                color: '#fbbf24',
                margin: '0 0 4px',
                }}>
                {lider.team.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted">
                <span className="text-positive">{lider.all.win}V</span>
                <span>{lider.all.draw}E</span>
                <span className="text-negative">{lider.all.lose}D</span>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted mb-1">Pontos</p>
                <p style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: '32px',
                color: '#fbbf24',
                lineHeight: 1,
                margin: 0,
                }}>
                {lider.points}
                </p>
            </div>
            </div>
        )}

        {/* Time rotativo — muda a cada 3 segundos */}
        {timeAtual && (
            <div
            className="flex items-center gap-3 p-3 md:p-4 rounded-lg"
            style={{
                background: 'rgba(109,40,217,0.15)',
                border: '1px solid rgba(109,40,217,0.25)',
                // animação de entrada/saída controlada pelo estado saindo
                opacity: saindo ? 0 : 1,
                transform: saindo ? 'translateX(10px)' : 'translateX(0)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
            >
            <img
                src={timeAtual.team.logo}
                alt={timeAtual.team.name}
                style={{ width: '44px', height: '44px', objectFit: 'contain' }}
            />
            <div className="flex-1">
                <p className="text-xs text-muted mb-0.5">
                {timeAtual.rank}º lugar
                </p>
                <p style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: '16px',
                color: '#ddd6fe',
                margin: '0 0 4px',
                }}>
                {timeAtual.team.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted">
                <span className="text-positive">{timeAtual.all.win}V</span>
                <span>{timeAtual.all.draw}E</span>
                <span className="text-negative">{timeAtual.all.lose}D</span>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted mb-1">Pontos</p>
                <p style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: '32px',
                color: '#ddd6fe',
                lineHeight: 1,
                margin: 0,
                }}>
                {timeAtual.points}
                </p>
            </div>
            </div>
        )}

        </div>
    </div>
    );
}

export default ResumoLiga;