import React from 'react'

function CustomInput({label, placeholder,onchange,type,props,className}) {
  return (
    <>
        {label && <label className='label-style'>{label}</label>}
        <input placeholder={placeholder} type={type} className={`input-style ${className}`} onChange={onchange} {...props}></input>
    </>
  )
}

export default CustomInput