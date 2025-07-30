import React, { useState, useEffect } from 'react';

const AutoComplete = () => {
  const fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig"];
  
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Async function to filter suggestions
  const filterSuggestions = function(query) {
    return new Promise(function(resolve) {
      // Simulate async operation with setTimeout
      setTimeout(function() {
        if (query.length === 0) {
          resolve([]);
          return;
        }
        
        const filtered = fruits.filter(function(fruit) {
          return fruit.toLowerCase().includes(query.toLowerCase());
        });
        resolve(filtered);
      }, 100); // Small delay to simulate async processing
    });
  };

  // Effect to handle input changes and update suggestions asynchronously
  useEffect(function() {
    const updateSuggestions = function() {
      if (inputValue.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      filterSuggestions(inputValue)
        .then(function(filtered) {
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
          setIsLoading(false);
        })
        .catch(function(error) {
          console.error('Error filtering suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
          setIsLoading(false);
        });
    };

    // Debounce the async operation
    const timeoutId = setTimeout(updateSuggestions, 200);
    
    return function() {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  const handleInputChange = function(e) {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = function(suggestion) {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = function() {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = function() {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(function() {
      setShowSuggestions(false);
    }, 150);
  };

  return React.createElement('div', {
    className: 'max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg'
  }, [
    React.createElement('h1', {
      key: 'title',
      className: 'text-2xl font-bold text-gray-800 mb-6 text-center'
    }, 'Fruit Autocomplete'),
    
    React.createElement('div', {
      key: 'container',
      className: 'relative'
    }, [
      React.createElement('input', {
        key: 'input',
        type: 'text',
        value: inputValue,
        onChange: handleInputChange,
        onFocus: handleInputFocus,
        onBlur: handleInputBlur,
        placeholder: 'Type to search fruits...',
        className: 'w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors'
      }),
      
      isLoading && React.createElement('div', {
        key: 'loading',
        className: 'absolute right-3 top-1/2 transform -translate-y-1/2'
      }, React.createElement('div', {
        className: 'animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500'
      })),
      
      React.createElement('ul', {
        key: 'suggestions-container',
        className: showSuggestions || (inputValue && !isLoading && suggestions.length === 0) 
          ? 'absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto list-none'
          : 'absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto list-none hidden'
      }, suggestions.length > 0 ? suggestions.map(function(suggestion, index) {
        return React.createElement('li', {
          key: index,
          onClick: function() { handleSuggestionClick(suggestion); },
          className: 'px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0'
        }, React.createElement('span', {
          className: 'text-gray-800 capitalize'
        }, suggestion));
      }) : inputValue && !isLoading && suggestions.length === 0 ? [React.createElement('li', {
        key: 'no-results',
        className: 'px-4 py-3 text-gray-500 text-center'
      }, 'No fruits found matching "' + inputValue + '"')] : [React.createElement('li', {
        key: 'default-item',
        className: 'px-4 py-3 text-gray-400 text-center'
      }, 'Start typing to see suggestions...')]),
    ]),
    
    React.createElement('div', {
      key: 'info',
      className: 'mt-4 text-sm text-gray-600'
    }, React.createElement('p', null, 'Available fruits: ' + fruits.join(', ')))
  ]);
};

export default AutoComplete;
