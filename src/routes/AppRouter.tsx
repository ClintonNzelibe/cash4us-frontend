import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import AppLayout from '../components/layout/AppLayout'
import AdminLayout from '../admin/layouts/AdminLayout'

// Auth
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Member Portal
import DashboardPage from '../pages/dashboard/DashboardPage'
import PackagesPage from '../pages/packages/PackagesPage'
import PackageDetailsPage from '../pages/packages/PackageDetailsPage'
import MyPackagesPage from '../pages/packages/MyPackagesPage'
import PaymentPage from '../pages/payments/PaymentPage'
import WalletPage from '../pages/wallet/WalletPage'
import TransactionsPage from '../pages/transactions/TransactionsPage'
import ReferralsPage from '../pages/referrals/ReferralsPage'
import TasksPage from '../pages/tasks/TasksPage'
import WithdrawalsPage from '../pages/withdrawals/WithdrawalsPage'
import NotificationsPage from '../pages/notifications/NotificationsPage'
import ProfilePage from '../pages/profile/ProfilePage'
import SupportPage from '../pages/support/SupportPage'
import ResourcesPage from '../pages/resources/ResourcesPage'
import PartnersPage from '../pages/partners/PartnersPage'

// Admin Dashboard
import AdminDashboardPage from '../pages/admin/dashboard/AdminDashboardPage'

// Admin Members
import AdminMembersPage from '../pages/admin/members/AdminMembersPage'
import AdminMemberDetailsPage from '../pages/admin/members/AdminMemberDetailsPage'

// Admin Packages
import AdminPackagesPage from '../pages/admin/packages/AdminPackagesPage'
import AdminPackageDetailsPage from '../pages/admin/packages/AdminPackageDetailsPage'
import AdminPackageCreatePage from '../pages/admin/packages/AdminPackageCreatePage'

// Admin Payments
import AdminPaymentsPage from '../pages/admin/payments/AdminPaymentsPage'
import AdminPaymentDetailsPage from '../pages/admin/payments/AdminPaymentDetailsPage'

// Admin Withdrawals
import AdminWithdrawalsPage from '../pages/admin/withdrawals/AdminWithdrawalsPage'
import AdminWithdrawalDetailsPage from '../pages/admin/withdrawals/AdminWithdrawalDetailsPage'

// Admin Tasks
import AdminTasksPage from '../pages/admin/tasks/AdminTasksPage'
import AdminTaskDetailsPage from '../pages/admin/tasks/AdminTaskDetailsPage'
import AdminTaskCreatePage from '../pages/admin/tasks/AdminTaskCreatePage'
import AdminTaskEditPage from '../pages/admin/tasks/AdminTaskEditPage'

// Admin Wallets
import AdminWalletsPage from '../pages/admin/wallets/AdminWalletsPage'
import AdminWalletDetailsPage from '../pages/admin/wallets/AdminWalletDetailsPage'

// Admin Transactions
import AdminTransactionsPage from '../pages/admin/transactions/AdminTransactionsPage'
import AdminTransactionDetailsPage from '../pages/admin/transactions/AdminTransactionDetailsPage'

// Admin Referrals
import AdminReferralsPage from '../pages/admin/referrals/AdminReferralsPage'
import AdminReferralDetailsPage from '../pages/admin/referrals/AdminReferralDetailsPage'

// Admin Rewards
import AdminPointAccountsPage from '../pages/admin/rewards/AdminPointAccountsPage'
import AdminPointAccountDetailsPage from '../pages/admin/rewards/AdminPointAccountDetailsPage'
import AdminPointTransactionsPage from '../pages/admin/rewards/AdminPointTransactionsPage'
import AdminPointTransactionDetailsPage from '../pages/admin/rewards/AdminPointTransactionDetailsPage'
import AdminLeaderboardPage from '../pages/admin/rewards/AdminLeaderboardPage'
import AdminAwardsPage from '../pages/admin/rewards/AdminAwardsPage'
import AdminAwardDetailsPage from '../pages/admin/rewards/AdminAwardDetailsPage'
import AdminAwardCreatePage from '../pages/admin/rewards/AdminAwardCreatePage'
import AdminAwardEditPage from '../pages/admin/rewards/AdminAwardEditPage'
import AdminUserAwardsPage from '../pages/admin/rewards/AdminUserAwardsPage'
import AdminUserAwardDetailsPage from '../pages/admin/rewards/AdminUserAwardDetailsPage'

