document.addEventListener('DOMContentLoaded', function (){

    const errorMessage = document.getElementById('errorMessage')
    const getWeatherBtn = document.getElementById('searchBtn')
    const cityInput = document.getElementById('cityInput')
    const loadingData = document.getElementById('loading')
    const weatherDisplay = document.getElementById('weatherDisplay')
    const cityName = document.getElementById('cityName')
    const countryName = document.getElementById('countryName')
    const weatherIcon = document.getElementById('weatherIcon')
    const feelsLike = document.getElementById('feelsLike')
    const temperature = document.getElementById('temperature')
    const humidity = document.getElementById('humidity')
    const windSpeed = document.getElementById('windSpeed')
    const pressure = document.getElementById('pressure')
    const weatherType = document.getElementById('weatherType')

    const API_KEY = 'api key'

    const iconMap = {
        'Clear': { icon: '☀️', class: 'sunny' },
        'Clouds': { icon: '☁️', class: 'cloudy' },
        'Rain': { icon: '🌧️', class: 'rainy' },
        'Drizzle': { icon: '🌦️', class: 'rainy' },
        'Thunderstorm': { icon: '⛈️', class: 'stormy' },
        'Snow': { icon: '❄️', class: 'snowy' },
        'Mist': { icon: '🌫️', class: 'misty' },
        'Fog': { icon: '🌫️', class: 'misty' }
    };

    


    getWeatherBtn.addEventListener('click', getWeatherInfo)

    cityInput.addEventListener('keydown', function (e) {
        if(e.key === 'Enter'){
            e.preventDefault()
            getWeatherInfo()
        }
    })

    async function getWeatherInfo(){

        resetData()

        const city = cityInput.value.trim()

        if(!city) {
            showError('Please enter a city name.')
        }

        showLoading(true)

        try {
            const weatherData = await fetchWeatherData(city)

            displayWeatherData(weatherData)
        } catch (error) {
            showError(error.message)
        } finally{
            showLoading(false)
        }
       
    }


    async function fetchWeatherData(city){

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        const response = await fetch(url)
        
        

        if(!response.ok) {
            
            if(response.status === 404){
                throw new Error('City not found! Please check the spelling.')
            }
            else if (response.status === 401){
                throw new Error('Invalid API key.')
            }else{
                throw new Error('Something went wrong. Please try again.')
            }
            
        }

        const data = await response.json()
        return data
    }

    function displayWeatherData(data){

        
        const {name,sys,weather,main,wind} = data
        

        cityName.textContent = name
        countryName.textContent = sys.country
        weatherIcon.textContent = iconMap[weather[0].main].icon
        const className = iconMap[weather[0].main].class

        feelsLike.textContent = `${main.feels_like}°C`
        temperature.textContent = `${main.temp}°C`
        humidity.textContent = `${main.humidity}%`
        windSpeed.textContent = `${wind.speed} m/s`
        pressure.textContent = `${main.pressure} hPa`
        weatherIcon.className = `weather-icon ${className}`
        weatherType.textContent = weather[0].description

       
        errorMessage.classList.remove('show')
        weatherDisplay.classList.add('show')

    }


    function resetData(){
        cityName.textContent = ''
        countryName.textContent = ''
        weatherIcon.textContent = ''
        

        feelsLike.textContent = ''
        temperature.textContent = ''
        humidity.textContent = ''
        windSpeed.textContent = ''
        pressure.textContent = ''
        
        
        // weatherIcon.setAttribute('class', 'weather-icon')

        errorMessage.classList.remove('show')
        weatherDisplay.classList.remove('show')
        
    }

    function showError(message = 'City not found! Please check the spelling and try again.'){
        errorMessage.textContent = message
        weatherDisplay.classList.remove('show')
        loadingData.classList.remove('show')
        errorMessage.classList.add('show')
    }

    function showLoading(show){
        if(show){
            loadingData.classList.add('show')
            weatherDisplay.classList.remove('show')
            errorMessage.classList.remove('show')
        }
        else{
            loadingData.classList.remove('show')
        }
    }

})