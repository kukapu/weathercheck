import { useState } from 'react';
import { weatherAPI } from '../api/weatherAPI';
import { capCity, moveToBeginning } from '../helpers';
import './SearchWeather.css'

export const SearchWeather = () => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = ( event ) => {
    setCityName( event.target.value );
    if (event.key === 'Enter') {
      handleSearch( cityName );
      event.preventDefault();
    }
  };

  const handleSearch = async ( cityName ) => {
    
    if(cityName.length <= 1) return
    setIsLoading(true)

    try {
      
      const response = await weatherAPI(cityName)
      if(!response.ok) {
        setIsLoading(false)
        setWeatherData({})
        return
      }
 
      if(response.ok) {
        const { name, main, wind } = await response.json()
        const { temp, humidity } = main
        setWeatherData({
          name,
          temp,
          humidity,
          windSpeed: wind.speed
        })
        setIsLoading(false)

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
      }  

      setCityName('')

    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }

    
  };

  const handleHistoryClick = ( cityName ) => {
    handleSearch( cityName )
  };


  return (
    <div className='body-container'>
      <h2>Mirar Tiempo</h2>
      <div>

        <input 
          type="text" 
          value={cityName} 
          onChange={handleInputChange} 
          onKeyPress={handleInputChange}
          placeholder='Tiempo en...'
        />
        <button onClick={() => handleHistoryClick(cityName)}>Search</button>
      </div>

      <div>
        <h3>Úlimas Busquedas: </h3>
        <ul>
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
        <div>
          <p>Buscando...</p>
        </div>
      ) : Object.keys(weatherData).length > 0 ? (
        <div>
          <h3>{weatherData.name}</h3>
          <p>{Math.round(weatherData.temp)}°C</p>
          <p>{weatherData.humidity}%</p>
          <p>{Math.round(weatherData.windSpeed)}m/s</p>
        </div>
      ) : (
        <div> No se encontro la ciudad </div>
      )}
      
      
      
    </div>
  );
};