// Admin Advertising
import AdminAdvertisersPage from '../pages/admin/advertising/AdminAdvertisersPage'
import AdminAdvertiserCreatePage from '../pages/admin/advertising/AdminAdvertiserCreatePage'
import AdminAdvertiserDetailsPage from '../pages/admin/advertising/AdminAdvertiserDetailsPage'
import AdminAdvertiserEditPage from '../pages/admin/advertising/AdminAdvertiserEditPage'
import AdminCampaignsPage from '../pages/admin/advertising/AdminCampaignsPage'
import AdminCampaignCreatePage from '../pages/admin/advertising/AdminCampaignCreatePage'
import AdminCampaignDetailsPage from '../pages/admin/advertising/AdminCampaignDetailsPage'
import AdminCampaignEditPage from '../pages/admin/advertising/AdminCampaignEditPage'
import AdminAdvertisingRevenuePage from '../pages/admin/advertising/AdminAdvertisingRevenuePage'
import AdminAdvertisingRevenueCreatePage from '../pages/admin/advertising/AdminAdvertisingRevenueCreatePage'
import AdminAdvertisingRevenueDetailsPage from '../pages/admin/advertising/AdminAdvertisingRevenueDetailsPage'

// Admin Community
import AdminCommunityPoolsPage from '../pages/admin/community/AdminCommunityPoolsPage'
import AdminCommunityPoolDetailsPage from '../pages/admin/community/AdminCommunityPoolDetailsPage'
import AdminCommunityPoolCreatePage from '../pages/admin/community/AdminCommunityPoolCreatePage'

// Admin Support
import AdminSupportTicketsPage from '../pages/admin/support/AdminSupportTicketsPage'
import AdminSupportTicketDetailsPage from '../pages/admin/support/AdminSupportTicketDetailsPage'

// Admin Resources
import AdminResourcesPage from '../pages/admin/resources/AdminResourcesPage'
import AdminResourceDetailsPage from '../pages/admin/resources/AdminResourceDetailsPage'
import AdminResourceCreatePage from '../pages/admin/resources/AdminResourceCreatePage'
import AdminResourceEditPage from '../pages/admin/resources/AdminResourceEditPage'

// Admin Partners
import AdminPartnersPage from '../pages/admin/partners/AdminPartnersPage'
import AdminPartnerDetailsPage from '../pages/admin/partners/AdminPartnerDetailsPage'
import AdminPartnerCreatePage from '../pages/admin/partners/AdminPartnerCreatePage'
import AdminPartnerEditPage from '../pages/admin/partners/AdminPartnerEditPage'

// Admin Notifications
import AdminNotificationsPage from '../pages/admin/notifications/AdminNotificationsPage'
import AdminNotificationDetailsPage from '../pages/admin/notifications/AdminNotificationDetailsPage'
import AdminNotificationSendPage from '../pages/admin/notifications/AdminNotificationSendPage'

// Admin Audit
import AdminAuditLogsPage from '../pages/admin/audit/AdminAuditLogsPage'
import AdminAuditLogDetailsPage from '../pages/admin/audit/AdminAuditLogDetailsPage'


function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  return (
    <Navigate
      to={isAuthenticated ? '/dashboard' : '/login'}
      replace
    />
  )
}


function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}


function AdminRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}


