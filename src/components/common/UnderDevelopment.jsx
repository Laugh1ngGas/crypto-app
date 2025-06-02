import { Settings as SettingsIcon } from "lucide-react";

const MaintenancePlaceholder = () => {
  return (
    <div className="min-h-[60vh] sm:min-h-[80%] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin-slow inline-block">
          <SettingsIcon className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-700 mx-auto" />
        </div>
        <p className="mt-4 text-base sm:text-lg text-neutral-700 font-medium">
          Under development
        </p>
      </div>
    </div>
  );
};

export default MaintenancePlaceholder;
