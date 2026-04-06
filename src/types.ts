export type Priority = 'low' | 'medium' | 'high'

export type FilterStatus = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string | null
  completed: boolean
  createdAt: string
}

export interface TodoFilter {
  status: FilterStatus
  priority: Priority | 'all'
  searchQuery: string
}
