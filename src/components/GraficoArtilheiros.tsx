import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell, // eslint-disable-line @typescript-eslint/no-unused-vars
} from 'recharts';
import { useArtilheiros } from '../hooks/useArtilheiros';

interface DadoTooltip {
    active?: boolean;
    payload?: Array<{
    payload: {
    nome: string;
    gols: number;
    time: string;
    foto: string;
    };
    }>;
}

interface Props {
    season: number;
}

// Tooltip PERSONALIZADO - APARECE AO PASSAR O MOUSE EM CADA BARRA
function TooltipPersonalizado({ active, payload }: DadoTooltip) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className='bg-gray-500 border border-gray-600 rounded p-3 text-sm'>
                <div className='flex items-center gap-2 mb-1'>
                    <img src={d.foto} alt={d.nome} width={20} className='rounded-full' />
                    <span className='font-bold text-orange-400'>{d.nome}</span>
                </div>
                <p className='text-rose-500'>{d.time}</p>
                <p className='text-lime-300 font-bold'>{d.gols} gols</p>
            </div>
        );
    }
    return null;
}

function GraficoArtilheiros({ season }: Props) {
    const { data, isLoading, isError } = useArtilheiros(season);

    if (isLoading) return <p className='text-gray-400'>Carregando artilheiros...</p>;
    if (isError) return <p className='text-red-500'>Erro ao carregar artilheiros.</p>;

    // TRANSFROMA OS DADOS DA API NO FORMATO QUE O RECHARTS ESPERA
    //ESSE PROCESSO DE TRASFORMAÇÃO É CHAMADO DE "mapping" OU "data shaping"
    const dadosGrafico = data?.slice(0, 10).map((a) => ({
        nome: a.player.name,
        gols: a.statistics[0].goals.total,
        time: a.statistics[0].team.name,
        foto: a.player.photo,
    }));

    return (
        <div id='wrapper_externo' className='bg-card rounded-lg border border-default p-4'>
            <h2 className='text-lg font-black text-brand mb-4 text-center'>
                Top 10 Artilheiros · Brasileirão {season}
            </h2>

            {/*ResponsiveContainer FAZ O GRÁFICO SE ADAPTAR AO TAMANHO DA TELA*/}
            <ResponsiveContainer width='100%' height={220}>
                <BarChart
                data={dadosGrafico}
                layout="vertical" 
                margin={{ left: 10, right: 10, top: 0, bottom: 0 }}
                >
                <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                horizontal={false}  // só linhas verticais, mais limpo
                />
                <XAxis
                type="number"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
                />
                <YAxis
                type="category"
                dataKey="nome"
                tick={{ fill: '#a78bfa', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={65}
                />
                <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: '#1F2937' }} />
                    <Bar dataKey='gols' radius={[0, 4, 4, 0]}>
                        {dadosGrafico?.map((_, index) => (
                            // DEGRADE DE COR
                        <Cell
                            key={index}
                            fill={index == 0 ? '#F59E0B' : index < 3 ? '#10B981' : '#3B82F6'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
    );
}

export default GraficoArtilheiros;