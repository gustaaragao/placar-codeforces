export default {
  nav: {
    scoreboard: 'Scoreboard',
    admin: 'Admin',
  },
  table: {
    lastUpdate: 'Last update',
    loading: 'Loading...',
    reload: 'Reload',
    updating: 'Updating…',
    rank: '#',
    teamName: 'Team / Name',
    total: 'Total',
  },
  filter: {
    general: 'General',
    local: 'Local Venue',
  },
  admin: {
    title: 'Balloon Delivery Control',
    update: 'Update',
    updating: 'Updating...',
    resetHistory: 'Reset History',
    pending: 'Pending',
    delivered: 'Delivered',
    search: 'Search competitor, team or problem...',
    lastCheck: 'Last check',
    loadingSubmissions: 'Loading contest submissions...',
    noPendingTitle: 'No pending balloons!',
    noPendingSearch: 'No results found for the current search.',
    noPendingAll: 'All balloons for accepted submissions have already been marked as delivered.',
    noDeliveredTitle: 'No delivered balloons registered',
    noDeliveredSearch: 'No results found in the delivered list.',
    noDeliveredAll:
      'Balloons marked as delivered will appear here for record-keeping and the option to undo.',
    markDelivered: 'Mark as delivered',
    undoDelivery: 'Undo delivery',
    deliveredSuccess: 'Successfully delivered',
    tries: (n) => `${n} ${n === 1 ? 'attempt' : 'attempts'}`,
    confirmReset:
      'Are you sure you want to clear the entire balloon delivery history? This action will reset the list for all solved problems.',
  },
  footer: {
    credit: 'Application developed by',
    partner: 'in partnership with',
    repo: 'Repository',
  },
  head: {
    title: 'Scoreboard',
  },
}
