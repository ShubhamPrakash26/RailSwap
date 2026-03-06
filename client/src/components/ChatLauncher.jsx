import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatWidget open={open} onClose={() => setOpen(false)} />

      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        className="cursor-pointer fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-lg flex items-center justify-center text-white text-xl"
      >
        💬
      </button>
    </>
  );
}
