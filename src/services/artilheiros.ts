import { apiFetch } from './api';
import type { Artilheiro } from '../types/artilheiros';

export async function getArtilheiros(
  season: number = 2024
): Promise<Artilheiro[]> {
  const { data } = await apiFetch<Artilheiro[]>(
    `/players/topscorers?league=71&season=${season}`
);

  // RETORNA VAZIO EM VEZ DE LANÇAR ERRO - TEMPORADA SEM DADOS
  if (!data || data.length === 0) {
      return [];
  }

  return data;
}