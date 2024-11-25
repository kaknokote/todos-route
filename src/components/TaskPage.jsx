import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/todos/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTask(data);
        setEditText(data.title);
      })
      .catch((error) => console.error('Ошибка загрузки задачи:', error));
  }, [id]);

  const handleEdit = () => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...task, title: editText }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTask(data);
        alert('Задача обновлена!');
      })
      .catch((error) => console.error('Ошибка редактирования задачи:', error));
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        alert('Задача удалена!');
        navigate('/');
      })
      .catch((error) => console.error('Ошибка удаления задачи:', error));
  };

  if (!task) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>Назад</button>
      <h1>Задача</h1>
      <p>{task.title}</p>
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
      />
      <button onClick={handleEdit}>Сохранить</button>
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
};

export default TaskPage;
