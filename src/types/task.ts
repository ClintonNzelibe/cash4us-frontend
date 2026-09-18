export type TaskProofType = 'SCREENSHOT' | 'POST_URL' | 'OTHER'

export type TaskSubmissionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'

export interface DailyTask {
  id: string
  title: string
  description: string
  reward: string
  points: number
  platform: string
  required_platforms: string[]
  flyer: string | null
  video: string | null
  external_link: string
  advertisement_text: string
  promotional_link: string
  sharing_instructions: string
  start_date: string
  end_date: string
  deadline: string | null
  assigned_at: string
  is_active: boolean
  created_at: string
}

export interface TaskSubmission {
  id: string
  task: DailyTask
  proof_type: TaskProofType
  proof_image: string | null
  proof_url: string
  proof_details: string
  status: TaskSubmissionStatus
  ai_confidence_score: string | null
  ai_verification_result: string
  requires_admin_review: boolean
  risk_check_passed: boolean | null
  risk_check_completed_at: string | null
  earning_processed: boolean
  earning_processed_at: string | null
  admin_comment: string
  submitted_at: string
  reviewed_at: string | null
}

export interface TaskStatistics {
  tasks_assigned: number
  tasks_completed: number
  tasks_missed: number
  tasks_approved: number
  tasks_rejected: number
  daily_task_streak: number
  overall_completion_rate: number
  minimum_completion_threshold: string
  meets_minimum_completion_threshold: boolean
}