import React, { useState, useEffect, useRef } from 'react';

interface BreedSearchBarProps {
  breeds: string[];
  onSelect: (breed: string) => void;
}

const BreedSearchBar: React.FC<BreedSearchBarProps> = ({ breeds, onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = breeds.filter(breed => breed.toLowerCase().includes(lowerQuery));
    setSuggestions(filtered.slice(0, 5));
  }, [query, breeds]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (breed: string) => {
    setQuery(breed);
    setShowDropdown(false);
    onSelect(breed);
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <div className="flex items-center border rounded overflow-hidden">
        <span className="px-2 text-gray-500">
          <i className="ri-search-line"></i>
        </span>
        <input
          type="text"
          className="w-full px-2 py-1 focus:outline-none"
          placeholder="Search by breed..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        {query && (
          <button onClick={clearInput} className="px-2 text-gray-500 focus:outline-none">
            ×
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
              {breed}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BreedSearchBar;
