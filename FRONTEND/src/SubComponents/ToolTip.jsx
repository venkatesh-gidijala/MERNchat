import React from 'react'

function ToolTip({ name ,className}) {
  return (
    <span className={`absolute ${className} top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10`}>
      {name}
    </span>
  )
}

export default ToolTip
