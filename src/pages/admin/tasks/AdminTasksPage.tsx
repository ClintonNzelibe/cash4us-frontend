import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminTaskSubmissions,
  getAdminTasks,
} from '../../../services/adminTaskService'

import type {
  AdminDailyTask,
  AdminTaskSubmission,
  SubmissionFilters,
  TaskFilters,
} from '../../../types/admin/tasks'

import TaskFiltersComponent from './components/TaskFilters'
import SubmissionFiltersComponent from './components/SubmissionFilters'
import TaskStatusBadge from './components/TaskStatusBadge'
import TaskSubmissionStatusBadge from './components/TaskSubmissionStatusBadge'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </Card>
  )
}

export default function AdminTasksPage() {
  const { accessToken } = useAuth()

  const [tasks, setTasks] = useState<AdminDailyTask[]>([])
  const [submissions, setSubmissions] = useState<
    AdminTaskSubmission[]
  >([])

  const [taskFilters, setTaskFilters] =
    useState<TaskFilters>({})

  const [submissionFilters, setSubmissionFilters] =
    useState<SubmissionFilters>({})

  const [loadingTasks, setLoadingTasks] = useState(true)
  const [loadingSubmissions, setLoadingSubmissions] =
    useState(true)

  const [taskError, setTaskError] = useState('')
  const [submissionError, setSubmissionError] =
    useState('')

  useEffect(() => {
    if (!accessToken) {
      setLoadingTasks(false)
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoadingTasks(true)
        setTaskError('')

        const response = await getAdminTasks(
          accessToken,
          taskFilters,
        )

        /*
         * Backend may return either:
         *
         * 1. Paginated:
         *    { count, next, previous, results: [...] }
         *
         * 2. Direct array:
         *    [...]
         *
         * Handle both safely.
         */
        if (Array.isArray(response)) {
          setTasks(response)
        } else {
          setTasks(
            Array.isArray(response?.results)
              ? response.results
              : [],
          )
        }
      } catch (error) {
        setTasks([])

        setTaskError(
          error instanceof Error
            ? error.message
            : 'Failed to load tasks.',
        )
      } finally {
        setLoadingTasks(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, taskFilters])

  useEffect(() => {
    if (!accessToken) {
      setLoadingSubmissions(false)
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoadingSubmissions(true)
        setSubmissionError('')

        const response =
          await getAdminTaskSubmissions(
            accessToken,
            submissionFilters,
          )

        /*
         * Handle both paginated and direct-array
         * responses from the backend.
         */
        if (Array.isArray(response)) {
          setSubmissions(response)
        } else {
          setSubmissions(
            Array.isArray(response?.results)
              ? response.results
              : [],
          )
        }
      } catch (error) {
        setSubmissions([])

        setSubmissionError(
          error instanceof Error
            ? error.message
            : 'Failed to load submissions.',
        )
      } finally {
        setLoadingSubmissions(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, submissionFilters])

  const taskStats = useMemo(() => {
    const taskList = Array.isArray(tasks)
      ? tasks
      : []

    return {
      total: taskList.length,

      active: taskList.filter(
        (task) => task.is_active,
      ).length,

      inactive: taskList.filter(
        (task) => !task.is_active,
      ).length,

      submissions: taskList.reduce(
        (sum, task) =>
          sum + Number(task.submission_count || 0),
        0,
      ),
    }
  }, [tasks])

  const submissionStats = useMemo(() => {
    const submissionList = Array.isArray(
      submissions,
    )
      ? submissions
      : []

    return {
      total: submissionList.length,

      pending: submissionList.filter(
        (item) => item.status === 'PENDING',
      ).length,

      review: submissionList.filter(
        (item) => item.requires_admin_review,
      ).length,

      completed: submissionList.filter(
        (item) => item.status === 'COMPLETED',
      ).length,
    }
  }, [submissions])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage daily promotional tasks and member submissions.
          </p>
        </div>

        <Link to="/admin/tasks/new">
          <Button>
            Create Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Tasks Loaded"
          value={taskStats.total}
        />

        <SummaryCard
          label="Active Tasks"
          value={taskStats.active}
        />

        <SummaryCard
          label="Inactive Tasks"
          value={taskStats.inactive}
        />

        <SummaryCard
          label="Submissions"
          value={taskStats.submissions}
        />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Daily Tasks
          </h2>
        </div>

        <TaskFiltersComponent
          filters={taskFilters}
          onChange={setTaskFilters}
        />

        {taskError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {taskError}
          </div>
        )}

        {loadingTasks ? (
          <PageLoader />
        ) : (
          <Card className="overflow-hidden p-0">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No tasks found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Task
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reward
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Platform
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Submissions
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Created
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <Link
                            to={`/admin/tasks/${task.id}`}
                            className="font-semibold text-slate-900 hover:text-emerald-700"
                          >
                            {task.title}
                          </Link>

                          <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                            {task.description}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {formatCurrency(task.reward)}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {task.platform}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {task.submission_count}
                        </td>

                        <td className="px-5 py-4">
                          <TaskStatusBadge
                            isActive={task.is_active}
                          />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(task.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Task Submissions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review member task submissions and their verification status.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Submissions Loaded"
            value={submissionStats.total}
          />

          <SummaryCard
            label="Pending"
            value={submissionStats.pending}
          />

          <SummaryCard
            label="Needs Review"
            value={submissionStats.review}
          />

          <SummaryCard
            label="Completed"
            value={submissionStats.completed}
          />
        </div>

        <SubmissionFiltersComponent
          filters={submissionFilters}
          onChange={setSubmissionFilters}
        />

        {submissionError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submissionError}
          </div>
        )}

        {loadingSubmissions ? (
          <PageLoader />
        ) : (
          <Card className="overflow-hidden p-0">
            {submissions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No submissions found.
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-left">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Member
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Task
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Proof
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Review
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Submitted
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {submissions.map(
                        (submission) => (
                          <tr
                            key={submission.id}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <Link
                                to={`/admin/tasks/submissions/${submission.id}`}
                                className="font-semibold text-slate-900 hover:text-emerald-700"
                              >
                                {submission.member.username}
                              </Link>

                              <p className="mt-1 text-xs text-slate-500">
                                {submission.member.email}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {submission.member.membership_code}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-slate-800">
                                {submission.task.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {formatCurrency(
                                  submission.task.reward,
                                )}{' '}
                                ·{' '}
                                {submission.task.points}{' '}
                                points
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {submission.proof_type}
                            </td>

                            <td className="px-5 py-4">
                              <TaskSubmissionStatusBadge
                                status={
                                  submission.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4">
                              {submission.requires_admin_review ? (
                                <span className="text-xs font-semibold text-amber-700">
                                  Required
                                </span>
                              ) : (
                                <span className="text-xs text-slate-500">
                                  Not required
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {formatDate(
                                submission.submitted_at,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-slate-100 md:hidden">
                  {submissions.map(
                    (submission) => (
                      <Link
                        key={submission.id}
                        to={`/admin/tasks/submissions/${submission.id}`}
                        className="block p-4 hover:bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {submission.member.username}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {submission.task.title}
                            </p>
                          </div>

                          <TaskSubmissionStatusBadge
                            status={submission.status}
                          />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400">
                              Proof
                            </span>

                            <p className="mt-1 font-medium text-slate-700">
                              {submission.proof_type}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400">
                              Submitted
                            </span>

                            <p className="mt-1 font-medium text-slate-700">
                              {formatDate(
                                submission.submitted_at,
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </>
            )}
          </Card>
        )}
      </section>
    </div>
  )
}