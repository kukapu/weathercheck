import { API_TOKEN } from '../../env'


export const weatherAPI = (cityName) => fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_TOKEN}`)