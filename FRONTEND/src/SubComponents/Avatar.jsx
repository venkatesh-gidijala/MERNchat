import React, { useState } from 'react';

function getInitials(name) {
  if (!name) return '';
  const names = name.trim().split(' ');
  const initials = names.length === 1
    ? names[0].slice(0, 2)
    : names[0][0] + names[names.length - 1][0];
  return initials.toUpperCase();
}

function Avatar({className = "",user}) {
  const initials = getInitials(user.email);
  const [showModal,setShowModal] = useState(false);
  return (
    <>
    <div
      className={`flex items-center justify-center text-white font-bold 
        rounded-full overflow-hidden border-2 border-[#ef6510]  
        bg-[#3aaa72] ${className}`}  onClick={()=>setShowModal(true)}
    >
      {user.profile ? (
        <img src={user.profile} alt={user._id} className="w-full h-full object-cover rounded-full border-1 border-white" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
    {showModal && (
          <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
            <div className="bg-[#e5f6f9] rounded-xl p-6 w-80 shadow-xl relative transform scale-95 opacity-0 animate-fade-in">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                ❌
              </button>
              <div className="flex flex-col items-center p-4">
                  {user.profile ? (
                    <img
                      src={user.profile}
                      alt={initials}
                      className="w-32 h-32 rounded-full mb-4 border-4 border-amber-600 object-cover cursor-pointer bg-[#3aaa72]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mb-4 border-4 border-amber-600 bg-[#3aaa72] flex items-center justify-center text-4xl font-bold text-white">
                      {initials}
                    </div>
                  )}
                  <p className="text-black">{user.email}</p>
                </div>
            </div>
          </div>
          )
      }
  </>
  );
}

export default Avatar;
