import { Typography } from "@material-tailwind/react";
import { Settings as SettingsIcon } from "lucide-react";

export default function MaintenanceSection4() {
  return (
    <section className="min-h-screen grid place-items-center">
      <div className="container mx-auto">
        <div className="text-center">
          <div className="animate-spin-slow inline-block">
            <SettingsIcon className="h-16 w-16 mx-auto text-primary" />
          </div>
          <Typography
            as="h2"
            type="h5"
            className="my-6 max-w-xl mx-auto [text-wrap:_balance]"
          >
            We&apos;re currently undergoing maintenance to improve your experience.
          </Typography>
          <Typography
            type="lead"
            className="text-foreground max-w-xl mx-auto [text-wrap:_balance]"
          >
            Please bear with us while we make these enhancements. We&apos;ll be back shortly. Thank you for your patience!
          </Typography>
        </div>
      </div>
    </section>
  );
}
