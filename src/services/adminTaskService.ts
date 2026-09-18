import { apiClient } from '../api/client'
import { ADMIN_ENDPOINTS } from '../api/endpoints'

import type {
  AdminDailyTask,
  AdminDailyTaskPayload,
  AdminTaskActionResponse,
  AdminTaskListResponse,
  AdminTaskStatusResponse,
  AdminTaskSubmission,
  AdminTaskSubmissionListResponse,
  AdminSubmissionActionResponse,
  SubmissionFilters,
  TaskFilters,
} from '../types/admin/tasks'

function buildTaskQuery(params?: TaskFilters) {
  if (!params) return ''

  const query = new URLSearchParams()

  if (params.search?.trim()) {
    query.set('search', params.search.trim())
  }

  if (params.is_active !== undefined) {
    query.set('is_active', String(params.is_active))
  }

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ''
}

function buildSubmissionQuery(params?: SubmissionFilters) {
  if (!params) return ''

  const query = new URLSearchParams()

  if (params.search?.trim()) {
    query.set('search', params.search.trim())
  }

  if (params.status) {
    query.set('status', params.status)
  }

  if (params.requires_admin_review !== undefined) {
    query.set(
      'requires_admin_review',
      String(params.requires_admin_review),
    )
  }

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ''
}

function buildTaskFormData(payload: AdminDailyTaskPayload) {
  const formData = new FormData()

  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('reward', payload.reward)
  formData.append('points', String(payload.points))
  formData.append('platform', payload.platform)

  formData.append(
    'required_platforms',
    JSON.stringify(payload.required_platforms),
  )

  formData.append(
    'external_link',
    payload.external_link,
  )

  formData.append(
    'advertisement_text',
    payload.advertisement_text,
  )

  formData.append(
    'promotional_link',
    payload.promotional_link,
  )

  formData.append(
    'sharing_instructions',
    payload.sharing_instructions,
  )

  formData.append(
    'is_active',
    String(payload.is_active),
  )

  formData.append(
    'start_date',
    payload.start_date,
  )

  formData.append(
    'end_date',
    payload.end_date,
  )

  if (payload.deadline) {
    formData.append('deadline', payload.deadline)
  }

  if (payload.flyer) {
    formData.append('flyer', payload.flyer)
  }

  if (payload.video) {
    formData.append('video', payload.video)
  }

  return formData
}

export function getAdminTasks(
  token: string,
  params?: TaskFilters,
) {
  return apiClient<AdminTaskListResponse>(
    `${ADMIN_ENDPOINTS.tasks}${buildTaskQuery(params)}`,
    {
      token,
    },
  )
}

export function getAdminTask(
  id: string,
  token: string,
) {
  return apiClient<AdminDailyTask>(
    ADMIN_ENDPOINTS.taskDetail(id),
    {
      token,
    },
  )
}

export function createAdminTask(
  payload: AdminDailyTaskPayload,
  token: string,
) {
  return apiClient<AdminDailyTask>(
    ADMIN_ENDPOINTS.taskCreate,
    {
      method: 'POST',
      token,
      body: buildTaskFormData(payload),
    },
  )
}

export function updateAdminTask(
  id: string,
  payload: AdminDailyTaskPayload,
  token: string,
) {
  return apiClient<AdminDailyTask>(
    ADMIN_ENDPOINTS.taskUpdate(id),
    {
      method: 'PATCH',
      token,
      body: buildTaskFormData(payload),
    },
  )
}

export function updateAdminTaskStatus(
  id: string,
  isActive: boolean,
  token: string,
) {
  return apiClient<AdminTaskStatusResponse>(
    ADMIN_ENDPOINTS.taskStatus(id),
    {
      method: 'PATCH',
      token,
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  )
}

export function getAdminTaskSubmissions(
  token: string,
  params?: SubmissionFilters,
) {
  return apiClient<AdminTaskSubmissionListResponse>(
    `${ADMIN_ENDPOINTS.taskSubmissions}${buildSubmissionQuery(params)}`,
    {
      token,
    },
  )
}

export function getAdminTaskSubmission(
  id: string,
  token: string,
) {
  return apiClient<AdminTaskSubmission>(
    ADMIN_ENDPOINTS.taskSubmissionDetail(id),
    {
      token,
    },
  )
}

export function approveAdminTaskSubmission(
  id: string,
  token: string,
  adminComment = '',
) {
  return apiClient<AdminSubmissionActionResponse>(
    ADMIN_ENDPOINTS.taskSubmissionApprove(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        admin_comment: adminComment,
      }),
    },
  )
}

export function rejectAdminTaskSubmission(
  id: string,
  token: string,
  adminComment: string,
) {
  return apiClient<AdminSubmissionActionResponse>(
    ADMIN_ENDPOINTS.taskSubmissionReject(id),
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        admin_comment: adminComment,
      }),
    },
  )
}