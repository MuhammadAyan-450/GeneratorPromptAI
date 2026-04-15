import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
      <div className="w-40 h-40">
        <DotLottieReact
          src="https://lottie.host/1740dce3-a560-484d-8c1b-f0c1aa0f1022/M6RUdlHGz7.lottie"
          loop
          autoplay
        />
      </div>

      {/* Optional text */}
      <p className="absolute bottom-10 text-sm text-gray-500 dark:text-gray-300">
        Loading tools...
      </p>
    </div>
  );
}