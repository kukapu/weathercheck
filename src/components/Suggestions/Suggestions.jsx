import { useEffect, useRef } from 'react'

export const Suggestions = ({ suggestions, setSuggestions, selectedIndex, setCityName, handleSearch }) => {

  const wrapperRef = useRef(null)

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  }
  useEffect(() => {

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [wrapperRef]);

  const handleSuggestionClick = ( cityName ) => {
    setCityName( cityName )
    handleSearch( cityName )
    setSuggestions([])
  };


  return (
    <ul ref={wrapperRef} className='suggestions'>
      {suggestions.map((city, index) => (
        <li
          key={city}
          onClick={() => handleSuggestionClick(city)}
          className={index === selectedIndex ? 'selected' : ''}
        >
          {city}
        </li>
      ))}
    </ul>
  )
}
