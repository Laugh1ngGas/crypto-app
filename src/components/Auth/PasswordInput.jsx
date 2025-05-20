import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ value, onChange }) => {
  const [show, setShow] = useState(true);

  return (
    <div className="flex items-center gap-2 bg-neutral-900 p-2 border border-neutral-700 rounded-xl relative">
      <Lock />
      <input
        type={show ? "password" : "text"}
        placeholder="Password"
        value={value}
        onChange={onChange}
        className="bg-transparent border-0 w-full outline-none text-sm"
        required
      />
      {show ? (
        <EyeOff className="absolute right-5 cursor-pointer" onClick={() => setShow(false)} />
      ) : (
        <Eye className="absolute right-5 cursor-pointer" onClick={() => setShow(true)} />
      )}
    </div>
  );
};

export default PasswordInput;
