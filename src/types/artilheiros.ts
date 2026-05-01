export interface Artilheiro {
    player: {
        id: number;
        name: string;
        photo: string;
    };
    statistics: {
        goals: {
            total: number;
        };
        team: {
            name: string;
            logo: string;
        };
    }[]; // O [] em TypeScript significa array de. STATISTICS NÃO É UM UNICO OBJETO - É UM ARRAY E CADA OBEJTO DESSE ARRAY É UM OBJETO QUE TEM GOALS E TEAM 
}