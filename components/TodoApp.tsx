'use client';

import { useState, useCallback } from 'react';
import styles from './TodoApp.module.css';

type FilterType = 'all' | 'active' | 'completed';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Read a book', completed: true },
    { id: 3, text: 'Go for a walk', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false }
    ]);
    setInputValue('');
  }, [inputValue]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addTodo();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>✅ Todo App</h1>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="New todo input"
        />
        <button className={styles.addBtn} onClick={addTodo} aria-label="Add todo">
          Add
        </button>
      </div>

      <div className={styles.filterRow}>
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className={styles.list}>
        {filteredTodos.length === 0 && (
          <li className={styles.empty}>No todos here!</li>
        )}
        {filteredTodos.map(todo => (
          <li key={todo.id} className={styles.item}>
            <button
              className={`${styles.checkbox} ${todo.completed ? styles.checkboxChecked : ''}`}
              onClick={() => toggleTodo(todo.id)}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.completed ? '✓' : ''}
            </button>
            <span className={`${styles.text} ${todo.completed ? styles.textCompleted : ''}`}>
              {todo.text}
            </span>
            <button
              className={styles.deleteBtn}
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete todo"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <span className={styles.count}>
          {activeCount} item{activeCount !== 1 ? 's' : ''} left
        </span>
        {completedCount > 0 && (
          <button className={styles.clearBtn} onClick={clearCompleted}>
            Clear completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}
