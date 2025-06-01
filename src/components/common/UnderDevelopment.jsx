import { Settings as SettingsIcon } from "lucide-react";

const MaintenancePlaceholder = () => {
  return (
    <section className="h-[80%] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin-slow inline-block">
          <SettingsIcon className="w-16 h-16 text-neutral-700 mx-auto" />
        </div>
        <p className="mt-4 text-lg text-neutral-700 font-medium">
          Under development
        </p>
      </div>
    </section>
  );
};

export default MaintenancePlaceholder;
