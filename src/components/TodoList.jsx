import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Ошибка загрузки задач:', error));
  }, []);

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
      .then((response) => response.json())
      .then((data) => {
        setTodos((prevTodos) => [...prevTodos, data]);
        setNewTask('');
      })
      .catch((error) => console.error('Ошибка при добавлении задачи:', error));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  const filteredTodos = todos
    .filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (isSorted ? a.title.localeCompare(b.title) : 0));

  return (
    <div>
      <h1>Список дел</h1>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Введите задачу"
        />
        <button type="submit">Добавить</button>
      </form>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Поиск задач"
      />
      <button onClick={toggleSort}>
        {isSorted ? 'Убрать сортировку' : 'Сортировать по алфавиту'}
      </button>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <Link to={`/task/${todo.id}`}>
              {todo.title.length > 50
                ? `${todo.title.substring(0, 50)}...`
                : todo.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
