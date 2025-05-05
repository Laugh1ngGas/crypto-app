import { useState } from "react";
import { Mail, Eye, EyeOff, Lock, User, } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import logo from '../assets/logo.png';

const SignFormPage = () => {

  const [action, setAction] = useState("Sign Up");
  const [showPassword, setShowPassword] = useState(true);
  const togglePasswordView = () => setShowPassword(!showPassword);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 flex-col flex items-center gap-3 border border-neutral-700 rounded-xl shadow-orange-900 shadow-md">
        <img className="h-16 w-16" src={logo} alt="logo" />
        
        <div> {action === "Sign Up" ? 
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-2xl md:text-2xl font-semibold">Welcome to the Crypto App</h1>
            <p className="text-xs md:text-sm text-neutral-400 ">Already have an account? <span className="text-neutral-100 hover:text-neutral-300 cursor-pointer" onClick={() => setAction("Sign In")}>Sign in</span></p>
          </div> : 
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-2xl md:text-2xl font-semibold">Welcome Back</h1>
            <p className="text-xs md:text-sm text-neutral-400">Don't have an account? <span className="text-neutral-100 hover:text-neutral-300 cursor-pointer" onClick={() => setAction("Sign Up")}>Sign up</span></p>
          </div>}
        </div>
        <div className="w-full flex flex-col"> 
          <div>
              {action === "Sign In" ? <div></div> : 
              <div className="w-full mb-3 flex items-center gap-2 bg-neutral-900 p-2 border border-neutral-700 rounded-xl">
                <User />
                <input
                type="user"
                placeholder="User name"
                className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
                />
              </div>}
          </div>
          <div className="w-full mb-3 flex items-center gap-2 bg-neutral-900 p-2 border border-neutral-700 rounded-xl">
            <Mail />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
          </div>
          <div className="w-full flex items-center gap-2 bg-neutral-900 p-2 border border-neutral-700 rounded-xl relative">
            <Lock />
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <EyeOff
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <Eye
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>
        <div className="w-full">{action === "Sign Up" ? 
          <button className="w-full p-2 bg-gradient-to-r from-orange-500 to-orange-800 rounded-xl mt-3 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-900 text-sm md:text-base">
            Sign Up
          </button> : 
          <button className="w-full p-2 bg-gradient-to-r from-orange-500 to-orange-800 rounded-xl mt-3 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-900 text-sm md:text-base">
            Sign In
          </button>}
        </div>
        <div className="relative w-full flex items-center justify-center py-3">
          <div className="w-2/5 h-[2px] bg-neutral-700"></div>
          <h3 className="text-xs md:text-sm px-4 text-neutral-400">
            Or
          </h3>
          <div className="w-2/5 h-[2px] bg-neutral-700"></div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-2 justify-center items-center p-1 md:p-2 lg:p-2 bg-neutral-700 cursor-pointer rounded-xl hover:bg-neutral-800">
            <FcGoogle size={24} /> <p>Sign in with Google</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignFormPage;