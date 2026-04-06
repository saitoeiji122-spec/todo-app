import { useState, useCallback, useMemo } from 'react'
import { Todo, Priority, TodoFilter } from '../types'

const STORAGE_KEY = 'todo-app-todos'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

function saveToStorage(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage)
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    priority: 'all',
    searchQuery: '',
  })

  const persist = useCallback((next: Todo[]) => {
    setTodos(next)
    saveToStorage(next)
  }, [])

  const addTodo = useCallback(
    (
      title: string,
      description: string,
      priority: Priority,
      dueDate: string | null
    ) => {
      const todo: Todo = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      persist([todo, ...todos])
    },
    [todos, persist]
  )

  const updateTodo = useCallback(
    (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
      persist(todos.map((t) => (t.id === id ? { ...t, ...changes } : t)))
    },
    [todos, persist]
  )

  const toggleTodo = useCallback(
    (id: string) => {
      persist(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    },
    [todos, persist]
  )

  const deleteTodo = useCallback(
    (id: string) => {
      persist(todos.filter((t) => t.id !== id))
    },
    [todos, persist]
  )

  const clearCompleted = useCallback(() => {
    persist(todos.filter((t) => !t.completed))
  }, [todos, persist])

  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (filter.status === 'active' && t.completed) return false
      if (filter.status === 'completed' && !t.completed) return false
      if (filter.priority !== 'all' && t.priority !== filter.priority)
        return false
      if (
        filter.searchQuery &&
        !t.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
        !t.description.toLowerCase().includes(filter.searchQuery.toLowerCase())
      )
        return false
      return true
    })
  }, [todos, filter])

  const stats = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  )

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    stats,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  }
}
