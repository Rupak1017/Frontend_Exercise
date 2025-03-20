// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  /**
   * Variant names:
   * - "logout": for logout buttons.
   * - "fav": for favorites buttons.
   * - "filter": for filter buttons in nav.
   * - "sortBreed": for sort-by-breed buttons.
   * - "sortLocation": for location filter buttons.
   * - "back": for back buttons.
   * - "match": for the Get a Match button.
   * - "close": for the Close button in modals.
   * - "login": for the Login button.
   */
  variant?: 'logout' | 'fav' | 'filter' | 'sortBreed' | 'sortLocation' | 'back' | 'match' | 'close' | 'login';
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  onClick = () => {},
  children,
  disabled = false,
  variant = 'fav',
  className = '',
  type = "button"
}) => {
  let baseClasses = "rounded transition-all duration-300 ease-in-out ";

  switch (variant) {
    case 'logout':
      baseClasses += "bg-red-500 text-white hover:bg-red-600 px-2 py-1";
      break;
    case 'fav':
      baseClasses += "bg-yellow-400 text-black hover:bg-yellow-500 px-2 py-2";
      break;
    case 'filter':
      baseClasses += "bg-white border-[1px] border-black text-gray-700 hover:bg-gray-300 px-3 py-2 flex items-center gap-1";
      break;
    case 'sortBreed':
      baseClasses += "bg-yellow-400 text-black hover:bg-yellow-500 px-2 py-1 text-xs";
      break;
    case 'sortLocation':
      baseClasses += "bg-yellow-400 text-black hover:bg-yellow-500 px-2 py-1 text-xs";
      break;
    case 'back':
      baseClasses += "bg-white border-[1px] border-black text-gray-700 hover:bg-gray-300 px-3 py-2 flex items-center gap-1";
      break;
    case 'match':
      baseClasses += "bg-yellow-400 text-black hover:bg-yellow-500 px-4 py-2";
      break;
    case 'close':
      baseClasses += "bg-red-500 text-white hover:bg-red-600 px-4 py-2";
      break;
    case 'login':
      baseClasses += "bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2";
      break;
    default:
      baseClasses += "bg-blue-500 text-white hover:bg-blue-600 px-4 py-2";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
