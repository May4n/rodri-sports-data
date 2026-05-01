import { useQuery } from '@tanstack/react-query';
import { getArtilheiros } from '../services/artilheiros';

export function useArtilheiros(season: number) {
    return useQuery({
    queryKey: ['artilheiros', season],
    queryFn: () => getArtilheiros(season),
    });
}

export default useArtilheiros;