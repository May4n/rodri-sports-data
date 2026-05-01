import { useState } from 'react';
import { useClassificacao } from '../hooks/useClassificacao';
import { calcularMetricas } from '../utils/metricas';

//ESSA INTERFACE DEFINE AS PROPS QUE O COMPONENTE RECEBE DO App.tsx
interface Props {
    season: number;
}

interface LinhaMetricaProps {
    label: string;
    valorA: number;
    valorB: number;
    // "maior" = quem tem número maior é melhor (pontos, aproveitamento, gols marcados)
    // "menor" = quem tem número menor é melhor (gols sofridos por jogo)
    melhor: 'maior' | 'menor';
    sufixo?: string; // ex: "%" ou " gols"
}

function LinhaMetrica({ label, valorA, valorB, melhor, sufixo = '' }: LinhaMetricaProps) {
    const aVence = melhor === 'maior' ? valorA > valorB : valorA < valorB;
    const bVence = melhor === 'maior' ? valorB > valorA : valorB < valorA;
    const empate = valorA === valorB;

    const corA = aVence ? '#fbbf24' : empate ? '#a78bfa' : 'rgba(167, 139, 250,0.4)';
    const corB = bVence ? '#fbbf24' : empate ? '#a78bfa' : 'rgba(167, 139, 250,0.4)';

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid rgba(109, 40, 217, 0.2)',
        }}>
        {/*VALOR DO TIME A - ALINHADO À DIREITA*/}
        <span style={{
            textAlign: 'right',
            fontFamily: 'Alfa Slab One, serif',
            fontSize: '16px',
            color: corA,
            transition: 'color 0.3s ease',
        }}>
            {valorA}{sufixo}
        </span>

        {/* LABEL CENTRAL */}
        <span style={{
            textAlign: 'center',
            fontSize: '10px',
            color: 'rgba(167,139,250,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0 12px',
            whiteSpace: 'nowrap',
        }}>
            {label}
        </span>

        {/* VALOR DO TIME B - ALNHADO À ESQUERDA */}
        <span style={{
            textAlign: 'left',
            fontFamily: "'Alfa Slab One', serif",
            fontSize: '16px',
            color: corB,
            transition: 'color 0.3s ease',
        }}>
            {valorB}{sufixo}
        </span>
        </div>
    )
}

