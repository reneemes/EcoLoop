import './chat.scss';
import { useState } from 'react';

function Chat() {
  const [item, setItem] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!item.trim()) return;

    const userMessage = { role: "user", content: `Can I recycle a ${item}?` };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch(`${apiUrl}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ item }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data }
      ]);
      saveAIResponse(data)
    } catch (err) {
      console.error(err);
    }

    setItem('');
  };

  const saveAIResponse = async (message) => {
    if (message.content.category !== 'other') {
      await fetch('/api/v1/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          chat: message.content.reply,
        }),
      });
    }
  };

  return (
    <div className='chat'>
      <div className='chat__messages'>
        {messages.map((msg, i) => (
          <div key={i} className={`chat__msg ${msg.role}`}>
            
            {/* USER MESSAGE */}
            {msg.role === 'user' && (
              <p>{msg.content}</p>
            )}

            {/* AI MESSAGE */}
            {msg.role === 'assistant' && (
              <>
              {!msg.content.reply && (
                <p>An error occurred processing your request. Please try again later.</p>
              )}
                <p>{msg.content.reply}</p>

                {msg.content.category !== 'other' || msg.content.reply === '' && (<div className='chat__meta'>
                  <p className={`badge ${msg.content.category}`}>
                    Category: {msg.content.category}
                  </p>

                  <p className={msg.content.recyclable ? 'true' : 'no'}>
                    {msg.content.recyclable ? '♻️ Recyclable' : '🗑️ Trash'}
                  </p>
                </div>)}
              </>
            )}
          </div>
        ))}
      </div>

      {loading && <div className='chat__msg assistant'>Thinking...</div>}

      <form onSubmit={sendMessage} className='chat__form'>
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder='Soda Bottle'
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}

export default Chat;