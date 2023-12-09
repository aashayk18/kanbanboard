// CardList.js
import React from 'react';
import Card from './Card'; // Import the Card component
import './CardList.css'; // Import the associated CSS file for styling

const CardList = ({ title, cards }) => {
  if (!Array.isArray(cards)) {
    console.error('cards is not an array:', cards);
    return null; // Or handle the non-array case as needed
  }

  return (
    <div className="card-list-container">
      <h2 className="list-title">{title}</h2>
      <div className="card-list">
        {cards.map(card => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
