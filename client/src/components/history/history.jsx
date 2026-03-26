import './history.scss';
import { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';

function History({ id, keyword, result, deleteSearchHistory }) {
  const [openId, setOpenId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenId(openId === id ? null : id);
  }

  const formatTitle = (string) => {
    return string.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }

  return (
    <div className='item'>
      <button className='item__arrow' onClick={() => toggleDropdown(id)}>
        <ChevronDown />
      </button>

      <p className='item__title' onClick={() => toggleDropdown(id)}>
        {formatTitle(keyword)}
      </p>

      {/* Dropdown for result */}
      {openId === id && (
        <div className='item__dropdown'>
          <p>{result}</p>
        </div>
      )}

      {/* <button className='item__trash' onClick={() => console.log(id)}> */}
      <button className='item__trash' onClick={() => deleteSearchHistory(id)}>
        <Trash2/>
      </button>
    </div>
  );
}

export default History;