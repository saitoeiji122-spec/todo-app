import { useState, FormEvent } from 'react'
import { Priority } from '../types'

interface Props {
  onAdd: (
    title: string,
    description: string,
    priority: Priority,
    dueDate: string | null
  ) => void
}

export function TodoForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title, description, priority, dueDate || null)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button className="add-btn" onClick={() => setOpen(true)}>
        <span className="add-btn__icon">+</span>
        タスクを追加
      </button>
    )
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        placeholder="タスクのタイトル *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        required
      />
      <textarea
        className="input textarea"
        placeholder="説明（任意）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <div className="todo-form__row">
        <div className="field-group">
          <label className="label">優先度</label>
          <div className="priority-selector">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`priority-btn priority-btn--${p}${priority === p ? ' priority-btn--active' : ''}`}
                onClick={() => setPriority(p)}
              >
                {p === 'low' ? '低' : p === 'medium' ? '中' : '高'}
              </button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <label className="label" htmlFor="due-date">
            期限
          </label>
          <input
            id="due-date"
            className="input input--date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <div className="todo-form__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setOpen(false)}
        >
          キャンセル
        </button>
        <button type="submit" className="btn btn--primary" disabled={!title.trim()}>
          追加
        </button>
      </div>
    </form>
  )
}
