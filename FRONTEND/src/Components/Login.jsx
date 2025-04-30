import React, { useEffect, useState } from 'react'
import CustomInput from '../Customcomponents/CustomInput'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
function Login() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  
  // useEffect(()=>{
  //       const UserInfo = JSON.parse(localStorage.getItem("userInfo"))
  //       if(UserInfo){
  //           navigate("/HomePage")
  //       }
  // },[navigate])


  const Handlesubmit = (e) =>{
    e.preventDefault()
    axios.post('https://chatapp2-0-ss0n.onrender.com/ChatTogether/user/login',{
      username: userName,
      password: password
    }).then((res)=>{
      localStorage.setItem("userInfo", JSON.stringify(res));
      toast.success("Login SuccesFull !")
      navigate('/HomePage');
    }).catch((err)=>{
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    })
  }
  
  return (
    <>
        <div className="border-2 border-gray-500 shadow-md shadow-gray-500 rounded-2xl mx-auto lg:w-1/3 sm:w-2/3 md:w-1/2  
            flex flex-col justify-center items-center mt-20 p-10 selection:bg-gray-600">
          <form className="w-full flex flex-col" onSubmit={Handlesubmit}>
              <h2 className="text-center mb-4 sm:text-2xl md:text-3xl lg:text-4xl font-black pb-3">Login</h2>
              <CustomInput  placeholder='Enter Your UserName' label='UserName' type={"text"} onchange={(e)=> setUserName(e.target.value)}/>
              <label className='label-style'>Password</label>
              <div className='flex items-center '>
                <CustomInput  placeholder='Enter Your Password' className={"w-full"} type={showPassword?"text":"password"} onchange={(e)=> setPassword(e.target.value)}/>
                <button className="flex flex-row border-2 border-gray-600 p-2 ml-1 rounded-lg cursor-pointer focus:ring-1 focus:ring-gray-400" type='button' onClick={()=>setShowPassword(!showPassword)}>{showPassword?<Eye className="m-0.5" size="20"/>:<EyeOff className="m-0.5" size="20"/>}</button>
              </div>
              <button className='border-2 border-gray-800 mt-10 bg-gray-800 text-white flex justify-center item center 
              rounded-lg py-2 px-3 hover:bg-gray-700 hover:border-2 hover:border-gray-500 cursor-pointer' type='submit' >Login</button>
              <h2 className='mt-6 ml-3 flex justify-center align-center'>Don't Have An Account?<Link to='/' className='ml-2 text-blue-500 hover:text-blue-700'>Create Account</Link></h2>
          </form>
        </div>
    </>
  )
}

export default Login