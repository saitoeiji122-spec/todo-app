import { useState, FormEvent } from 'react'
import { Todo, Priority } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

const PRIORITY_LABEL: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDesc, setEditDesc] = useState(todo.description)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '')

  const overdue = isOverdue(todo.dueDate, todo.completed)

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!editTitle.trim()) return
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      dueDate: editDueDate || null,
    })
    setEditing(false)
  }

  const handleEditCancel = () => {
    setEditTitle(todo.title)
    setEditDesc(todo.description)
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate ?? '')
    setEditing(false)
  }

  if (editing) {
    return (
      <form
        className={`todo-item todo-item--editing priority-border--${todo.priority}`}
        onSubmit={handleEditSubmit}
      >
        <input
          className="input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          autoFocus
          required
        />
        <textarea
          className="input textarea"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          rows={2}
          placeholder="説明（任意）"
        />
        <div className="todo-form__row">
          <div className="field-group">
            <label className="label">優先度</label>
            <div className="priority-selector">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`priority-btn priority-btn--${p}${editPriority === p ? ' priority-btn--active' : ''}`}
                  onClick={() => setEditPriority(p)}
                >
                  {p === 'low' ? '低' : p === 'medium' ? '中' : '高'}
                </button>
              ))}
            </div>
          </div>
          <div className="field-group">
            <label className="label">期限</label>
            <input
              className="input input--date"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
          </div>
        </div>
        <div className="todo-form__actions">
          <button type="button" className="btn btn--ghost" onClick={handleEditCancel}>
            キャンセル
          </button>
          <button type="submit" className="btn btn--primary" disabled={!editTitle.trim()}>
            保存
          </button>
        </div>
      </form>
    )
  }

  return (
    <div
      className={`todo-item${todo.completed ? ' todo-item--done' : ''}${overdue ? ' todo-item--overdue' : ''} priority-border--${todo.priority}`}
    >
      <button
        className={`checkbox${todo.completed ? ' checkbox--checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
        type="button"
      >
        {todo.completed && (
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points="2,6 5,9 10,3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="todo-item__body">
        <span className="todo-item__title">{todo.title}</span>
        {todo.description && (
          <span className="todo-item__desc">{todo.description}</span>
        )}
        <div className="todo-item__meta">
          <span className={`priority-badge priority-badge--${todo.priority}`}>
            {PRIORITY_LABEL[todo.priority]}
          </span>
          {todo.dueDate && (
            <span className={`due-date${overdue ? ' due-date--overdue' : ''}`}>
              {overdue ? '期限切れ: ' : '期限: '}
              {formatDate(todo.dueDate)}
            </span>
          )}
          <span className="created-at">{formatDate(todo.createdAt)}</span>
        </div>
      </div>

      <div className="todo-item__actions">
        <button
          className="icon-btn icon-btn--edit"
          onClick={() => setEditing(true)}
          aria-label="編集"
          type="button"
        >
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="icon-btn icon-btn--delete"
          onClick={() => onDelete(todo.id)}
          aria-label="削除"
          type="button"
        >
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 4h10M6 4V3h4v1M5 4v8h6V4H5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
