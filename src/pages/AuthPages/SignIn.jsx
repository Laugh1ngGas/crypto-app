import { Mail, Lock } from "lucide-react";
import AuthWrapper from "../../components/Auth/AuthWrapper";
import AuthHeader from "../../components/Auth/AuthHeader";
import InputField from "../../components/Auth/InputField";
import Divider from "../../components/Auth/Divider";
import GoogleSignIn from "../../components/Auth/GoogleSignIn";

const SignIn = () => (
  <AuthWrapper>
    <AuthHeader
      title="Welcome Back"
      subtitle="Don't have an account?"
      linkText="Sign up"
      linkHref="/signup"
    />

    <div className="w-full flex flex-col">
      <InputField icon={Mail} placeholder="Email address" type="email" />
      <InputField icon={Lock} placeholder="Password" isPassword />
    </div>

    <button className="w-full p-2 bg-gradient-to-r from-orange-500 to-orange-800 rounded-xl mt-3 text-sm hover:from-orange-600 hover:to-orange-900">
      Sign In
    </button>

    <Divider />
    <GoogleSignIn />
  </AuthWrapper>
);

export default SignIn;
