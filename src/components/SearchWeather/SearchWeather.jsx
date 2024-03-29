import { useEffect, useState } from 'react';
import { weatherAPI } from '../../api/weatherAPI';
import { capCity, moveToBeginning, citiesDB, tempIcon, humidityIcon, windIcon, lensIcon } from '../../helpers';
import { SearchHistory } from '../SearchHistory/SearchHistory';
import { Suggestions } from '../Suggestions/Suggestions';
import './SearchWeather.css';

export const SearchWeather = () => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);


  const handleKey = (event) => {
    if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSearch(suggestions[selectedIndex]);
        setCityName(suggestions[selectedIndex]);
      } else {
        handleSearch(cityName);
      }
      setSuggestions([]);
      event.preventDefault();
    } else {
      setSelectedIndex(-1);
    }
  };


  const handleInputChange = ( event ) => {
    setCityName( event.target.value );
    
    const matchingCities = citiesDB.filter( city =>
      city.toLowerCase().startsWith(event.target.value.toLowerCase())
    );
      
    setSuggestions(matchingCities.slice(0, 10));

    handleKey(event)
  };

  useEffect(() => {
    if (selectedIndex > -1 && selectedIndex < suggestions.length) {
      setCityName(suggestions[selectedIndex]);
    }
  }, [selectedIndex, suggestions]);
  

  

  const handleSearch = async ( cityName ) => {
    
    if(cityName.length <= 1) return;
    setIsLoading(true);
      
    weatherAPI(cityName).then( response => { 
      
      if(!response.ok) {
        setCityName('');
        setSearchDone(true);
        setIsLoading(false);
        setWeatherData({});
        return;
      }

      response.json().then( data => {
        
        const { name, main, wind } = data;
        const { temp, humidity } = main;
        setWeatherData({
          name,
          temp,
          humidity,
          windSpeed: wind.speed
        });
        

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
    })     

  };

  return (
    <div className='body-container'>


      <div className='input-container'>
        <div className='input-button'>
          <input 
            type="text" 
            value={cityName} 
            onChange={handleInputChange} 
            onKeyDown={handleKey}
            placeholder='Saber el tiempo en...'
          />
          <button onClick={() => handleHistoryClick(cityName)}>{ lensIcon }</button>
        </div>
        <Suggestions
          suggestions={suggestions} 
          setSuggestions={setSuggestions} 
          selectedIndex={selectedIndex}
          setCityName={setCityName}
          handleSearch={handleSearch}
        />
      </div>


      <div className='history-container'>
        <SearchHistory searchHistory={searchHistory} handleSearch={handleSearch} />
      </div>


        {
          isLoading ? (
          <div className='result-container'>
            <p>Buscando...</p>
          </div>
          ) 
          : null
        }

        {
          Object.keys(weatherData).length > 0 ? (
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
