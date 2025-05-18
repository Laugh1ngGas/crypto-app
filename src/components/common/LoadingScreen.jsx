const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
    </div>
  </div>
);


export default Loader;
