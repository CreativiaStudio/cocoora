import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light" | "white";
  className?: string;
}) {
  const isWhite = variant === "light" || variant === "white";

  return (
    <Image
      src={isWhite ? "/cocoora-logo-horizontal-white.png" : "/cocoora-logo-horizontal.png"}
      alt="Cocoora Centro Medico"
      width={749}
      height={146}
      priority
      className={cn("w-auto object-contain transition-all duration-300 ease-in-out", className ?? "h-10 sm:h-12")}
    />
  );
}
