import { FcGoogle } from "react-icons/fc";

const GoogleAuthButton = ({ onClick }) => (
  <div onClick={onClick} className="w-full flex justify-center p-2 bg-neutral-700 cursor-pointer rounded-xl hover:bg-neutral-800">
    <FcGoogle size={24} />
    <p className="ml-2">Sign in with Google</p>
  </div>
);

export default GoogleAuthButton;
