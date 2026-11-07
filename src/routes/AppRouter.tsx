import { lazy, Suspense } from 'react'
import PageLoader from '../components/ui/PageLoader'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../context/useAuth'

import AppLayout from '../components/layout/AppLayout'
import AdminLayout from '../admin/layouts/AdminLayout'

// Auth
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import LandingPage from '../pages/landing/LandingPage'

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
import CommunityPage from '../pages/community/CommunityPage'

// Admin Dashboard

// Admin Members

// Admin Packages

// Admin Payments

// Admin Withdrawals

// Admin Tasks

// Admin Wallets

// Admin Transactions

// Admin Referrals

// Admin Rewards

// Admin Advertising

// Admin Community

// Admin Support

// Admin Resources

// Admin Partners

// Admin Notifications

// Admin Audit


const AdminDashboardPage = lazy(() => import('../pages/admin/dashboard/AdminDashboardPage'))
const AdminMembersPage = lazy(() => import('../pages/admin/members/AdminMembersPage'))
const AdminMemberDetailsPage = lazy(() => import('../pages/admin/members/AdminMemberDetailsPage'))
const AdminPackagesPage = lazy(() => import('../pages/admin/packages/AdminPackagesPage'))
const AdminPackageDetailsPage = lazy(() => import('../pages/admin/packages/AdminPackageDetailsPage'))
const AdminPackageCreatePage = lazy(() => import('../pages/admin/packages/AdminPackageCreatePage'))
const AdminPaymentsPage = lazy(() => import('../pages/admin/payments/AdminPaymentsPage'))
const AdminPaymentDetailsPage = lazy(() => import('../pages/admin/payments/AdminPaymentDetailsPage'))
const AdminWithdrawalsPage = lazy(() => import('../pages/admin/withdrawals/AdminWithdrawalsPage'))
const AdminWithdrawalDetailsPage = lazy(() => import('../pages/admin/withdrawals/AdminWithdrawalDetailsPage'))
const AdminTasksPage = lazy(() => import('../pages/admin/tasks/AdminTasksPage'))
const AdminTaskDetailsPage = lazy(() => import('../pages/admin/tasks/AdminTaskDetailsPage'))
const AdminTaskSubmissionDetailsPage = lazy(() => import('../pages/admin/tasks/AdminTaskSubmissionDetailsPage'))
const AdminTaskCreatePage = lazy(() => import('../pages/admin/tasks/AdminTaskCreatePage'))
const AdminTaskEditPage = lazy(() => import('../pages/admin/tasks/AdminTaskEditPage'))
const AdminWalletsPage = lazy(() => import('../pages/admin/wallets/AdminWalletsPage'))
const AdminWalletDetailsPage = lazy(() => import('../pages/admin/wallets/AdminWalletDetailsPage'))
const AdminTransactionsPage = lazy(() => import('../pages/admin/transactions/AdminTransactionsPage'))
const AdminTransactionDetailsPage = lazy(() => import('../pages/admin/transactions/AdminTransactionDetailsPage'))
const AdminReferralsPage = lazy(() => import('../pages/admin/referrals/AdminReferralsPage'))
const AdminReferralDetailsPage = lazy(() => import('../pages/admin/referrals/AdminReferralDetailsPage'))
const AdminPointAccountsPage = lazy(() => import('../pages/admin/rewards/AdminPointAccountsPage'))
const AdminPointAccountDetailsPage = lazy(() => import('../pages/admin/rewards/AdminPointAccountDetailsPage'))
const AdminPointTransactionsPage = lazy(() => import('../pages/admin/rewards/AdminPointTransactionsPage'))
const AdminPointTransactionDetailsPage = lazy(() => import('../pages/admin/rewards/AdminPointTransactionDetailsPage'))
const AdminLeaderboardPage = lazy(() => import('../pages/admin/rewards/AdminLeaderboardPage'))
const AdminAwardsPage = lazy(() => import('../pages/admin/rewards/AdminAwardsPage'))
const AdminAwardDetailsPage = lazy(() => import('../pages/admin/rewards/AdminAwardDetailsPage'))
const AdminAwardCreatePage = lazy(() => import('../pages/admin/rewards/AdminAwardCreatePage'))
const AdminAwardEditPage = lazy(() => import('../pages/admin/rewards/AdminAwardEditPage'))
const AdminUserAwardsPage = lazy(() => import('../pages/admin/rewards/AdminUserAwardsPage'))
const AdminUserAwardDetailsPage = lazy(() => import('../pages/admin/rewards/AdminUserAwardDetailsPage'))
const AdminAdvertisersPage = lazy(() => import('../pages/admin/advertising/AdminAdvertisersPage'))
const AdminAdvertiserCreatePage = lazy(() => import('../pages/admin/advertising/AdminAdvertiserCreatePage'))
const AdminAdvertiserDetailsPage = lazy(() => import('../pages/admin/advertising/AdminAdvertiserDetailsPage'))
const AdminAdvertiserEditPage = lazy(() => import('../pages/admin/advertising/AdminAdvertiserEditPage'))
const AdminCampaignsPage = lazy(() => import('../pages/admin/advertising/AdminCampaignsPage'))
const AdminCampaignCreatePage = lazy(() => import('../pages/admin/advertising/AdminCampaignCreatePage'))
const AdminCampaignDetailsPage = lazy(() => import('../pages/admin/advertising/AdminCampaignDetailsPage'))
const AdminCampaignEditPage = lazy(() => import('../pages/admin/advertising/AdminCampaignEditPage'))
const AdminAdvertisingRevenuePage = lazy(() => import('../pages/admin/advertising/AdminAdvertisingRevenuePage'))
const AdminAdvertisingRevenueCreatePage = lazy(() => import('../pages/admin/advertising/AdminAdvertisingRevenueCreatePage'))
const AdminAdvertisingRevenueDetailsPage = lazy(() => import('../pages/admin/advertising/AdminAdvertisingRevenueDetailsPage'))
const AdminCommunityPoolsPage = lazy(() => import('../pages/admin/community/AdminCommunityPoolsPage'))
const AdminCommunityPoolDetailsPage = lazy(() => import('../pages/admin/community/AdminCommunityPoolDetailsPage'))
const AdminCommunityPoolCreatePage = lazy(() => import('../pages/admin/community/AdminCommunityPoolCreatePage'))
const AdminSupportTicketsPage = lazy(() => import('../pages/admin/support/AdminSupportTicketsPage'))
const AdminSupportTicketDetailsPage = lazy(() => import('../pages/admin/support/AdminSupportTicketDetailsPage'))
const AdminResourcesPage = lazy(() => import('../pages/admin/resources/AdminResourcesPage'))
const AdminResourceDetailsPage = lazy(() => import('../pages/admin/resources/AdminResourceDetailsPage'))
const AdminResourceCreatePage = lazy(() => import('../pages/admin/resources/AdminResourceCreatePage'))
const AdminResourceEditPage = lazy(() => import('../pages/admin/resources/AdminResourceEditPage'))
const AdminPartnersPage = lazy(() => import('../pages/admin/partners/AdminPartnersPage'))
const AdminPartnerDetailsPage = lazy(() => import('../pages/admin/partners/AdminPartnerDetailsPage'))
const AdminPartnerCreatePage = lazy(() => import('../pages/admin/partners/AdminPartnerCreatePage'))
const AdminPartnerEditPage = lazy(() => import('../pages/admin/partners/AdminPartnerEditPage'))
const AdminNotificationsPage = lazy(() => import('../pages/admin/notifications/AdminNotificationsPage'))
const AdminNotificationDetailsPage = lazy(() => import('../pages/admin/notifications/AdminNotificationDetailsPage'))
const AdminNotificationSendPage = lazy(() => import('../pages/admin/notifications/AdminNotificationSendPage'))
const AdminAuditLogsPage = lazy(() => import('../pages/admin/audit/AdminAuditLogsPage'))
const AdminAuditLogDetailsPage = lazy(() => import('../pages/admin/audit/AdminAuditLogDetailsPage'))

function HomePage() {
  return <LandingPage />
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
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}


export default function AppRouter() {
  return (
    <Routes>
      {/* =====================================================
          ROOT / AUTH
      ====================================================== */}

      <Route path="/" element={<HomePage />} />

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

        <Route
          path="/community"
          element={<CommunityPage />}
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

        <Route
          path="/admin/tasks/submissions/:id"
          element={<AdminTaskSubmissionDetailsPage />}
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
