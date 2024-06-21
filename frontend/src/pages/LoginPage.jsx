import {login} from "../services/login"
import { useNavigate } from "react-router-dom"
import {useUser} from "../context/UserContext";
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const LoginPage = () => {
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")

  const { userLogin } = useUser();

  const navigator = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await login({email, password})
      if (loggedUser) {
        userLogin(loggedUser)
        toast.success('You have successfully logged in.');
        navigator("/")
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="bg-blue-50 px-4 py-20">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Login to Your Account</h2>
        <form method="POST" onSubmit={handleLogin}>
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email Address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="mb-4">
              <button type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold">Login</button>
            </div>
            <div className="text-center text-gray-700">
              Dont have an account? 
              <Link to="/sign-up" className="text-indigo-500 hover:text-indigo-700">Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default LoginPage;