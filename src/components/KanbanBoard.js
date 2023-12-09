import React, { useState, useEffect } from 'react';
import CardList from './CardList'; 
import './KanbanBoard.css'; 

const KanbanBoard = () => {
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        
        setTickets(data.tickets || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const groupAndSortTickets = () => {
    let organizedTickets = [...tickets];

    if (groupingOption === 'status') {
      
      const statusGroups = {};
      organizedTickets.forEach(ticket => {
        if (!statusGroups[ticket.status]) {
          statusGroups[ticket.status] = [];
        }
        statusGroups[ticket.status].push(ticket);
      });
      
      organizedTickets = Object.values(statusGroups).flat();
    } else if (groupingOption === 'user') {
      
      const userGroups = {};
      organizedTickets.forEach(ticket => {
        if (!userGroups[ticket.userId]) {
          userGroups[ticket.userId] = [];
        }
        userGroups[ticket.userId].push(ticket);
      });

      organizedTickets = Object.values(userGroups).flat();
    } else if (groupingOption === 'priority') {
      
      organizedTickets.sort((a, b) => b.priority - a.priority);
    }

    if (sortBy === 'priority') {
      organizedTickets.sort((a, b) => b.priority - a.priority);
    } else if (sortBy === 'title') {
      organizedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }

    setTickets(organizedTickets);
  };

  useEffect(() => {
    groupAndSortTickets();
  }, [groupingOption, sortBy]);

  const renderColumnsByGroup = () => {
    let columns = [];

    if (groupingOption === 'status') {
      const statusGroups = {};
      tickets.forEach(ticket => {
        if (!statusGroups[ticket.status]) {
          statusGroups[ticket.status] = [];
        }
        statusGroups[ticket.status].push(ticket);
      });

      columns = Object.entries(statusGroups).map(([status, cards]) => (
        <div key={status} className="column">
          <h3>{status}</h3>
          <CardList title={status} cards={cards} />
        </div>
      ));
    } else if (groupingOption === 'user') {
      const userGroups = {};
      tickets.forEach(ticket => {
        if (!userGroups[ticket.userId]) {
          userGroups[ticket.userId] = [];
        }
        userGroups[ticket.userId].push(ticket);
      });

      columns = Object.entries(userGroups).map(([userId, cards]) => (
        <div key={userId} className="column">
          <h3>User {userId}</h3>
          <CardList title={`User ${userId}`} cards={cards} />
        </div>
      ));
    } else if (groupingOption === 'priority') {
      for (let i = 4; i >= 0; i--) {
        const priorityLevel = i === 0 ? 'No Priority' : `Priority ${i}`;
        const priorityCards = tickets.filter(ticket => ticket.priority === i);
        
        if (priorityCards.length > 0) {
          columns.push(
            <div key={priorityLevel} className="column">
              <h3>{priorityLevel}</h3>
              <CardList title={priorityLevel} cards={priorityCards} />
            </div>
          );
        }
      }
    }

    return columns;
  };

  return (
    <div className="kanban-board">
      <div className="options">
        <select value={groupingOption} onChange={(e) => setGroupingOption(e.target.value)}>
          <option value="status">By Status</option>
          <option value="user">By User</option>
          <option value="priority">By Priority</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <div className="columns-container">
        {renderColumnsByGroup()}
      </div>
    </div>
  );
};

export default KanbanBoard;
