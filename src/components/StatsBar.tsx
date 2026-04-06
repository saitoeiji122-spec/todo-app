interface Props {
  total: number
  active: number
  completed: number
}

export function StatsBar({ total, active, completed }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="stats-bar">
      <div className="stats-bar__numbers">
        <span className="stat">
          <span className="stat__value">{total}</span>
          <span className="stat__label">合計</span>
        </span>
        <span className="stat-sep" />
        <span className="stat">
          <span className="stat__value stat__value--active">{active}</span>
          <span className="stat__label">未完了</span>
        </span>
        <span className="stat-sep" />
        <span className="stat">
          <span className="stat__value stat__value--done">{completed}</span>
          <span className="stat__label">完了</span>
        </span>
      </div>
      {total > 0 && (
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
          <span className="progress-bar__label">{pct}%</span>
        </div>
      )}
    </div>
  )
}
