import './history.scss';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

function History({ id, keyword, result }) {
  const [openId, setOpenId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenId(openId === id ? null : id);
  }

  return (
    <div key={id} className='keyword__item'>
      <p
        className='keyword__title'
        onClick={() => toggleDropdown(id)}
      >
        {keyword}
      </p>

      {/* Dropdown for result */}
      {openId === id && (
        <div className='keyword__dropdown'>
          <p>{result}</p>
        </div>
      )}

      <button><Trash2 /></button>
    </div>
  );
}

export default History;