import { CircleX } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="flex gap-2 justify-center items-center mb-4">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <CircleX className="text-red-600 h-8 w-8" />
    </div>
    <Link to="/">
      <button type="button" className="p-2 bg-gradient-to-r from-orange-500 to-orange-800 rounded-xl mt-3 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-900 text-sm md:text-base">
        Go back to Home page
      </button>
    </Link>
  </div>
);

export default NotFoundPage;