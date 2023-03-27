import { useEffect, useRef, useState } from 'react';
import { weatherAPI } from '../api/weatherAPI';
import { capCity, moveToBeginning, citiesDB, tempIcon, humidityIcon, windIcon, lensIcon } from '../helpers';
import './SearchWeather.css'

export const SearchWeather = () => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([])
  const [searchDone, setSearchDone] = useState(false)

  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = ( event ) => {
    setCityName( event.target.value );
    if (event.key === 'Enter') {
      handleSearch( cityName );
      event.preventDefault();
    }

    const matchingCities = citiesDB.filter( city =>
      city.toLowerCase().startsWith(event.target.value.toLowerCase())
    );
  
    setSuggestions(matchingCities.slice(0, 10))
  };

  const handleSearch = async ( cityName ) => {
    
    if(cityName.length <= 1) return
    setIsLoading(true)
      
    weatherAPI(cityName).then( response => { 
      
      if(!response.ok) {
        setCityName('')
        setSearchDone(true)
        setIsLoading(false)
        setWeatherData({})
        return
      }
  
      if(response.ok) {
        response.json().then( data => {
          
          const { name, main, wind } = data
          const { temp, humidity } = main
          setWeatherData({
            name,
            temp,
            humidity,
            windSpeed: wind.speed
          })
          
  
          if(searchHistory.includes(capCity(cityName))){
            moveToBeginning(searchHistory, capCity(cityName))
            setCityName('')
            return
          }
          if(searchHistory.length === 5) {
            searchHistory.pop()
          }
            
          setSearchHistory([
            capCity(cityName),
            ...searchHistory,
          ])
        })
        .catch( error => {
          console.log(error)
          setIsLoading(false)
        })
        .finally(() => {
          setIsLoading(false)
          setCityName('')
        })
    }})     

  };

  const handleHistoryClick = ( cityName ) => {
    handleSearch( cityName )
  };

  const handleSuggestionClick = ( cityName ) => {
    setCityName( cityName )
    handleSearch( cityName )
    setSuggestions([])
  };

  return (
    <div className='body-container'>


      <div className='input-container'>
        <div className='input-button'>
          <input 
            type="text" 
            value={cityName} 
            onChange={handleInputChange} 
            onKeyPress={handleInputChange}
            placeholder='Saber el tiempo en...'
          />
          <button onClick={() => handleHistoryClick(cityName)}>{ lensIcon }</button>
        </div>
        <ul ref={wrapperRef} className='suggestions'>
          {suggestions.map((city) => (
            <li key={city} onClick={() => handleSuggestionClick(city)}>
              {city}
            </li>
          ))}
        </ul>
      </div>


      <div className='history-container'>
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
      </div>


        {isLoading ? (
          <div className='result-container'>
            <p>Buscando...</p>
          </div>
        ) : Object.keys(weatherData).length > 0 ? (
          <div className='result-container'>
            <h3>Tiempo en {weatherData.name}</h3>
            <div className='result-items-container'>
              <p className='temp'><span>{tempIcon}</span>Temperatura: {Math.round(weatherData.temp)}°C</p>
              <p className='humi'><span>{humidityIcon}</span>Humedad: {weatherData.humidity}%</p>
              <p className='wind'><span>{windIcon}</span>Viento: {Math.round(weatherData.windSpeed)}m/s</p>
            </div>
          </div>
        ) : (
          (searchDone) 
            ? <div className='result-container'> No se encontró la ciudad </div>
            : null
        )}
        
      
      
    </div>
  );
};
