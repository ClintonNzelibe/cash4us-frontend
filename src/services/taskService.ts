import { apiClient } from '../api/client'
import type {
  DailyTask,
  TaskStatistics,
  TaskSubmission,
} from '../types/task'

export interface TaskSubmissionPayload {
  task: string
  proof_type: string
  proof_image?: File
  proof_url?: string
  proof_details?: string
}

export async function getDailyTasks(
  token: string,
): Promise<DailyTask[]> {
  return apiClient<DailyTask[]>('/v1/tasks/', {
    method: 'GET',
    token,
  })
}

export async function getTaskSubmissions(
  token: string,
): Promise<TaskSubmission[]> {
  return apiClient<TaskSubmission[]>('/v1/tasks/submissions/', {
    method: 'GET',
    token,
  })
}

export async function getTaskStatistics(
  token: string,
): Promise<TaskStatistics> {
  return apiClient<TaskStatistics>('/v1/tasks/statistics/', {
    method: 'GET',
    token,
  })
}

export async function submitTaskProof(
  token: string,
  payload: TaskSubmissionPayload,
): Promise<TaskSubmission> {
  const formData = new FormData()

  formData.append('task', payload.task)
  formData.append('proof_type', payload.proof_type)

  if (payload.proof_image) {
    formData.append('proof_image', payload.proof_image)
  }

  if (payload.proof_url) {
    formData.append('proof_url', payload.proof_url)
  }

  if (payload.proof_details) {
    formData.append('proof_details', payload.proof_details)
  }

  const response = await fetch(
    'http://127.0.0.1:8000/api/v1/tasks/submissions/create/',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  const contentType = response.headers.get('content-type')
  const data = contentType?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        Object.values(data || {})
          .flat()
          .join(' ') ||
        `Request failed with status ${response.status}`,
    )
  }

  return data as TaskSubmission
}