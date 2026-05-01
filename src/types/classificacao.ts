export interface TimeClassificacao { // TIPAGEM DE DADOS
    rank: number;
    team: {
    id: number;
    name: string;
    logo: string;
};
points: number;
goalsDiff: number;
all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
};
  form: string; // ex: "WDLWW"
}