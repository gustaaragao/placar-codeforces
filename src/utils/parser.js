import config from '../config.json'

export function parseCodeforcesData(cfData) {
  if (!cfData || !cfData.result || !cfData.result.problems || !cfData.result.rows) {
    return { problems: [], teams: [] }
  }

  // 1. Extrair os problemas usando a configuração de balões
  const problems = cfData.result.problems.map((p) => {
    const balaoCfg = config.baloes[p.index]
    const color = balaoCfg && typeof balaoCfg === 'object' ? balaoCfg.cor : balaoCfg || '#cbd5e1'
    const colorName = balaoCfg && typeof balaoCfg === 'object' ? balaoCfg.nome : ''

    return {
      id: p.index,
      name: p.name,
      color,
      colorName,
    }
  })

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
    const getRealName = (handle) => {
      const partCfg = config.sedeLocal.participantes
      if (partCfg) {
        if (typeof partCfg === 'object' && !Array.isArray(partCfg)) {
          return partCfg[handle] || null
        } else if (Array.isArray(partCfg)) {
          const f = partCfg.find((p) => p && p.handle === handle)
          return f ? f.nome : null
        }
      }
      return null
    }

    // Verificar se algum membro está na lista de handles locais ou em participantes
    const isLocal = row.party.members.some((m) => {
      const inH = config.sedeLocal.handles && config.sedeLocal.handles.includes(m.handle)
      return inH || getRealName(m.handle) !== null
    })

    // Mapear os nomes customizados dos membros
    const memberDisplayNames = row.party.members.map((m) => {
      const rn = getRealName(m.handle)
      return rn ? `${rn} (${m.handle})` : m.handle
    })

    // Obter o nome do time incorporando o nome real da participante
    const baseMembersStr = memberDisplayNames.join(', ')
    const name = row.party.teamName
      ? isLocal && row.party.members.some((m) => getRealName(m.handle))
        ? `${row.party.teamName} - ${baseMembersStr}`
        : row.party.teamName
      : baseMembersStr

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
          first: res.bestSubmissionTimeSeconds === firstBloodByProblem[idx],
        }
      } else if (res.rejectedAttemptCount > 0) {
        // Tentado, mas não resolvido
        scores[pId] = {
          solved: false,
          tries: -res.rejectedAttemptCount,
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
      totalPenalty: row.penalty,
    }
  })

  return { problems, teams }
}
