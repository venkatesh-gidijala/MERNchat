import React, { useEffect, useState } from 'react'
import CustomInput from '../Customcomponents/CustomInput'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios' 
import { toast } from 'react-toastify'
function Registration() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profile, setProfile] = useState('')
  const [preview,setpreview] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loader,setLoader] = useState(false)

  // useEffect(()=>{
  //         const UserInfo = JSON.parse(localStorage.getItem("userInfo"))
  //         if(UserInfo){
  //             navigate("/HomePage")
  //         }
  // },[navigate])

  const Handlesubmit = async(e) =>{
    e.preventDefault()
    setLoader(true)
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('password', password);
    if(profile){
      const profileFormalData = new FormData();
      profileFormalData.append('file',profile);
      profileFormalData.append('upload_preset','chat-app');
      try{
        const result = await fetch('https://api.cloudinary.com/v1_1/ds9cdbved/image/upload',{
          method:"POST",
          body:profileFormalData
        })
        const profileData = await result.json()
        formData.append('profile',profileData.secure_url);
      }catch(error){
        console.log(error)
      }
    }else{
      formData.append('profile',profile)
    }
    axios.post('https://chatapp2-0-ss0n.onrender.com/ChatTogether/user/',formData
    ).then((res)=>{
      toast.success("Registration successful!")
      setUserName('')
      setEmail('')  
      setPassword('')
      setProfile('')
      setpreview('')
      setLoader(false)
      navigate('/login')
    }).catch((err)=>{
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message); 
      } else {
        toast.error("UserName or Email Already used");
      }
    }).finally(()=>{
      setLoader(false)
    })
  }
  const HandleProfileChange = (e) =>{
    const file = e.target.files[0];
    if(file){
      setProfile(file)
      setpreview(URL.createObjectURL(file))
    }
  }
  return (
    <>
        <div className="border-2 border-gray-500 shadow-md shadow-gray-500 rounded-2xl mx-auto lg:w-1/3 sm:w-2/3 md:w-1/2  
            flex flex-col justify-center items-center mt-10 p-10 selection:bg-gray-600">
          <form className="w-full flex flex-col" onSubmit={Handlesubmit}>
              <h2 className="text-center mb-4 sm:text-xl md:text-2xl lg:text-3xl font-black pb-3">Registration</h2>
              <div className='flex flex-row justify-center items-center mb-2'>
                <label className='cursor-pointer' htmlFor="profile">
                  <div className='rounded-full shadow-md shadow-gray-800 w-30 h-28 bg-gray-600  mr-2 overflow-hidden  border-2 border-gray-600'>
                    {preview?(<img src={preview} alt='preview' className='w-full h-full object-cover'/>):
                    (<img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="profile" className='w-30 h-28 object-cover'/>)}
                    </div>
                </label>
                <input
                  id='profile'
                  type="file"
                  className='hidden'
                  accept="image/*"
                  onChange={HandleProfileChange}
                  ></input>
              </div>
              <CustomInput  placeholder='Enter Your UserName' label='UserName' type={"text"} onchange={(e)=> setUserName(e.target.value)}/>
              <CustomInput  placeholder='Enter Your E-Mail' label='E-Mail' type={"text"} onchange={(e)=> setEmail(e.target.value)}/>
              <label className='label-style'>Password</label>
              <div className='flex items-center w-full'>
                <CustomInput  placeholder='Enter Your Password' className={"w-full"} type={showPassword?"text":"password"}  autoComplete="current-password" onchange={(e)=> setPassword(e.target.value)}/>
                <button className="flex flex-row border-2 border-gray-600 p-2 ml-1 rounded-lg cursor-pointer focus:ring-1 focus:ring-gray-400"  type="button"onClick={()=>setShowPassword(!showPassword)}>{showPassword?<Eye className="m-0.5" size="20"/>:<EyeOff className="m-0.5" size="20"/>}</button>
              </div>   
              <button disabled={setLoader} className='border-2 border-gray-800 mt-10 bg-gray-800 text-white flex justify-center item center 
              rounded-lg py-2 px-3 hover:bg-gray-700 hover:border-2 hover:border-gray-500 cursor-pointer' type='submit'> {loader && <div className="loader"></div>}
  {loader ? 'Registering...' : 'Register'}</button>
              <h2 className='mt-6 ml-3 flex justify-center align-center'>Already Have An Account ?<Link to='/Login' className='ml-2 text-blue-500 hover:text-blue-700'>Login</Link></h2>
          </form>
        </div>
    </>
  )
}

export default Registration