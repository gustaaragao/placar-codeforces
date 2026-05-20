export default {
  nav: {
    scoreboard: 'Placar',
    admin: 'Admin',
  },
  table: {
    lastUpdate: 'Última atualização',
    loading: 'Carregando...',
    reload: 'Recarregar',
    updating: 'Atualizando…',
    rank: '#',
    teamName: 'Time / Nome',
    total: 'Total',
  },
  filter: {
    general: 'Geral',
    local: 'Sede Local',
  },
  admin: {
    title: 'Controle de Entrega de Balões',
    update: 'Atualizar',
    updating: 'Atualizando...',
    resetHistory: 'Reiniciar Histórico',
    pending: 'Pendentes',
    delivered: 'Entregues',
    search: 'Buscar competidora, time ou problema...',
    lastCheck: 'Última verificação',
    loadingSubmissions: 'Carregando submissões do contest...',
    noPendingTitle: 'Nenhum balão pendente!',
    noPendingSearch: 'Nenhum resultado encontrado para a busca atual.',
    noPendingAll: 'Todos os balões das submissões aceitas já foram marcados como entregues.',
    noDeliveredTitle: 'Nenhum balão entregue registrado',
    noDeliveredSearch: 'Nenhum resultado encontrado na lista de entregues.',
    noDeliveredAll:
      'Os balões marcados como entregues aparecerão aqui para registro e possibilidade de desfazer a ação.',
    markDelivered: 'Marcar como entregue',
    undoDelivery: 'Desfazer entrega',
    deliveredSuccess: 'Entregue com sucesso',
    tries: (n) => `${n} ${n === 1 ? 'tentativa' : 'tentativas'}`,
    confirmReset:
      'Tem certeza que deseja limpar todo o histórico de balões entregues? Essa ação reiniciará a lista para todos os problemas resolvidos.',
  },
  footer: {
    credit: 'Aplicação desenvolvida pela',
    partner: 'em parceria com',
    repo: 'Repositório',
  },
  head: {
    title: 'Placar - MFP',
  },
}
