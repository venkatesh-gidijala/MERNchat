import React from 'react';
import { Bell } from 'lucide-react'; 

function NotificationIcon({ count = 0 ,className}) {
  return (
    <div className={`relative group w-fit ${className}`}>
      <Bell className="text-white size-6" />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
          {count}
        </span>
      )}
    </div>
  );
}

export default NotificationIcon;