function ComparadorTimes({ season }: Props) {
    //OS DOIS ESTADOS DE SELEÇÃO - NULL SIGNIFICA "NENHUM TIME ESCOLHIDO AINDA"
    //O TIPO NUMBER | NULL REPRESENTA EXATAMENTE ISSO: OU TEMOS UM ID DE TIME, OU NÃO TEMOS NADA
    const [idTimeA, setIdTimeA] = useState<number | null>(null);
    const [idTimeB, setIdTimeB] = useState<number | null>(null);

    // REAPROVEITA O HOOK QUE JÁ EXISTE - SEM NENHUMA CHAMADA NOVA À API
    const { data, isLoading } = useClassificacao(season);

    if (isLoading) return (
        <div className='animate-pulse p-6'>
            <div className='h-8 bg-hover rounded w-48 mb-4'></div>
        </div>
    );

    const timeA = data?.times.find(t => t.team.id === idTimeA) ?? null;
    const timeB = data?.times.find(t => t.team.id === idTimeB) ?? null;

    return (
        <div className="p-4 md:p-6">
        <h2
            className="text-sm font-bold text-brand mb-6 text-center"
            style={{
            fontFamily: "'Alfa Slab One', serif",
            letterSpacing: "0.1em",
        }}>
            1VS1
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-2">
            <span className="text-xs text-muted text-center">Time A</span>
            <select
                value={idTimeA ?? ""}
                onChange={(e) =>
                setIdTimeA(e.target.value ? Number(e.target.value) : null)
                }
                style={{
                backgroundColor: "#2e1065",
                border: "1px solid #6d28d9",
                borderRadius: "8px",
                color: "#ddd6fe",
                fontSize: "13px",
                padding: "8px 10px",
                cursor: "pointer",
                outline: "none",
                width: "100%",
                }}
                >
                <option value="">Selecione...</option>
                {data?.times.map((t) => (
                <option key={t.team.id} value={t.team.id}>
                    {t.rank}. {t.team.name}
                </option>
                ))}
            </select>
            </div>

            <div className="flex flex-col gap-2">
            <span className="text-xs text-muted text-center">Time B</span>
            <select
                value={idTimeB ?? ""}
                onChange={(e) =>
                setIdTimeB(e.target.value ? Number(e.target.value) : null)
                }
                style={{
                backgroundColor: "#2e1065",
                border: "1px solid #6d28d9",
                borderRadius: "8px",
                color: "#ddd6fe",
                fontSize: "13px",
                padding: "8px 10px",
                cursor: "pointer",
                outline: "none",
                width: "100%",
                }}
            >
                <option value="">Selecione...</option>
                {data?.times.map((t) => (
                <option key={t.team.id} value={t.team.id}>
                    {t.rank}. {t.team.name}
                </option>
                ))}
            </select>
            </div>
        </div>

        {(!timeA || !timeB) && (
            <p className="text-muted text-xs text-center py-8">
            Selecione dois times para ver o comparativo
            </p>
        )}

        {timeA &&
            timeB &&
            (() => {
            const mA = calcularMetricas(timeA);
            const mB = calcularMetricas(timeB);

            return (
                <div style={{ marginTop: "16px" }}>
                <div
                    style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    marginBottom: "16px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid rgba(109,40,217,0.3)",
                    }}
                >
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                    }}
                    >
                    <img
                        src={timeA.team.logo}
                        alt={timeA.team.name}
                        style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                        }}
                    />
                    <span
                        style={{
                        fontSize: "11px",
                        color: "#ddd6fe",
                        textAlign: "center",
                        fontWeight: 600,
                        }}
                    >
                        {timeA.team.name}
                    </span>
                    <span style={{ fontSize: "10px", color: "#a78bfa" }}>
                        {timeA.rank}º lugar
                    </span>
                    </div>

                    <span
                    style={{
                        fontFamily: "'Alfa Slab One', serif",
                        fontSize: "18px",
                        color: "rgba(167,139,250,0.4)",
                        padding: "0 16px",
                    }}
                    >
                    VS
                    </span>

                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                    }}
                    >
                    <img
                        src={timeB.team.logo}
                        alt={timeB.team.name}
                        style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                        }}
                    />
                    <span
                        style={{
                        fontSize: "11px",
                        color: "#ddd6fe",
                        textAlign: "center",
                        fontWeight: 600,
                        }}
                    >
                        {timeB.team.name}
                    </span>
                    <span style={{ fontSize: "10px", color: "#a78bfa" }}>
                        {timeB.rank}º lugar
                    </span>
                    </div>
                </div>

                <LinhaMetrica
                    label="Pontos"
                    valorA={mA.pontos}
                    valorB={mB.pontos}
                    melhor="maior"
                />
                <LinhaMetrica
                    label="Aproveit."
                    valorA={mA.aproveitamento}
                    valorB={mB.aproveitamento}
                    melhor="maior"
                    sufixo="%"
                />
                <LinhaMetrica
                    label="Vitórias"
                    valorA={mA.vitorias}
                    valorB={mB.vitorias}
                    melhor="maior"
                />
                <LinhaMetrica
                    label="Empates"
                    valorA={mA.empates}
                    valorB={mB.empates}
                    melhor="maior"
                />
                <LinhaMetrica
                    label="Derrotas"
                    valorA={mA.derrotas}
                    valorB={mB.derrotas}
                    melhor="menor"
                />
                <LinhaMetrica
                    label="Gols/Jogo"
                    valorA={mA.golsMarcadosPorJogo}
                    valorB={mB.golsMarcadosPorJogo}
                    melhor="maior"
                />
                <LinhaMetrica
                    label="Sofridos/Jogo"
                    valorA={mA.GolsSofridosPorJogo}
                    valorB={mB.GolsSofridosPorJogo}
                    melhor="menor"
                />
                <LinhaMetrica
                    label="Saldo"
                    valorA={mA.saldoGols}
                    valorB={mB.saldoGols}
                    melhor="maior"
                />
                </div>
            );
            })()}
        </div>
    );
}

export default ComparadorTimes;