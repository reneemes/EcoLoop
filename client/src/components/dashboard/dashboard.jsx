import './dashboard.scss';
import { useAuth } from '../../context/authContext';
import MyChart from '../chart/chart';
import Chat from '../chat/chat';
import History from '../history/history';
import { useEffect, useState, useMemo } from 'react';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState();
  const [saveError, setSaveError] = useState();

  const [history, setHistory] = useState([]);

  // Form State
  const [itemType, setItemType] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [recycleDate, setRecycleDate] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchRecycleStats();
    fetchSearchHistory();
  }, [apiUrl, isAuthenticated]);

  async function fetchRecycleStats() {
    const res = await fetch(`${apiUrl}/api/v1/recycle`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // if (!res.ok) {
    //   const error = await res.json();
    //   throw new Error(error.message || 'Fetch failed');
    // }
    
    const data = await res.json();
    setStats(data);
  }

  async function fetchSearchHistory() {
    const res = await fetch(`${apiUrl}/api/v1/chat`, {
      method: 'GET',
      credentials: 'include',
    });

    // if (!res.ok) {
    //   const error = await res.json();
    //   throw new Error(error.message || 'Fetch failed');
    // }
    
    const data = await res.json();
    setHistory(data);
  }
  
  const formatStats = (items = []) => {
    const counts = items
      .filter(item => item && item.recycled_at)
      .reduce((acc, { item_type, quantity }) => {
        if (!item_type) return acc;

        acc[item_type] = (acc[item_type] || 0) + quantity;
        return acc;
      }, {});

    const typeColors = {
      plastic: "#a8e6cf",
      glass: "#dcedc1",
      paper: "#ffd3b6",
      metal: "#ffaaa5",
      cardboard: "#c7ceea",
    };

    return [
      ["Material", "Total Recycled", { role: "style" }],
      ...Object.entries(counts).map(([type, total]) => [
        type[0].toUpperCase() + type.slice(1),
        total,
        // '#a8e6cf', // fallback color
        typeColors[type] || "#cccccc",
      ])
    ];
  }

  const submitRecycling = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/recycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          item_type: itemType,
          item_name: itemName,
          quantity: itemAmount,
          recycled_at: recycleDate,
        }),
      });

      // if (!res.ok) {
      //   throw new Error('Failed to save recycling');
      // }

      fetchRecycleStats();
    } catch (error) {
      setSaveError(error)
    }
  }

  const deleteSearchHistory = async (id) => {
    try {
      await fetch(`${apiUrl}/api/v1/chat/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className='dashboard'>
      {/* <h1 className='dashboard__header'>{user.username}'s Dashboard</h1> */}

      <div className='dashboard__stat-block'>
        <MyChart data={formatStats(stats)}/>
      </div>

      <div className='dashboard__recycling'>
        <form className='dashboard__recycling--form'>
          <h3 className='dashboard__recycling--header'>Log Recycling</h3>

          <div className='dashboard__recycling--box-type'>
            <label htmlFor='type'>Type</label>
            <select 
              id='type'
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
            >
              <option>Plastic</option>
              <option>Glass</option>
              <option>Paper</option>
              <option>Metal</option>
              <option>Cardboard</option>
            </select>
          </div>

          <div className='dashboard__recycling--box-name'>
            <label htmlFor='item-name'>Item</label>
            <input
              id='item-name'
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className='dashboard__recycling--box-amount'>
            <label htmlFor='amount'>Amount</label>
            <input
              id='amount'
              value={itemAmount}
              onChange={(e) => setItemAmount(e.target.value)}
            />
          </div>

          <div className='dashboard__recycling--box-date'>
            <label htmlFor='date'>Date Recycled</label>
            <input
              id='date'
              type='date'
              value={recycleDate}
              onChange={(e) => setRecycleDate(e.target.value)}
            />
          </div>

          <button
            className='dashboard__recycling--submit-btn'
            onClick={submitRecycling}
          >Save</button>
        </form>
      </div>

      <div className='dashboard__chat'>
        <Chat />
      </div>

      <section className='dashboard__history'>
        <h3>Search History</h3>
        <div className='dashboard__history--grid'>
          {history.map((result) => (
            <History 
              key={result.id}
              id={result.id} 
              keyword={result.keyword} 
              result={result.result}
              deleteSearchHistory={deleteSearchHistory}
            />
          ))}
        </div>
        {/* <History history={history}/> */}
      </section>
    </section>
  )
}

export default Dashboard;