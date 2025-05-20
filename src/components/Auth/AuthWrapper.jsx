import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const AuthWrapper = ({ title, children }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[90%] max-w-sm md:max-w-md p-5 flex-col flex items-center gap-3 border border-neutral-700 rounded-xl shadow-orange-900 shadow-md">
        <Link to="/">
          <img className="h-16 w-16" src={logo} alt="logo" />
        </Link>
        <h1 className="text-2xl font-semibold text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
