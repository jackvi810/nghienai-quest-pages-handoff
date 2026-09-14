import nghienAiLogo from "@/assets/nghien-ai-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-7 w-[98px]",
  md: "h-9 w-[126px]",
  lg: "h-12 w-[168px]",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <img
      src={nghienAiLogo}
      alt="Nghiên AI"
      className={`block ${sizes[size]} object-contain object-left ${className}`}
    />
  );
}
