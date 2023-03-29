import React from 'react'

export const SearchHistory = ({ searchHistory, handleSearch }) => {

  const handleHistoryClick = ( cityName ) => {
    handleSearch( cityName )
  };

  return (
    <ul>
      <li>Úlimas Busquedas:</li>
      {
        searchHistory.map((city) => {
          return (
            <li key={city}>
              <button onClick={() => handleHistoryClick(city)}>{city}</button>
            </li>
          )
        })
      }
    </ul>
  )
}
