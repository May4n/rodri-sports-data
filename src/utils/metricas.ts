import type { TimeClassificacao } from '../types/classificacao';

export interface MetricasTime {
    pontos: number;
    aproveitamento: number;
    golsMarcadosPorJogo: number;
    GolsSofridosPorJogo: number;
    vitorias: number;
    empates: number;
    derrotas: number;
    saldoGols: number;
    jogos: number;
}

export function calcularMetricas(time: TimeClassificacao): MetricasTime {
    const { all, points, goalsDiff } = time;
    const jogos = all.played;

    // EVITA DIVISÃO POR ZERO SE O TIME AINDA NÃO JOGOU NENHUMA PARTIDA
    const divisor = jogos > 0 ? jogos : 1;

    const aproveitamento =  jogos > 0
    ? ((all.win * 3 + all.draw) / (jogos * 3)) * 100 : 0;

    return {
        pontos: points,
        aproveitamento: Math.round(aproveitamento * 10) / 10, // 1 casa decimal
        golsMarcadosPorJogo: Math.round((all.goals.for / divisor) * 100) / 100,
        GolsSofridosPorJogo: Math.round((all.goals.against / divisor) * 100) / 100,
        vitorias: all.win,
        empates: all.draw,
        derrotas: all.lose,
        saldoGols: goalsDiff,
        jogos,
    };
}