import './dashboard.scss';
import { useAuth } from '../../context/authContext';
import MyChart from '../chart/chart';
import { useEffect, useState, useMemo } from 'react';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchRecycleStats() {
      const res = await fetch(`${apiUrl}/api/v1/recycle`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Fetch failed');
      }
      
      const data = await res.json();
      setStats(data);
    }

    fetchRecycleStats();
  }, [apiUrl]);

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
        typeColors[type] || "#cccccc", // fallback color
      ])
    ];
  }

  return (
    <section className='dashboard'>
      {/* <h1 className='dashboard__header'>Hello {user.username}</h1> */}

      <div className='dashboard__stat-block'>
        <MyChart data={formatStats(stats)}/>
      </div>

      <div className='dashboard__recycling'>
        <form className='dashboard__recycling--form'>
          <h3>Log Recycling</h3>

          <div>
            <label>Type</label>
            <select>
              <option>Plastic</option>
              <option>Glass</option>
              <option>Paper</option>
              <option>Metal</option>
              <option>Cardboard</option>
            </select>
          </div>

          <div>
            <label>Item</label>
            <input/>
          </div>

          <div>
            <label>Amount</label>
            <input/>
          </div>

          <div>
            <label>Date Recycled</label>
            <input/>
          </div>

          <button>Save</button>
        </form>
      </div>
    </section>
  )
}

export default Dashboard;