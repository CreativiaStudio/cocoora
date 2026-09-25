import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light" | "white";
  className?: string;
}) {
  if (variant === "light" || variant === "white") {
    return (
      <Image
        src="/cocoora-logo-horizontal-white.png"
        alt="Cocoora Studio Medico Polispecialistico"
        width={749}
        height={190}
        priority
        className={cn("h-9 sm:h-10 w-auto object-contain", className)}
      />
    );
  }

  return (
    <Image
      src="/cocoora-logo-horizontal.png"
      alt="Cocoora Studio Medico Polispecialistico"
      width={749}
      height={190}
      priority
      className={cn("h-9 sm:h-10 w-auto object-contain", className)}
    />
  );
}

