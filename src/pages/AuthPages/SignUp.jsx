import { useState } from "react";
import { Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/Auth/AuthWrapper";
import AuthInput from "../../components/Auth/AuthInput";
import PasswordInput from "../../components/Auth/PasswordInput";
import AuthDivider from "../../components/Auth/AuthDivider";
import GoogleAuthButton from "../../components/Auth/GoogleAuthButton";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle, doSendEmailVerification } from "../../firebase/auth";
import Loader from "../../components/common/LoadingScreen";
import { validateSignUp } from "../../utils/validation";
import { FirebaseError } from "firebase/app";

const SignUp = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateSignUp(nickname, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password, nickname);
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      setLoading(false);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use another one.");
      } else {
        setError(err.message);
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
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <AuthWrapper title="Welcome to the Crypto App">
        <p className="text-sm text-neutral-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-neutral-100 hover:text-neutral-300">
            Sign in
          </Link>
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <AuthInput
            icon={User}
            type="text"
            placeholder="User name"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
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
            Sign Up
          </button>
        </form>
        <AuthDivider />
        <GoogleAuthButton onClick={handleGoogleSignIn} />
      </AuthWrapper>
    </>
  );
};

export default SignUp;
