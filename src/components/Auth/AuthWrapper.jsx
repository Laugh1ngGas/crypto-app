const AuthWrapper = ({ children }) => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="w-[90%] max-w-sm md:max-w-md p-5 flex-col flex items-center gap-3 border border-neutral-700 rounded-xl shadow-orange-900 shadow-md">
      {children}
    </div>
  </div>
);

export default AuthWrapper;
