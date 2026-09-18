export type TaskPlatform =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'WHATSAPP'
  | 'TIKTOK'
  | 'TELEGRAM'
  | 'X'
  | 'YOUTUBE'
  | 'OTHER'

export type TaskSubmissionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'

export type TaskProofType =
  | 'SCREENSHOT'
  | 'POST_URL'
  | 'OTHER'

export type AIResult =
  | 'HIGH_CONFIDENCE'
  | 'MEDIUM_CONFIDENCE'
  | 'SUSPICIOUS'
  | ''

export interface AdminDailyTask {
  id: string
  title: string
  description: string
  reward: string | number
  points: number
  platform: TaskPlatform
  required_platforms: TaskPlatform[]
  flyer: string | null
  video: string | null
  external_link: string
  advertisement_text: string
  promotional_link: string
  sharing_instructions: string
  is_active: boolean
  start_date: string
  end_date: string
  deadline: string | null
  assigned_at: string
  created_at: string
  updated_at: string
  submission_count: number
}

export interface AdminTaskListResponse {
  count: number
  next: string | null
  previous: string | null
  results: AdminDailyTask[]
}

export interface AdminTaskMember {
  id: string
  email: string
  username: string
  membership_code: string
}

export interface AdminTaskSubmissionTask {
  id: string
  title: string
  reward: string | number
  points: number
}

export interface AdminTaskSubmission {
  id: string
  member: AdminTaskMember
  task: AdminTaskSubmissionTask
  proof_type: TaskProofType
  proof_image: string | null
  proof_url: string
  proof_details: string
  status: TaskSubmissionStatus

  // These names follow the admin serializer.
  ai_confidence: string | number | null
  ai_result: AIResult

  requires_admin_review: boolean
  risk_check_passed: boolean | null
  risk_checked_at: string | null

  earning_processed: boolean
  earning_processed_at: string | null

  admin_comment: string
  submitted_at: string
  reviewed_at: string | null
  reviewed_by_email: string | null
}

export interface AdminTaskSubmissionListResponse {
  count: number
  next: string | null
  previous: string | null
  results: AdminTaskSubmission[]
}

export interface AdminTaskActionResponse {
  message: string
  task?: AdminDailyTask
}

export interface AdminSubmissionActionResponse {
  message: string
  submission: AdminTaskSubmission
}

export interface AdminTaskStatusResponse {
  message: string
  task_id: string
  is_active: boolean
}

export interface TaskFilters {
  search?: string
  is_active?: boolean
}

export interface SubmissionFilters {
  search?: string
  status?: TaskSubmissionStatus
  requires_admin_review?: boolean
}

export interface AdminDailyTaskPayload {
  title: string
  description: string
  reward: string
  points: number
  platform: TaskPlatform
  required_platforms: TaskPlatform[]
  flyer?: File | null
  video?: File | null
  external_link: string
  advertisement_text: string
  promotional_link: string
  sharing_instructions: string
  is_active: boolean
  start_date: string
  end_date: string
  deadline?: string | null
}