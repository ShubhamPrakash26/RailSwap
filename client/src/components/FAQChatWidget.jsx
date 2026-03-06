import React, { useState } from 'react';
import API from '../lib/api';

export default function FAQChatWidget() {
  const [q, setQ] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!q.trim()) return;
    const userMsg = { from: 'user', text: q };
    setMessages(m => [...m, userMsg]);
    setQ('');
    setLoading(true);
    try {
      const res = await API.post('/faq', { q });
      const data = res.data || {};
      if (data.answer) {
        setMessages(m => [...m, { from: 'assistant', text: data.answer }]);
      } else if (data.suggestions && data.suggestions.length) {
        const suggestionText = 'I could not find an exact answer. Did you mean:\n' + data.suggestions.map(s => `- ${s.question}`).join('\n');
        setMessages(m => [...m, { from: 'assistant', text: suggestionText }]);
      } else {
        setMessages(m => [...m, { from: 'assistant', text: "Sorry, I don't know the answer to that. Try rephrasing or ask another question." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(m => [...m, { from: 'assistant', text: 'Error looking up FAQ. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#0B1220] p-6 rounded-lg border border-slate-700">
      <h2 className="text-white text-xl font-bold mb-4">IRCTC Help</h2>

      <div className="h-64 overflow-auto bg-slate-900 p-3 rounded mb-4">
        {messages.length === 0 && (
          <div className="text-slate-400">Ask about RAC, refunds, Tatkal, PNR and more.</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.from === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block px-3 py-2 rounded ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ask a question (e.g., What is RAC?)" className="flex-1 px-3 py-2 rounded bg-slate-800 text-white" />
        <button onClick={send} disabled={loading} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  );
}
