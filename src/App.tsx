import { useTodos } from './hooks/useTodos'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { FilterBar } from './components/FilterBar'
import { SearchBar } from './components/SearchBar'
import { StatsBar } from './components/StatsBar'

export default function App() {
  const {
    todos,
    filter,
    setFilter,
    stats,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__title">
            <svg className="app-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#grad)" />
              <polyline points="8,17 13,22 24,11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <h1>TODO</h1>
          </div>
          <StatsBar {...stats} />
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchBar
            value={filter.searchQuery}
            onChange={(q) => setFilter({ ...filter, searchQuery: q })}
          />

          <FilterBar
            filter={filter}
            onChange={(changes) => setFilter({ ...filter, ...changes })}
            completedCount={stats.completed}
            onClearCompleted={clearCompleted}
          />

          <TodoForm onAdd={addTodo} />

          <div className="todo-list">
            {todos.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" strokeWidth="2" />
                  <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>
                  {filter.searchQuery || filter.status !== 'all' || filter.priority !== 'all'
                    ? '条件に一致するタスクがありません'
                    : 'タスクを追加してください'}
                </p>
              </div>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
