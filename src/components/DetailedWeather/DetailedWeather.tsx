import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Loader from '../CustomLoader/CustomLoader';

import { getCityWeatherApi } from '../../shared/api/weather-api';
import { WeatherItem } from '../../shared/types/types';

const WeatherPage = () => {
  const [info, setInfo] = useState<WeatherItem | null>(null);
  const { cityName } = useParams<{ cityName?: string }>();

  useEffect(() => {
    if (!cityName) return;

    const fetchWeather = async (city: string) => {
      try {
        const response = await getCityWeatherApi(city);

        const data = response as unknown as WeatherItem;
        setInfo(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
      }
    };
    fetchWeather(cityName);
  }, [cityName]);

  const kelvinToCelsius = (kelvin: number) => {
    const result = kelvin - 273;
    return result >= 0 ? `+${result.toFixed(0)}` : `-${result.toFixed(0)}`;
  };

  const convertTimestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const convertTimestampToTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <>
      {info ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                {info.name.toUpperCase()}  ({convertTimestampToDate(info.dt)})
              </Typography>
              <Typography variant="h6" component="div" gutterBottom>
                Temperature
              </Typography>
              <Typography variant="body1">
                Min: {kelvinToCelsius(info.main.temp_min)}°C
              </Typography>
              <Typography variant="body1">
                Max: {kelvinToCelsius(info.main.temp_max)}°C
              </Typography>
              <Typography variant="h6" component="div" gutterBottom>
                Sunrise & Sunset
              </Typography>
              <Typography variant="body1">
                Sunrise: {convertTimestampToTime(info.sys.sunrise)}
              </Typography>
              <Typography variant="body1">
                Sunset: {convertTimestampToTime(info.sys.sunset)}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
              ></Typography>
              <Typography variant="body1"></Typography>
              <Typography variant="h6" component="div" gutterBottom>
                Coordinates & Wind
              </Typography>
              <Typography variant="body1">
                Latitude: {info.coord.lat.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Longitude: {info.coord.lon.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Wind Speed: {info.wind.speed} m/s
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Loader/>
      )}
    </>
  );
};

export default WeatherPage;
