# WeatherCheck

Para ejecutar el proyecto.

Primero de todo tienes que tener instalado node. Lo puedes descargar desde el siguiente [link](https://nodejs.org/es/). Instalar mejor la version LTS.

Descargar el repositorio y descomprimirlo.

Como se usa una variable en enterno para ejecutarlo en local tendremos que añadirla, para ello crea un archivo en la raiz del proyecto .env y añade la siguiente linea (Puedes usar tu propia apikey de OpenWeather):

~~~
VITE_API_TOKEN = 19cb26090c02a4d348657c710f5d748e
~~~

Una vez tienes el proyecto descargado abres una terminal dentro del directorio y ejecutas los siguientes comandos:

~~~
npm install
npm run dev
~~~

Al ejecutar el último comando podras acceder a un enlace donde el proyecto se ejecuta de forma local.

Tambien dejó el proyecto subido en netlify [aquí](https://weathercheckkukapu.netlify.app/)
