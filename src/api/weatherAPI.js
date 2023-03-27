import { getEnvVariables } from "../helpers/getEnvVariables"

const { VITE_API_TOKEN } = getEnvVariables()


export const weatherAPI = (cityName) => fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${VITE_API_TOKEN}`)