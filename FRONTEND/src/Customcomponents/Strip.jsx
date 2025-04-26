import React from 'react';

function Strip({ member, onClick }) {
  return (
    <div
      className="bg-[#0088ff] text-white px-3 py-1 rounded-full text-xs flex items-center cursor-pointer"
    >
      {member.username}
      <button
        className="ml-2 text-white font-bold hover:text-red-300 cursor-pointer"
        onClick={onClick}
      >
        ×
      </button>
    </div>
  );
}

export default Strip;
