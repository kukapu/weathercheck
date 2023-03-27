
export const getEnvVariables = () => {
    
  
  return {
      ...import.meta.env,
      VITE_API_TOKEN: import.meta.env.VITE_API_TOKEN,
  }
}