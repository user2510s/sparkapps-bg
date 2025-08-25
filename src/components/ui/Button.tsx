import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../libs/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secundary" | "danger" | "exit";
  href?: string; // nova prop para link
  target?: "_blank" | "_self"; // opcional
}

export default function Button({
  children,
  variant = "primary",
  className,
  href,
  target = "_blank",
  ...props
}: ButtonProps) {
  const baseStyles = "text-gray-950 bg-gray-100 px-4";

  const variants = {
    primary: "flex items-center justify-center gap-2 mt-6 px-4 py-2 bg-slate-100 text-slate-900 rounded hover:bg-slate-200 transition-all",
    secundary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "inline-flex w-full justify-center rounded-md text-gray-950 bg-gray-100 hover:bg-gray-200 transition-all px-3 py-2 text-sm font-semibold sm:ml-3 sm:w-auto",
    exit: "absolute right-0 top-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-600 cursor-pointer",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      e.preventDefault();
      window.open(href, target);
    }
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
