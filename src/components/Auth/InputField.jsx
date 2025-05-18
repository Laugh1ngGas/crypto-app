import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputField = ({ icon: Icon, placeholder, type = "text", isPassword }) => {
  const [showPassword, setShowPassword] = useState(true);
  const toggle = () => setShowPassword(!showPassword);

  return (
    <div className="w-full mb-3 flex items-center gap-2 bg-neutral-900 p-2 border border-neutral-700 rounded-xl relative">
      <Icon />
      <input
        type={isPassword ? (showPassword ? "password" : "text") : type}
        placeholder={placeholder}
        className="bg-transparent border-0 w-full outline-none text-sm"
      />
      {isPassword && (
        showPassword ? (
          <EyeOff className="absolute right-5 cursor-pointer" onClick={toggle} />
        ) : (
          <Eye className="absolute right-5 cursor-pointer" onClick={toggle} />
        )
      )}
    </div>
  );
};

export default InputField;
