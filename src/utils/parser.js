import config from '../config.json'

export function parseCodeforcesData(cfData) {
  if (!cfData || !cfData.result || !cfData.result.problems || !cfData.result.rows) {
    return { problems: [], teams: [] }
  }

  // 1. Extrair os problemas usando a configuração de balões
  const problems = cfData.result.problems.map((p) => ({
    id: p.index,
    name: p.name,
    color: config.baloes[p.index] || '#cbd5e1' // cor padrão se não achar
  }))

  // 2. Encontrar o 'first to solve' (menor tempo) para cada problema
  const firstBloodByProblem = {}
  problems.forEach((p, idx) => {
    let minTime = Infinity
    cfData.result.rows.forEach((row) => {
      const res = row.problemResults[idx]
      // Respostas com pontos > 0 significam accepted
      if (res.points > 0 && res.bestSubmissionTimeSeconds < minTime) {
        minTime = res.bestSubmissionTimeSeconds
      }
    })
    firstBloodByProblem[idx] = minTime
  })

  // 3. Montar a lista de times (rows)
  const teams = cfData.result.rows.map((row) => {
    // Obter o nome do time (se existir teamName) ou o handle do usuário
    const name = row.party.teamName || row.party.members.map(m => m.handle).join(', ')
    
    // Verificar se algum membro está na lista de handles locais
    const isLocal = row.party.members.some(m => config.sedeLocal.handles.includes(m.handle))
    const institution = isLocal ? config.sedeLocal.instituicao : ''

    const scores = {}
    row.problemResults.forEach((res, idx) => {
      const pId = problems[idx].id
      
      if (res.points > 0) {
        // Resolvido
        scores[pId] = {
          solved: true,
          tries: res.rejectedAttemptCount + 1,
          time: Math.floor(res.bestSubmissionTimeSeconds / 60), // em minutos
          first: res.bestSubmissionTimeSeconds === firstBloodByProblem[idx]
        }
      } else if (res.rejectedAttemptCount > 0) {
        // Tentado, mas não resolvido
        scores[pId] = {
          solved: false,
          tries: -res.rejectedAttemptCount
        }
      }
    })

    return {
      id: row.party.participantId || name,
      rank: row.rank,
      name,
      institution,
      isLocal,
      scores,
      totalSolved: row.points,
      totalPenalty: row.penalty
    }
  })

  return { problems, teams }
}