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
        src="/cocoora-logo-white.png"
        alt="Cocoora Studio Medico Polispecialistico"
        width={360}
        height={156}
        priority
        className={cn("h-9 w-auto object-contain", className)}
      />
    );
  }

  return (
    <Image
      src="/cocoora-logo-transparent.png"
      alt="Cocoora Studio Medico Polispecialistico"
      width={360}
      height={156}
      priority
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}

