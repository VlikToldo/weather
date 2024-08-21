import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Loader from '../CustomLoader/CustomLoader';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../redux/hooks-redux';
import { getCityWeatherApi } from '../../shared/api/weather-api';
import { addUserCity, removeUserCity, updateCity } from '../../redux/weather/weather-slice';
import { WeatherItem } from '../../shared/types/types';

import styles from './city-item.module.css';

interface WeatherCardProps {
  className: string;
  item: WeatherItem;
  location: {
    pathname: string;
  };
}

const WeatherCard = ({ className, item, location }: WeatherCardProps) => {
  const [info, setInfo] = useState<WeatherItem>(item);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const itemsUserCities = useAppSelector(
    state => state.weather.itemsUserCities
  );
  const isInUserList = itemsUserCities.some(userCity => userCity.name === item.name);

  const kelvinToCelsius = (kelvin: number) => {
    const result = kelvin - 273.15;
    return result >= 0 ? `+${result.toFixed(0)}` : `-${result.toFixed(0)}`;
  };

  const convertTimestampToTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const fetchWeather = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      setLoading(true);
      const response = await getCityWeatherApi(info.name);
      const data = response as unknown as WeatherItem;
      dispatch(updateCity(data));
      setInfo(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setInterval(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleAddToList = (event: React.MouseEvent) => {
    dispatch(addUserCity(item));
  };

  const handleRemoveFromList = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(removeUserCity(item.name));
  };

  return (
    <li className={className}>
      {!loading ? (
        <Link
          to={`/users-city/${item.name}`}
          state={{ from: location }}
          className={styles.link}
        >
          <Card sx={{ minWidth: 275, width: '100%' }}>
            <>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {info.name} {convertTimestampToTime(info.dt)}
                </Typography>
                <Typography variant="h5" component="div">
                  {kelvinToCelsius(info.main.temp_min)}{' '}
                  {kelvinToCelsius(info.main.temp_max)}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Sunrise {convertTimestampToTime(info.sys.sunrise)} - Sunset{' '}
                  {convertTimestampToTime(info.sys.sunset)}
                </Typography>
                <Typography variant="body2">
                  {info.weather[0].description}
                  <br />
                </Typography>
              </CardContent>
              <div className={styles.wrapperCardsButton}>
                <CardActions>
                  <Button size="small" onClick={fetchWeather}>
                    UPDATE
                  </Button>
                </CardActions>
                <CardActions>
                  {!isInUserList ? (
                    <Button size="small" onClick={handleAddToList}>
                      ADD MY LIST
                    </Button>
                  ) : (
                    <Button size="small" onClick={handleRemoveFromList}>
                      REMOVE FROM MY LIST
                    </Button>
                  )}
                </CardActions>
              </div>
            </>
          </Card>
        </Link>
      ) : (
        <Loader />
      )}
    </li>
  );
};

export default WeatherCard;
