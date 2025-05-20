const AuthInput = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="mb-3 flex items-center gap-2 bg-neutral-900 p-2 border border-neutral-700 rounded-xl">
    <Icon />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-transparent border-0 w-full outline-none text-sm"
      required
    />
  </div>
);

export default AuthInput;
