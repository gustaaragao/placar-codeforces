import config from '../config.json'

// Resolve as informações de um participante pelo handle
const getParticipantInfo = (handle, sedeConfig) => {
  const partCfg = sedeConfig.participantes || {}
  const entry = partCfg[handle]
  if (!entry) return null
  // Suporte ao formato novo { nome, divisao } e ao formato antigo (string)
  if (typeof entry === 'object') return entry
  return { nome: entry, divisao: null }
}

export function parseCodeforcesData(cfData, sedeConfig = {}) {
  if (!cfData || !cfData.result || !cfData.result.problems) {
    return { problems: [], teams: [] }
  }

  const resultRows = cfData.result.rows || []

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

  // 2. Encontrar o 'first to solve' (menor tempo) para cada problema (Global e Local)
  const firstBloodByProblem = {}
  const firstBloodLocalByProblem = {}

  problems.forEach((p, idx) => {
    let minTimeGlobal = Infinity
    let minTimeLocal = Infinity

    resultRows.forEach((row) => {
      const res = row.problemResults[idx]
      if (res && res.points > 0) {
        // Global
        if (res.bestSubmissionTimeSeconds < minTimeGlobal) {
          minTimeGlobal = res.bestSubmissionTimeSeconds
        }

        // Local
        const isLocal = row.party.members.some(
          (m) => getParticipantInfo(m.handle, sedeConfig) !== null,
        )
        if (isLocal && res.bestSubmissionTimeSeconds < minTimeLocal) {
          minTimeLocal = res.bestSubmissionTimeSeconds
        }
      }
    })
    firstBloodByProblem[idx] = minTimeGlobal
    firstBloodLocalByProblem[idx] = minTimeLocal
  })

  // 3. Montar a lista de times (rows)
  const teams = resultRows.map((row) => {
    // Verificar se algum membro está na lista de participantes locais
    const localMembers = row.party.members.map((m) => ({
      handle: m.handle,
      info: getParticipantInfo(m.handle, sedeConfig),
    }))
    const isLocal = localMembers.some((m) => m.info !== null)

    // Determinar a divisão predominante do time (a do primeiro membro local encontrado)
    const localMember = localMembers.find((m) => m.info !== null)
    const divisao = localMember?.info?.divisao || null

    // Mapear os nomes customizados dos membros
    const memberDisplayNames = row.party.members.map((m) => {
      const info = getParticipantInfo(m.handle, sedeConfig)
      return info ? `${info.nome} (${m.handle})` : m.handle
    })

    const members = row.party.members.map((m) => {
      const info = getParticipantInfo(m.handle, sedeConfig)
      return {
        handle: m.handle,
        name: info ? info.nome : null,
      }
    })

    // Obter o nome do time incorporando o nome real da participante
    const baseMembersStr = memberDisplayNames.join(', ')
    const name = row.party.teamName
      ? isLocal && localMembers.some((m) => m.info)
        ? `${row.party.teamName} - ${baseMembersStr}`
        : row.party.teamName
      : baseMembersStr

    const institution = isLocal
      ? localMember?.info?.instituicao || sedeConfig.instituicao || ''
      : ''

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
          firstLocal: res.bestSubmissionTimeSeconds === firstBloodLocalByProblem[idx],
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
      teamName: row.party.teamName,
      members,
      institution,
      isLocal,
      divisao,
      laboratorio: localMember?.info?.laboratorio || null,
      complemento: localMember?.info?.complemento || null,
      scores,
      totalSolved: row.points,
      totalPenalty: row.penalty,
    }
  })

  // 4. Adicionar participantes locais que não possuem submissões
  const handlesWithSubmissions = new Set()
  teams.forEach((t) => {
    t.members.forEach((m) => handlesWithSubmissions.add(m.handle))
  })

  if (sedeConfig.participantes) {
    Object.keys(sedeConfig.participantes).forEach((handle) => {
      if (!handlesWithSubmissions.has(handle)) {
        const info = getParticipantInfo(handle, sedeConfig)
        if (info) {
          teams.push({
            id: handle,
            rank: null,
            name: `${info.nome} (${handle})`,
            teamName: '',
            members: [{ handle, name: info.nome }],
            institution: info.instituicao || sedeConfig.instituicao || '',
            isLocal: true,
            divisao: info.divisao || null,
            laboratorio: info.laboratorio || null,
            complemento: info.complemento || null,
            scores: {},
            totalSolved: 0,
            totalPenalty: 0,
          })
        }
      }
    })
  }

  return { problems, teams }
}

export const getShortName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return fullName

  const parts = fullName.trim().split(/\s+/)

  if (parts.length === 1) return parts[0] // "Gustavo" -> "Gustavo"
  if (parts.length === 2) return fullName // "Gustavo Silva" -> "Gustavo Silva"

  return `${parts[0]} ${parts[parts.length - 2]}` // "Gustavo Henrique Aragão" -> "Gustavo Aragão"
}

export const getCodeforcesName = (fullName) => {
  const parts = fullName.trim().split(/\s+/)

  return parts[parts.length - 1]
}