export default function AppRouter() {
  return (
    <Routes>
      {/* =====================================================
          ROOT / AUTH
      ====================================================== */}

      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />


      {/* =====================================================
          MEMBER PORTAL
      ====================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/packages"
          element={<PackagesPage />}
        />

        <Route
          path="/packages/my"
          element={<MyPackagesPage />}
        />

        <Route
          path="/packages/:slug"
          element={<PackageDetailsPage />}
        />

        <Route
          path="/packages/:slug/payment"
          element={<PaymentPage />}
        />

        <Route
          path="/wallet"
          element={<WalletPage />}
        />

        <Route
          path="/transactions"
          element={<TransactionsPage />}
        />

        <Route
          path="/referrals"
          element={<ReferralsPage />}
        />

        <Route
          path="/tasks"
          element={<TasksPage />}
        />

        <Route
          path="/withdrawals"
          element={<WithdrawalsPage />}
        />

        <Route
          path="/notifications"
          element={<NotificationsPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/support"
          element={<SupportPage />}
        />

        <Route
          path="/resources"
          element={<ResourcesPage />}
        />

        <Route
          path="/partners"
          element={<PartnersPage />}
        />
      </Route>


      {/* =====================================================
          ADMIN PORTAL
      ====================================================== */}

      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >

        {/* Dashboard */}
        <Route
          path="/admin"
          element={<AdminDashboardPage />}
        />


        {/* -------------------------------------------------
            MEMBERS
        -------------------------------------------------- */}

        <Route
          path="/admin/members"
          element={<AdminMembersPage />}
        />

        <Route
          path="/admin/members/:id"
          element={<AdminMemberDetailsPage />}
        />


        {/* -------------------------------------------------
            PACKAGES
        -------------------------------------------------- */}

        <Route
          path="/admin/packages"
          element={<AdminPackagesPage />}
        />

        <Route
          path="/admin/packages/new"
          element={<AdminPackageCreatePage />}
        />

        <Route
          path="/admin/packages/:id"
          element={<AdminPackageDetailsPage />}
        />

        <Route
          path="/admin/packages/:id/edit"
          element={<AdminPackageDetailsPage />}
        />


        {/* -------------------------------------------------
            PAYMENTS
        -------------------------------------------------- */}

        <Route
          path="/admin/payments"
          element={<AdminPaymentsPage />}
        />

        <Route
          path="/admin/payments/:id"
          element={<AdminPaymentDetailsPage />}
        />


        {/* -------------------------------------------------
            WITHDRAWALS
        -------------------------------------------------- */}

        <Route
          path="/admin/withdrawals"
          element={<AdminWithdrawalsPage />}
        />

        <Route
          path="/admin/withdrawals/:id"
          element={<AdminWithdrawalDetailsPage />}
        />


        {/* -------------------------------------------------
            TASKS
        -------------------------------------------------- */}

        <Route
          path="/admin/tasks"
          element={<AdminTasksPage />}
        />

        <Route
          path="/admin/tasks/new"
          element={<AdminTaskCreatePage />}
        />

        <Route
          path="/admin/tasks/:id"
          element={<AdminTaskDetailsPage />}
        />

        <Route
          path="/admin/tasks/:id/edit"
          element={<AdminTaskEditPage />}
        />


        {/* -------------------------------------------------
            WALLETS
        -------------------------------------------------- */}

        <Route
          path="/admin/wallets"
          element={<AdminWalletsPage />}
        />

        <Route
          path="/admin/wallets/:id"
          element={<AdminWalletDetailsPage />}
        />


        {/* -------------------------------------------------
            TRANSACTIONS
        -------------------------------------------------- */}

        <Route
          path="/admin/transactions"
          element={<AdminTransactionsPage />}
        />

        <Route
          path="/admin/transactions/:id"
          element={<AdminTransactionDetailsPage />}
        />


        {/* -------------------------------------------------
            REFERRALS
        -------------------------------------------------- */}

        <Route
          path="/admin/referrals"
          element={<AdminReferralsPage />}
        />

        <Route
          path="/admin/referrals/:id"
          element={<AdminReferralDetailsPage />}
        />


        {/* =================================================
            REWARDS
        ================================================== */}

        <Route
          path="/admin/rewards"
          element={
            <Navigate
              to="/admin/rewards/points/accounts"
              replace
            />
          }
        />

        <Route
          path="/admin/rewards/points/accounts"
          element={<AdminPointAccountsPage />}
        />

        <Route
          path="/admin/rewards/points/accounts/:id"
          element={<AdminPointAccountDetailsPage />}
        />

        <Route
          path="/admin/rewards/points/transactions"
          element={<AdminPointTransactionsPage />}
        />

        <Route
          path="/admin/rewards/points/transactions/:id"
          element={<AdminPointTransactionDetailsPage />}
        />

        <Route
          path="/admin/rewards/leaderboard"
          element={<AdminLeaderboardPage />}
        />

        <Route
          path="/admin/rewards/awards"
          element={<AdminAwardsPage />}
        />

        <Route
          path="/admin/rewards/awards/create"
          element={<AdminAwardCreatePage />}
        />

        <Route
          path="/admin/rewards/awards/:id"
          element={<AdminAwardDetailsPage />}
        />

        <Route
          path="/admin/rewards/awards/:id/edit"
          element={<AdminAwardEditPage />}
        />

        <Route
          path="/admin/rewards/user-awards"
          element={<AdminUserAwardsPage />}
        />

        <Route
          path="/admin/rewards/user-awards/:id"
          element={<AdminUserAwardDetailsPage />}
        />


        {/* =================================================
            ADVERTISING
        ================================================== */}

        <Route
          path="/admin/advertising"
          element={
            <Navigate
              to="/admin/advertising/advertisers"
              replace
            />
          }
        />

        <Route
          path="/admin/advertising/advertisers"
          element={<AdminAdvertisersPage />}
        />

        <Route
          path="/admin/advertising/advertisers/create"
          element={<AdminAdvertiserCreatePage />}
        />

        <Route
          path="/admin/advertising/advertisers/:id"
          element={<AdminAdvertiserDetailsPage />}
        />

        <Route
          path="/admin/advertising/advertisers/:id/edit"
          element={<AdminAdvertiserEditPage />}
        />

        <Route
          path="/admin/advertising/campaigns"
          element={<AdminCampaignsPage />}
        />

        <Route
          path="/admin/advertising/campaigns/create"
          element={<AdminCampaignCreatePage />}
        />

        <Route
          path="/admin/advertising/campaigns/:id"
          element={<AdminCampaignDetailsPage />}
        />

        <Route
          path="/admin/advertising/campaigns/:id/edit"
          element={<AdminCampaignEditPage />}
        />

        <Route
          path="/admin/advertising/revenue"
          element={<AdminAdvertisingRevenuePage />}
        />

        <Route
          path="/admin/advertising/revenue/create"
          element={<AdminAdvertisingRevenueCreatePage />}
        />

        <Route
          path="/admin/advertising/revenue/:id"
          element={<AdminAdvertisingRevenueDetailsPage />}
        />


        {/* =================================================
            COMMUNITY
        ================================================== */}

        <Route
          path="/admin/community"
          element={
            <Navigate
              to="/admin/community/pools"
              replace
            />
          }
        />

        <Route
          path="/admin/community/pools"
          element={<AdminCommunityPoolsPage />}
        />

        <Route
          path="/admin/community/pools/create"
          element={<AdminCommunityPoolCreatePage />}
        />

        <Route
          path="/admin/community/pools/:id"
          element={<AdminCommunityPoolDetailsPage />}
        />


        {/* =================================================
            SUPPORT
        ================================================== */}

        <Route
          path="/admin/support"
          element={
            <Navigate
              to="/admin/support/tickets"
              replace
            />
          }
        />

        <Route
          path="/admin/support/tickets"
          element={<AdminSupportTicketsPage />}
        />

        <Route
          path="/admin/support/tickets/:id"
          element={<AdminSupportTicketDetailsPage />}
        />


        {/* =================================================
            RESOURCES
        ================================================== */}

        <Route
          path="/admin/resources"
          element={<AdminResourcesPage />}
        />

        <Route
          path="/admin/resources/create"
          element={<AdminResourceCreatePage />}
        />

        <Route
          path="/admin/resources/:id/edit"
          element={<AdminResourceEditPage />}
        />

        <Route
          path="/admin/resources/:id"
          element={<AdminResourceDetailsPage />}
        />


        {/* =================================================
            PARTNERS
        ================================================== */}

        <Route
          path="/admin/partners"
          element={<AdminPartnersPage />}
        />

        <Route
          path="/admin/partners/create"
          element={<AdminPartnerCreatePage />}
        />

        <Route
          path="/admin/partners/:id/edit"
          element={<AdminPartnerEditPage />}
        />

        <Route
          path="/admin/partners/:id"
          element={<AdminPartnerDetailsPage />}
        />


        {/* =================================================
            NOTIFICATIONS
        ================================================== */}

        <Route
          path="/admin/notifications"
          element={<AdminNotificationsPage />}
        />

        <Route
          path="/admin/notifications/send"
          element={<AdminNotificationSendPage />}
        />

        <Route
          path="/admin/notifications/:id"
          element={<AdminNotificationDetailsPage />}
        />


        {/* =================================================
            AUDIT LOGS
        ================================================== */}

        <Route
          path="/admin/audit"
          element={<AdminAuditLogsPage />}
        />

        <Route
          path="/admin/audit/:id"
          element={<AdminAuditLogDetailsPage />}
        />
      </Route>


      {/* =====================================================
          FALLBACK
      ====================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}