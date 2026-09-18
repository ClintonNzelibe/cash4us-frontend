import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import AdminLayout from '../admin/layouts/AdminLayout'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
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

import AdminDashboardPage from '../pages/admin/dashboard/AdminDashboardPage'
import AdminMembersPage from '../pages/admin/members/AdminMembersPage'
import AdminMemberDetailsPage from '../pages/admin/members/AdminMemberDetailsPage'
import AdminPackagesPage from '../pages/admin/packages/AdminPackagesPage'
import AdminPackageDetailsPage from '../pages/admin/packages/AdminPackageDetailsPage'
import AdminPackageCreatePage from '../pages/admin/packages/AdminPackageCreatePage'
import AdminPaymentsPage from '../pages/admin/payments/AdminPaymentsPage'
import AdminPaymentDetailsPage from '../pages/admin/payments/AdminPaymentDetailsPage'
import AdminWithdrawalsPage from '../pages/admin/withdrawals/AdminWithdrawalsPage'
import AdminWithdrawalDetailsPage from '../pages/admin/withdrawals/AdminWithdrawalDetailsPage'
import AdminTasksPage from '../pages/admin/tasks/AdminTasksPage'
import AdminTaskDetailsPage from '../pages/admin/tasks/AdminTaskDetailsPage'
import AdminTaskCreatePage from '../pages/admin/tasks/AdminTaskCreatePage'
import AdminTaskEditPage from '../pages/admin/tasks/AdminTaskEditPage'
import AdminWalletsPage from '../pages/admin/wallets/AdminWalletsPage'
import AdminWalletDetailsPage from '../pages/admin/wallets/AdminWalletDetailsPage'
import AdminTransactionsPage from '../pages/admin/transactions/AdminTransactionsPage'
import AdminTransactionDetailsPage from '../pages/admin/transactions/AdminTransactionDetailsPage'
import AdminReferralsPage from '../pages/admin/referrals/AdminReferralsPage'
import AdminReferralDetailsPage from '../pages/admin/referrals/AdminReferralDetailsPage'
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

function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

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

  if (isLoading) return null

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

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Member Portal */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/packages" element={<PackagesPage />} />

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

        <Route path="/wallet" element={<WalletPage />} />

        <Route
          path="/transactions"
          element={<TransactionsPage />}
        />

        <Route
          path="/referrals"
          element={<ReferralsPage />}
        />

        <Route path="/tasks" element={<TasksPage />} />

        <Route
          path="/withdrawals"
          element={<WithdrawalsPage />}
        />

        <Route
          path="/notifications"
          element={<NotificationsPage />}
        />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/support" element={<SupportPage />} />

        <Route
          path="/resources"
          element={<ResourcesPage />}
        />

        <Route
          path="/partners"
          element={<PartnersPage />}
        />
      </Route>

      {/* Admin Portal */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route
          path="/admin"
          element={<AdminDashboardPage />}
        />
        <Route
          path="/admin/members"
          element={<AdminMembersPage />}
        />
        <Route
          path="/admin/members/:id"
          element={<AdminMemberDetailsPage />}
        />
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
        <Route
          path="/admin/payments"
          element={<AdminPaymentsPage />}
        />

        <Route
          path="/admin/payments/:id"
          element={<AdminPaymentDetailsPage />}
        />
        <Route
          path="/admin/withdrawals"
          element={<AdminWithdrawalsPage />}
        />

        <Route
          path="/admin/withdrawals/:id"
          element={<AdminWithdrawalDetailsPage />}
        />
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
        path="/admin/wallets"
        element={<AdminWalletsPage />}
      />

      <Route
        path="/admin/wallets/:id"
        element={<AdminWalletDetailsPage />}
      />
      <Route
        path="/admin/transactions"
        element={<AdminTransactionsPage />}
      />

      <Route
        path="/admin/transactions/:id"
        element={<AdminTransactionDetailsPage />}
      />
      <Route
        path="/admin/referrals"
        element={<AdminReferralsPage />}
      />

      <Route
        path="/admin/referrals/:id"
        element={<AdminReferralDetailsPage />}
      />
        {/* =========================
            REWARDS
        ========================== */}

        <Route
          path="/admin/rewards"
          element={
            <Navigate
              to="/admin/rewards/points/accounts"
              replace
            />
          }
        />

        {/* Point Accounts */}
        <Route
          path="/admin/rewards/points/accounts"
          element={<AdminPointAccountsPage />}
        />

        <Route
          path="/admin/rewards/points/accounts/:id"
          element={<AdminPointAccountDetailsPage />}
        />

        {/* Point Transactions */}
        <Route
          path="/admin/rewards/points/transactions"
          element={<AdminPointTransactionsPage />}
        />

        <Route
          path="/admin/rewards/points/transactions/:id"
          element={<AdminPointTransactionDetailsPage />}
        />

        {/* Leaderboard */}
        <Route
          path="/admin/rewards/leaderboard"
          element={<AdminLeaderboardPage />}
        />

        {/* Awards */}
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

        {/* User Awards */}
        <Route
          path="/admin/rewards/user-awards"
          element={<AdminUserAwardsPage />}
        />

        <Route
          path="/admin/rewards/user-awards/:id"
          element={<AdminUserAwardDetailsPage />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}