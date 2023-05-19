import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
    small?: boolean;
    gray?: boolean;
    
    className?: string;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement>;



export default function Button({ small = true, gray = false, className = "", ...props }: ButtonProps) {

    const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";
    const colorClasses = gray ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white";

    return (
        <button {...props} className={`${sizeClasses} ${colorClasses} ${className} rounded-full disabled:cursor-not-allowed  transition-colors duration-300 text-white disabled:opacity-40`}>

        </button>
    )
}