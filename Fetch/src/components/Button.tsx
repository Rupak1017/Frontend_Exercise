// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  /**
   * Variant names:
   * - "logout": for the Logout button.
   * - "fav": for the Favorites button.
   * - "filter": for the Filter button in the nav.
   * - "sortBreed": for the sort buttons used for breed (e.g. A → Z).
   * - "sortLocation": for buttons used in location filtering (e.g. Apply/Clear in city filter).
   */
  variant?: 'logout' | 'fav' | 'filter' | 'sortBreed' | 'sortLocation';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'sortBreed',
  className = '',
}) => {
  // Base classes for smooth transitions and rounded corners.
  let baseClasses = "rounded transition-all duration-300 ease-in-out ";

  // Variant-specific classes
  switch (variant) {
    case 'logout':
      baseClasses += "bg-red-500 text-white hover:bg-red-600 px-4 py-2";
      break;
    case 'fav':
      baseClasses += "bg-blue-500 text-white hover:bg-blue-600 px-4 py-2";
      break;
    case 'filter':
      baseClasses += "bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-2 flex items-center gap-1";
      break;
    case 'sortBreed':
      baseClasses += "bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 text-xs";
      break;
    case 'sortLocation':
      baseClasses += "bg-gray-200 text-gray-700 hover:bg-gray-300 px-2 py-1 text-xs";
      break;
    default:
      baseClasses += "bg-blue-500 text-white hover:bg-blue-600 px-4 py-2";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
