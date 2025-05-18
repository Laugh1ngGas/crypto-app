import { Mail, Lock, User } from "lucide-react";
import AuthWrapper from "../../components/Auth/AuthWrapper";
import AuthHeader from "../../components/Auth/AuthHeader";
import InputField from "../../components/Auth/InputField";
import Divider from "../../components/Auth/Divider";
import GoogleSignIn from "../../components/Auth/GoogleSignIn";

const SignUp = () => (
  <AuthWrapper>
    <AuthHeader
      title="Welcome to the Crypto App"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkHref="/signin"
    />

    <div className="w-full flex flex-col">
      <InputField icon={User} placeholder="User name" />
      <InputField icon={Mail} placeholder="Email address" type="email" />
      <InputField icon={Lock} placeholder="Password" isPassword />
    </div>

    <button className="w-full p-2 bg-gradient-to-r from-orange-500 to-orange-800 rounded-xl mt-3 text-sm hover:from-orange-600 hover:to-orange-900">
      Sign Up
    </button>

    <Divider />
    <GoogleSignIn />
  </AuthWrapper>
);

export default SignUp;
