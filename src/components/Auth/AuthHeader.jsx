import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const AuthHeader = ({ title, subtitle, linkText, linkHref }) => (
  <>
    <Link to="/">
      <img className="h-16 w-16" src={logo} alt="logo" />
    </Link>
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-neutral-400">
        {subtitle}{" "}
        <Link to={linkHref} className="text-neutral-100 hover:text-neutral-300">
          {linkText}
        </Link>
      </p>
    </div>
  </>
);

export default AuthHeader;
