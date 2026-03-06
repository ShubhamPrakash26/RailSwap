import React, { useState, useRef, useEffect } from 'react';
import API from '../lib/api';

export default function ChatWidget({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      // focus input when opened
      const el = document.getElementById('chat-input');
      if (el) el.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!q.trim()) return;
    const userMsg = { from: 'user', text: q };
    setMessages(m => [...m, userMsg]);
    setQ('');
    setLoading(true);
    try {
      // Use server-side FAQ JSON endpoint for answers
      const res = await API.post('/faq', { q });
      const data = res.data || {};
      if (data.answer) {
        setMessages(m => [...m, { from: 'assistant', text: data.answer }]);
      } else if (data.suggestions && data.suggestions.length) {
        const suggestionText = 'I could not find an exact answer. Suggestions:\n' + data.suggestions.map(s => `- ${s.question}`).join('\n');
        setMessages(m => [...m, { from: 'assistant', text: suggestionText }]);
      } else {
        setMessages(m => [...m, { from: 'assistant', text: 'No answer found.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(m => [...m, { from: 'assistant', text: 'Error contacting assistant. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-6 bottom-20 w-80 md:w-96 z-50 cursor-pointer">
      <div className="bg-[#0B1220] border border-slate-700 rounded-lg shadow-lg flex flex-col h-96">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">AI</div>
            <div className="text-white font-semibold">RailSwap Assistant</div>
          </div>
          <div>
            <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-3 text-sm">
          {messages.length === 0 && (
            <div className="text-slate-400">Hi! Ask about bookings, PNR, refunds, seat swaps, or just say hello.</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t border-slate-800">
          <div className="flex gap-2">
            <input
              id="chat-input"
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(); }}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 rounded bg-slate-900 text-white text-sm"
            />
            <button onClick={send} disabled={loading} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
