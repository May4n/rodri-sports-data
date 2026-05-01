import { useQuery } from '@tanstack/react-query';
import { getClassificacao } from '../services/classificacao';

export function useClassificacao(season: number) {
return useQuery({
    queryKey: ['classificacao', season],
    queryFn: () => getClassificacao(season),
});
}