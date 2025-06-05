import { useState } from "react";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/Auth/AuthWrapper";
import AuthInput from "../../components/Auth/AuthInput";
import PasswordInput from "../../components/Auth/PasswordInput";
import AuthDivider from "../../components/Auth/AuthDivider";
import GoogleAuthButton from "../../components/Auth/GoogleAuthButton";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../firebase/auth";
import Loader from "../../components/common/LoadingScreen";
import {validateSignIn} from "../../utils/validation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validationError = validateSignIn(email);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setLoading(false);
        setError("Please verify your email before signing in.");
        return;
      }

      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard/portfolio");
      }, 3000);
    } catch (err) {
      setLoading(false);

      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/user-disabled") {
        setError("Your account has been disabled.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
    }
  };


  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await doSignInWithGoogle();
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard/portfolio");
      }, 3000);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <AuthWrapper title="Welcome Back">
        <p className="text-sm text-neutral-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-neutral-100 hover:text-neutral-300">
            Sign up
          </Link>
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <AuthInput
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="submit"
            className="w-full p-2 bg-gradient-to-r from-orange-500 to-orange-800 rounded-xl mt-3 text-sm hover:from-orange-600 hover:to-orange-900"
          >
            Sign In
          </button>
        </form>
        <AuthDivider />
        <GoogleAuthButton onClick={handleGoogleSignIn} />
      </AuthWrapper>
    </>
  );
};

export default SignIn;
