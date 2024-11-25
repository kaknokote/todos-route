import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Страница не найдена</h1>
      <p>
        Вернуться на <Link to="/">главную страницу</Link>.
      </p>
    </div>
  );
};