import { apiFetch } from './api';
import type { TimeClassificacao } from '../types/classificacao';

// EXPORTA O TIPO PARA USAR NO HOOK
export interface ClassificacaoComLimite {
    times: TimeClassificacao[];
    requisicoesRestantes:number | null;
}

export async function getClassificacao(
    season: number = 2024
): Promise<ClassificacaoComLimite> {
    const { data, requisicoesRestantes } = await apiFetch<
    { league: { standings: TimeClassificacao[][] } }[]
    >(`/standings?league=71&season=${season}`);

if (!data || data.length === 0) {
    return { times: [], requisicoesRestantes };
}

    return {
        times: data[0].league.standings[0],
        requisicoesRestantes,
    };
}