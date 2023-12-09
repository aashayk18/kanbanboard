import React from 'react';
import './Card.css'; // Import the CSS file for styling

const Card = ({ id, title, tag, userId, status, priority }) => {
  return (
    <div className="card">
      <h3 className="title">{title}</h3>
      <p className="info">ID: {id}</p>
      <p className="info">Tag: {tag}</p>
      <p className="info">User ID: {userId}</p>
      <p className="info">Status: {status}</p>
      <p className="info">Priority: {priority}</p>
      {/* Render other ticket details */}
    </div>
  );
};

export default Card;
