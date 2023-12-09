import React, { useState } from 'react';
import './Card.css'; 

const Card = ({ id, title, tag, userId, status, priority, variables }) => {
  const [showVariables, setShowVariables] = useState(false);

  const toggleVariables = () => {
    setShowVariables(!showVariables);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="id">{id}</h3>
        <h3 className="title">{title}</h3>
      </div>
      <div className="ellipsis" onClick={toggleVariables}>...</div>
      <div className={`variables ${showVariables ? 'show' : 'hide'}`}>
        <p className="info">Tag: {tag}</p>
        <p className="info">User ID: {userId}</p>
        <p className="info">Status: {status}</p>
        <p className="info">Priority: {priority}</p>
      </div>
    </div>
  );
};

export default Card;
