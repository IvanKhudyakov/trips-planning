const { fetchWeatherData } = require('@atombrenner/openmeteo');
const axios = require('axios');


const getCityCoordinates = async (cityName) => {
    const baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';

    // Define your query parameters
    const params = {
        name: cityName,
        count: '1',
        language: 'en',
        format: 'json',
    };

    try {
        const response = await axios.get(baseUrl, { params });
        const cityDetails = response.data.results[0];
        if (cityDetails) {
            const locationData = {
                latitude: cityDetails.latitude,
                longitude: cityDetails.longitude
            };
            return locationData;
        } else {
            throw new BadRequestError('Please provide proper city name!');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const getWeatherData = async (cityName, tripDuration) => {

    const coordinates = await getCityCoordinates(cityName);

    const data = await fetchWeatherData({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        timezone: 'Europe/Berlin',
        forecast_days: tripDuration,
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "daylight_duration", "uv_index_max", "precipitation_sum"],
        current: ['apparent_temperature'],
    });

    const utcOffsetSeconds = data.utc_offset_seconds;

    const { time, weather_code, temperature_2m_max, temperature_2m_min, daylight_duration, uv_index_max, precipitation_sum } = data.daily;

    const dailyDetails = time.map((timestamp, index) => {

        const date = new Date((timestamp + utcOffsetSeconds) * 1000);

        return {
            date: date.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
            weatherCode: weather_code[index],
            temperatureMax: temperature_2m_max[index],
            temperatureMin: temperature_2m_min[index],
            daylightDuration: daylight_duration[index],
            uvIndexMax: uv_index_max[index],
            precipitationSum: precipitation_sum[index],
        };
    });

    return dailyDetails;
};

module.exports = { getWeatherData };