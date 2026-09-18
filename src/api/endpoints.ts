export const ADMIN_ENDPOINTS = {
  dashboard: '/admin/dashboard/',

  members: '/admin/members/',
  memberDetail: (id: string) => `/admin/members/${id}/`,
  memberStatus: (id: string) => `/admin/members/${id}/status/`,

  packages: '/admin/packages/',
  packageCreate: '/admin/packages/create/',
  packageDetail: (id: string) => `/admin/packages/${id}/`,
  packageUpdate: (id: string) => `/admin/packages/${id}/update/`,
  packageStatus: (id: string) => `/admin/packages/${id}/status/`,

  packageTenures: (id: string) =>
    `/admin/packages/${id}/tenures/`,

  tenureUpdate: (id: string) =>
    `/admin/packages/tenures/${id}/update/`,

  tenureStatus: (id: string) =>
    `/admin/packages/tenures/${id}/status/`,

  payments: '/admin/payments/',
  paymentDetail: (id: string) => `/admin/payments/${id}/`,
  paymentApprove: (id: string) => `/admin/payments/${id}/approve/`,
  paymentReject: (id: string) => `/admin/payments/${id}/reject/`,

  withdrawals: '/admin/withdrawals/',
  withdrawalDetail: (id: string) => `/admin/withdrawals/${id}/`,
  withdrawalApprove: (id: string) => `/admin/withdrawals/${id}/approve/`,
  withdrawalReject: (id: string) => `/admin/withdrawals/${id}/reject/`,
  withdrawalPaid: (id: string) => `/admin/withdrawals/${id}/paid/`,

  tasks: '/admin/tasks/',
  taskCreate: '/admin/tasks/create/',
  taskDetail: (id: string) => `/admin/tasks/${id}/`,
  taskUpdate: (id: string) => `/admin/tasks/${id}/update/`,
  taskStatus: (id: string) => `/admin/tasks/${id}/status/`,

  taskSubmissions: '/admin/tasks/submissions/',
  taskSubmissionDetail: (id: string) =>
    `/admin/tasks/submissions/${id}/`,
  taskSubmissionApprove: (id: string) =>
    `/admin/tasks/submissions/${id}/approve/`,
  taskSubmissionReject: (id: string) =>
    `/admin/tasks/submissions/${id}/reject/`,

  wallets: '/admin/wallets/',
  walletDetail: (id: string) => `/admin/wallets/${id}/`,

  transactions: '/admin/transactions/',
  transactionDetail: (id: string) =>
    `/admin/transactions/${id}/`,

  referrals: '/admin/referrals/',
  referralDetail: (id: string) =>
    `/admin/referrals/${id}/`,
  // Rewards
  pointAccounts: '/admin/rewards/points/',
  pointAccountDetail: (id: string) =>
    `/admin/rewards/points/${id}/`,

  pointTransactions: '/admin/rewards/point-transactions/',
  pointTransactionDetail: (id: string) =>
    `/admin/rewards/point-transactions/${id}/`,

  leaderboard: '/admin/rewards/leaderboard/',

  awards: '/admin/rewards/awards/',
  awardDetail: (id: string) =>
    `/admin/rewards/awards/${id}/`,
  awardStatus: (id: string) =>
    `/admin/rewards/awards/${id}/status/`,

  userAwards: '/admin/rewards/user-awards/',
  userAwardDetail: (id: string) =>
    `/admin/rewards/user-awards/${id}/`,

  awardUser: '/admin/rewards/awards/award-user/',

  processWeeklyAward:
    '/admin/rewards/awards/process-weekly/',

  advertisers: '/admin/advertising/advertisers/',
  advertiserDetail: (id: string) =>
    `/admin/advertising/advertisers/${id}/`,
  advertiserStatus: (id: string) =>
    `/admin/advertising/advertisers/${id}/status/`,

  campaigns: '/admin/advertising/campaigns/',
  campaignDetail: (id: string) =>
    `/admin/advertising/campaigns/${id}/`,

  advertisingRevenue: '/admin/advertising/revenue/',
  advertisingRevenueDetail: (id: string) =>
    `/admin/advertising/revenue/${id}/`,
  advertisingRevenueConfirm: (id: string) =>
    `/admin/advertising/revenue/${id}/confirm/`,
  advertisingRevenueCancel: (id: string) =>
    `/admin/advertising/revenue/${id}/cancel/`,

  communityPools: '/admin/community/pools/',
  communityPoolDetail: (id: string) =>
    `/admin/community/pools/${id}/`,
  communityAllocate: (id: string) =>
    `/admin/community/pools/${id}/allocate/`,
  communityClose: (id: string) =>
    `/admin/community/pools/${id}/close/`,
  communityDistribute: (id: string) =>
    `/admin/community/pools/${id}/distribute/`,

  supportTickets: '/admin/support/tickets/',
  supportTicketDetail: (id: string) =>
    `/admin/support/tickets/${id}/`,
  supportReply: (id: string) =>
    `/admin/support/tickets/${id}/reply/`,
  supportClose: (id: string) =>
    `/admin/support/tickets/${id}/close/`,

  resources: '/admin/resources/',
  resourceDetail: (id: string) =>
    `/admin/resources/${id}/`,
  resourceStatus: (id: string) =>
    `/admin/resources/${id}/status/`,

  partners: '/admin/partners/',
  partnerDetail: (id: string) =>
    `/admin/partners/${id}/`,
  partnerStatus: (id: string) =>
    `/admin/partners/${id}/status/`,

  auditLogs: '/admin/audit-logs/',
  auditLogDetail: (id: string) =>
    `/admin/audit-logs/${id}/`,

  notifications: '/admin/notifications/',
  notificationDetail: (id: string) =>
    `/admin/notifications/${id}/`,
  sendNotification: '/admin/notifications/send/',
} as const