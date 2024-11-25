import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
  
    if (newTask.trim() === '') {
      alert('Введите текст задачи!');
      return;
    }
  
    const newTodo = {
      title: newTask,
      completed: false,
    };
  
    fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при добавлении задачи');
        }
        return response.json();
      })
      .then((data) => {
        setTodos((prevTodos) => [...prevTodos, data]); // Обновляем список задач
        setNewTask(''); // Очищаем поле ввода
      })
      .catch((error) => {
        console.error('Ошибка при добавлении задачи:', error);
      });
  };
  

  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Ошибка загрузки задач:', error));
  }, []);

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTodos = isSorted
    ? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
    : filteredTodos;

  return (
    <div>
      <h1>Список задач</h1>
      <form onSubmit={handleAddTask}>
        <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Введите задачу"
        />
        <button type="submit">Добавить</button>
      </form>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск задач"
        />
        <button onClick={() => setIsSorted((prev) => !prev)}>
          {isSorted ? 'Отключить сортировку' : 'Сортировать по алфавиту'}
        </button>
      </div>
      <ul>
        {sortedTodos.map((todo) => (
          <li key={todo.id}>
            <Link to={`/task/${todo.id}`}>
              {todo.title.length > 50
                ? `${todo.title.slice(0, 50)}...`
                : todo.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
