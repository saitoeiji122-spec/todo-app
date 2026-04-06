import { TodoFilter, FilterStatus, Priority } from '../types'

interface Props {
  filter: TodoFilter
  onChange: (f: Partial<TodoFilter>) => void
  completedCount: number
  onClearCompleted: () => void
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export function FilterBar({ filter, onChange, completedCount, onClearCompleted }: Props) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">ステータス</span>
        <div className="filter-tabs">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filter-tab${filter.status === opt.value ? ' filter-tab--active' : ''}`}
              onClick={() => onChange({ status: opt.value })}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">優先度</span>
        <div className="filter-tabs">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filter-tab${filter.priority === opt.value ? ' filter-tab--active' : ''}${opt.value !== 'all' ? ` filter-tab--priority-${opt.value}` : ''}`}
              onClick={() => onChange({ priority: opt.value })}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {completedCount > 0 && (
        <button
          className="btn btn--ghost btn--sm clear-btn"
          onClick={onClearCompleted}
          type="button"
        >
          完了済みを削除 ({completedCount})
        </button>
      )}
    </div>
  )
}
