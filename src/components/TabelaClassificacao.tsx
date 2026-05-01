import { useClassificacao } from '../hooks/useClassificacao'
import { useDadosNBA } from '../hooks/useDadosNBA'

type Sport = 'football' | 'basketball'

interface Props {
  season: number
  sport: Sport
}

function TabelaClassificacao({ season, sport }: Props) {
  const basketballSeason = `${season}-${season + 1}`

  const futebol = useClassificacao(season)
  const nba = useDadosNBA(basketballSeason)

  if (sport === 'football' && futebol.isLoading) return <p>Carregando classificação...</p>
  if (sport === 'football' && futebol.isError) return <p style={{ color: '#FF0000' }}>Erro ao carregar dados.</p>
  if (sport === 'basketball' && nba.loading) return <p>Carregando NBA...</p>
  if (sport === 'basketball' && nba.error) return <p style={{ color: '#FF0000' }}>Erro ao carregar NBA.</p>

  const data = futebol.data
  const poucasRequisicoes = sport === 'football' && data?.requisicoesRestantes != null && data.requisicoesRestantes < 25
  const semRequisicoes    = sport === 'football' && data?.requisicoesRestantes === 0

  const nbaTimesSafe = Array.isArray(nba.times) ? nba.times : []

  const vazio = sport === 'football'
    ? !data?.times || data.times.length === 0
    : nbaTimesSafe.length === 0

  if (vazio) return (
    <div className='bg-card border border-default rounded-lg p-20 text-center'>
      <p className='text-muted text-sm'>Nenhum dado disponível para {season}.</p>
    </div>
  )

  return (
    <div>
      {semRequisicoes && (
        <p style={{ backgroundColor:'#FF4444', color:'white', padding:'8px 16px', borderRadius:'4px', marginBottom:'16px' }}>
          Limite diário atingido.
        </p>
      )}
      {poucasRequisicoes && !semRequisicoes && (
        <p style={{ backgroundColor:'#FFA500', color:'white', padding:'8px 16px', borderRadius:'4px', marginBottom:'16px' }}>
          Atenção: restam {data!.requisicoesRestantes} requisições hoje.
        </p>
      )}

      <div className='overflow-x-auto rounded-lg border border-default'>
        <div className='overflow-y-auto max-h-[420px] scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-transparent'>
          <table className='w-full text-sm'>
            <thead className='sticky top-0 bg-violet-900 z-10'>
              <tr className='bg-card text-muted uppercase text-xs'>
                <th className='px-4 py-3 text-left'>#</th>
                <th className='px-4 py-3 text-left'>Time</th>
                {sport === 'football' ? (
                  <>
                    <th className='px-4 py-3 text-center'>Pts</th>
                    <th className='hidden md:table-cell px-4 py-3 text-center'>J</th>
                    <th className='hidden md:table-cell px-4 py-3 text-center'>V</th>
                    <th className='hidden md:table-cell px-4 py-3 text-center'>E</th>
                    <th className='hidden md:table-cell px-4 py-3 text-center'>D</th>
                    <th className='px-4 py-3 text-center'>SG</th>
                  </>
                ) : (
                  <>
                    <th className='px-4 py-3 text-center'>V</th>
                    <th className='px-4 py-3 text-center'>D</th>
                    <th className='hidden md:table-cell px-4 py-3 text-center'>Win%</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sport === 'football'
                ? data!.times.map((time) => (
                  <tr key={time.team.id} className='border-t border-subtle hover:bg-hover transition-colors'>
                    <td className='px-2 md:px-4 py-3 text-muted'>{time.rank}</td>
                    <td className='px-2 md:px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <img src={time.team.logo} alt={time.team.name} width={20} />
                        <span className='text-xs md:text-sm'>{time.team.name}</span>
                      </div>
                    </td>
                    <td className='px-2 md:px-4 py-3 text-center font-bold text-brand'>{time.points}</td>
                    <td className='hidden md:table-cell px-4 py-3 text-center'>{time.all.played}</td>
                    <td className='hidden md:table-cell px-4 py-3 text-center text-positive'>{time.all.win}</td>
                    <td className='hidden md:table-cell px-4 py-3 text-center text-muted'>{time.all.draw}</td>
                    <td className='hidden md:table-cell px-4 py-3 text-center text-negative'>{time.all.lose}</td>
                    <td className='px-2 md:px-4 py-3 text-center'>
                      <span className={time.goalsDiff > 0 ? 'balance-positive' : time.goalsDiff < 0 ? 'balance-negative' : 'text-muted'}>
                        {time.goalsDiff > 0 ? `+${time.goalsDiff}` : time.goalsDiff}
                      </span>
                    </td>
                  </tr>
                ))
                : nbaTimesSafe.map((time, i) => {
                  const total = time.games.win.total + time.games.lose.total
                  const pct = total > 0 ? ((time.games.win.total / total) * 100).toFixed(1) : '—'
                  return (
                    <tr key={`${time.team.id}-${i}`} className='border-t border-subtle hover:bg-hover transition-colors'>
                      <td className='px-2 md:px-4 py-3 text-muted'>{i + 1}</td>
                      <td className='px-2 md:px-4 py-3'>
                        <div className='flex items-center gap-2'>
                          <img src={time.team.logo} alt={time.team.name} width={20} />
                          <span className='text-xs md:text-sm'>{time.team.name}</span>
                        </div>
                      </td>
                      <td className='px-2 md:px-4 py-3 text-center font-bold text-positive'>{time.games.win.total}</td>
                      <td className='px-2 md:px-4 py-3 text-center text-negative'>{time.games.lose.total}</td>
                      <td className='hidden md:table-cell px-4 py-3 text-center text-muted'>{pct}%</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TabelaClassificacao