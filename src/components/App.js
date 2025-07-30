import React, { useState, useEffect, useCallback } from 'react';

const AutoComplete = () => {
  const fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig"];
  
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Async function to filter suggestions
  const filterSuggestions = useCallback((query) => {
    return new Promise((resolve) => {
      // Simulate async operation with setTimeout
      setTimeout(() => {
        if (query.length === 0) {
          resolve([]);
          return;
        }
        
        const filtered = fruits.filter(fruit =>
          fruit.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 100); // Small delay to simulate async processing
    });
  }, []);

  // Effect to handle input changes and update suggestions asynchronously
  useEffect(() => {
    const updateSuggestions = async () => {
      if (inputValue.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const filtered = await filterSuggestions(inputValue);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch (error) {
        console.error('Error filtering suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the async operation
    const timeoutId = setTimeout(updateSuggestions, 200);
    
    return () => clearTimeout(timeoutId);
  }, [inputValue, filterSuggestions]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Fruit Autocomplete
      </h1>
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Type to search fruits..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-800 capitalize">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
        
        {inputValue && !isLoading && suggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-lg mt-1 shadow-lg z-10">
            <div className="px-4 py-3 text-gray-500 text-center">
              No fruits found matching "{inputValue}"
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Available fruits: {fruits.join(', ')}</p>
      </div>
    </div>
  );
};

export default AutoComplete;
