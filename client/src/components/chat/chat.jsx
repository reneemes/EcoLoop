import './chat.scss';
import { useState, useEffect, useRef } from 'react';
import { CircleArrowUp } from 'lucide-react';

function Chat({ onSaveChat }) {
  const [item, setItem] = useState('');
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: {
      reply: `Hi! I'm your recycling assistant ♻️\n\nType the name of an item (like "plastic bottle" or "pizza box"), and I’ll tell you if it’s recyclable, what category it belongs to, and how to dispose of it properly.`,
      category: 'other',
      recyclable: null
    }
  }]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const container = messagesEndRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!item.trim()) return;

    const userMessage = { role: 'user', content: `Can I recycle a ${item}?` };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

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
        { role: 'assistant', content: data }
      ]);
      
      onSaveChat(data, item);
      setItem('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className='chat'>
      <div className='chat__messages' ref={messagesEndRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat__msg ${msg.role}`}>
            
            {/* USER MESSAGE */}
            {msg.role === 'user' && (
              <p>{msg.content}</p>
            )}

            {/* AI MESSAGE */}
            {msg.role === 'assistant' && (
              <>
                {msg.content.reply ? (
                  <>
                    <p>{msg.content.reply}</p>

                    {msg.content.category !== 'other' && (
                      <div className='chat__meta'>
                        <p className={`badge ${msg.content.category}`}>
                          Category: {msg.content.category}
                        </p>

                        <p className={msg.content.recyclable ? 'true' : 'no'}>
                          {msg.content.recyclable ? '♻️ Recyclable' : '🗑️ Trash'}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>An error occurred processing your request.</p>
                )}
              </>
            )}
          </div>
        ))}

        {loading && (
          <div className='chat__msg assistant'>
            <p className="typing">•••</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* CHAT BOX */}
      <form onSubmit={sendMessage} className='chat__form'>
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder='Soda Bottle'
        />
        <button type='submit'>
          <CircleArrowUp className='arrow'/>
        </button>
      </form>
    </div>
  );
}

export default Chat;