import React, { useState, useEffect, useRef } from 'react';

// Define the props for the BreedSearchBar component
interface BreedSearchBarProps {
  breeds: string[];
  onSelect: (breed: string) => void;
}

// Main component function
const BreedSearchBar: React.FC<BreedSearchBarProps> = ({ breeds, onSelect }) => {
  // State to hold the current query input by the user
  const [query, setQuery] = useState('');
  // State to hold the list of suggestions based on the query
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // State to control the visibility of the dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  // Ref to detect clicks outside the component
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Effect to update suggestions when the query changes
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = breeds.filter(breed => breed.toLowerCase().includes(lowerQuery));
    setSuggestions(filtered.slice(0, 5)); // Limit suggestions to top 5
  }, [query, breeds]);

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to handle the selection of a breed from the suggestions
  const handleSelect = (breed: string) => {
    setQuery(breed);
    setShowDropdown(false);
    onSelect(breed); // Call the onSelect prop with the selected breed
  };

  // Function to clear the input field and suggestions
  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    // Wrapper div with a ref to detect outside clicks
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <div className="flex items-center border rounded overflow-hidden">
        <span className="px-2 text-gray-500">
          <i className="ri-search-line"></i> {/* Search icon */}
        </span>
        <input
          type="text"
          className="w-full px-2 py-1 focus:outline-none"
          placeholder="Search by breed..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true); // Show dropdown when user types
          }}
          onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
        />
        {query && (
          <button onClick={clearInput} className="px-2 text-gray-500 focus:outline-none">
            × {/* Clear input button */}
          </button>
        )}
      </div>
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-auto">
          {suggestions.map((breed, index) => (
            <li
              key={index}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(breed)}
            >
              {breed} {/* Display each suggestion */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BreedSearchBar;
