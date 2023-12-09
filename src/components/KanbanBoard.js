// KanbanBoard.js
import React, { useState, useEffect } from 'react';
import CardList from './CardList'; // Import the CardList component
import './KanbanBoard.css'; // Import associated CSS file for styling

const KanbanBoard = () => {
  // State variables
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [tickets, setTickets] = useState([]); // State for fetched ticket data

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        // Assuming the API response returns an object with 'tickets' and 'users' arrays
        const { tickets: fetchedTickets } = data; // Extract 'tickets' array from the data object
        setTickets(fetchedTickets); // Set 'tickets' state with the extracted 'tickets' array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  // Function to handle grouping and sorting logic
  const groupAndSortTickets = () => {
    let organizedTickets = [...tickets]; // Create a copy of tickets array for manipulation

    // Grouping tickets based on 'groupingOption'
    if (groupingOption === 'status') {
      organizedTickets.sort((a, b) => a.status.localeCompare(b.status));
    } else if (groupingOption === 'user') {
      organizedTickets.sort((a, b) => a.userId - b.userId);
    } else if (groupingOption === 'priority') {
      organizedTickets.sort((a, b) => b.priority - a.priority);
    }

    // Sorting tickets based on 'sortBy'
    if (sortBy === 'priority') {
      organizedTickets.sort((a, b) => b.priority - a.priority);
    } else if (sortBy === 'title') {
      organizedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Update the 'tickets' state with the organized data
    setTickets(organizedTickets);
  };

  // Function to handle user interactions (e.g., changing grouping or sorting)
  const handleGroupingChange = (option) => {
    setGroupingOption(option);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
  };

  // Run grouping and sorting logic whenever 'groupingOption' or 'sortBy' changes
  useEffect(() => {
    groupAndSortTickets();
  }, [groupingOption, sortBy]);

  console.log(tickets); 
  console.log(typeof tickets);

  return (
    <div className="kanban-board">
      {/* Example UI components for options */}
      <div className="options">
        <select value={groupingOption} onChange={(e) => handleGroupingChange(e.target.value)}>
          <option value="status">By Status</option>
          <option value="user">By User</option>
          <option value="priority">By Priority</option>
        </select>
        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Render CardLists based on grouping */}
      <CardList title="To Do" cards={tickets} />
      {/* Other CardList components based on different categories */}
    </div>
  );
};

export default KanbanBoard;
