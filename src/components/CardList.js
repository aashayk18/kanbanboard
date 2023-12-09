import React from 'react';
import Card from './Card'; 
import './CardList.css'; 

const CardList = ({ title, cards }) => {
  if (!Array.isArray(cards)) {
    console.error('cards is not an array:', cards);
    return null; 
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
