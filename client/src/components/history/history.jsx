import './history.scss';
import { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';

function History({ id, keyword, result }) {
  const [openId, setOpenId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenId(openId === id ? null : id);
  }

  return (
    <div key={id} className='item'>
      <button className='item__arrow' onClick={() => toggleDropdown(id)}>
        <ChevronDown />
      </button>

      <p className='item__title' onClick={() => toggleDropdown(id)}>
        {keyword}
      </p>

      {/* Dropdown for result */}
      {openId === id && (
        <div className='item__dropdown'>
          <p>{result}</p>
        </div>
      )}

      <button className='item__trash'>
        <Trash2 />
      </button>
    </div>
  );
}

export default History;