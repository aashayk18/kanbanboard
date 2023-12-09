import React, { useState, useEffect } from 'react';
import CardList from './CardList';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const [groupingOption, setGroupingOption] = useState(localStorage.getItem('groupingOption') || 'status');
    const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'priority');
    const [tickets, setTickets] = useState([]);
    const [showOptions, setShowOptions] = useState(false);

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

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const saveState = () => {
        localStorage.setItem('groupingOption', groupingOption);
        localStorage.setItem('sortBy', sortBy);
    };

    const renderOptions = () => {
        return (
            <div className="options">
                <select value={groupingOption} onChange={(e) => setGroupingOption(e.target.value)}>
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                </select>
            </div>
        );
    };

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
        saveState();
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
                    <CardList cards={cards} />
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
                    <CardList cards={cards} />
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
                            <CardList cards={priorityCards} />
                        </div>
                    );
                }
            }
        }

        return columns;
    };

    return (
        <div className="kanban-board">
            
                <div className="dropdown">
                    <button className="dropdown-button" onClick={() => setShowOptions(!showOptions)}>
                        <div>
                            <i className="fas fa-filter"></i> 
                            Display 
                        </div>
                    </button>
                    {showOptions && (
                        <div className="dropdown-content">
                            <div className="dropdown-options">
                                <label htmlFor="grouping">Grouping:</label>
                                <select id="grouping" value={groupingOption} onChange={(e) => setGroupingOption(e.target.value)}>
                                    <option value="status">Status</option>
                                    <option value="user">User</option>
                                    <option value="priority">Priority</option>
                                </select>
                            </div>
                            <div className="dropdown-options">
                                <label htmlFor="ordering">Ordering:</label>
                                <select id="ordering" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="priority">Priority</option>
                                    <option value="title">Title</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            
    
            <div className="columns-container">
                {renderColumnsByGroup()}
            </div>
        </div>
    );
        
    
};

export default KanbanBoard;
