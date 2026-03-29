import './history.scss';
import { Trash2, ChevronDown } from 'lucide-react';

function History({ id, keyword, result, deleteSearchHistory, openId, setOpenId }) {
  const toggleDropdown = () => {
    setOpenId(openId === id ? null : id);
  }

  const formatTitle = (string) => {
    return string.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }

  return (
    <div className={`item ${openId === id ? 'active' : ''}`}>
      <button className='item__arrow' onClick={toggleDropdown}>
        <ChevronDown className={openId === id ? 'rotate' : ''}/>
      </button>

      <p className='item__title' onClick={toggleDropdown}>
        {formatTitle(keyword)}
      </p>

      {/* Dropdown for result */}
      {openId === id && (
        <div className='item__dropdown'>
          <p>{result}</p>
        </div>
      )}

      <button className='item__trash' onClick={() => deleteSearchHistory(id)}>
        <Trash2/>
      </button>
    </div>
  );
}

export default History;