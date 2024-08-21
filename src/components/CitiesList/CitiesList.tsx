import { useState, useEffect } from 'react';
import { getCityWeather } from '../../redux/weather/weather-operations';
import { getCityWeatherApi } from '../../shared/api/weather-api';
import { useAppDispatch, useAppSelector } from '../../redux/hooks-redux';
import { useLocation } from 'react-router-dom';

import WeatherCard from '../CityItem/CityItem';
import Loader from '../CustomLoader/CustomLoader';

import { WeatherItem } from '../../shared/types/types';

import styles from './cities-list.module.css';

const CitiesList = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const dispatch = useAppDispatch();
  const itemsCities = useAppSelector(state => state.weather.itemsCities);
  const location = useLocation();

  const cities: string[] = [
    'Kyiv',
    'Lviv',
    'Odesa',
    'Kharkiv',
    'Dnipro',
    'Zaporizhzhia',
    'Mykolaiv',
    'Ivano-Frankivsk',
    'Chernihiv',
    'Poltava',
  ];

  useEffect(() => {
    const fetchAllWeather = async () => {
      try {
        setLoading(true);

        if (itemsCities.length === 0) {
          const weatherPromises = cities.map(async city => {
            try {
              return await dispatch(getCityWeather(city)).unwrap();
            } catch (error) {
              console.error(`Error fetching weather for city ${city}:`, error);
              return null;
            }
          });

          const results = await Promise.all(weatherPromises);

          const validResults = results.filter(
            (result): result is WeatherItem => result !== null
          );

          setWeatherData(prevItems => [
            ...prevItems,
            ...validResults.filter(
              item =>
                !prevItems.some(existingItem => existingItem.name === item.name)
            ),
          ]);

          validResults.forEach((item, index) => {
            setTimeout(() => {
              setVisibleItems(prevVisible => [...prevVisible, item.id]);
            }, index * 300);
          });
        } else {
          // If data already exist in Redux
          setWeatherData(prevItems => [
            ...prevItems,
            ...itemsCities.filter(
              item =>
                !prevItems.some(existingItem => existingItem.name === item.name)
            ),
          ]);

          itemsCities.forEach((item, index) => {
            setTimeout(() => {
              setVisibleItems(prevVisible => [...prevVisible, item.id]);
            }, index * 300);
          });
        }
      } catch (error) {
        console.error('Error fetching weather for cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWeather();
  }, []);

  useEffect(() => {
    const fetchWeatherForSearch = async () => {
      if (searchQuery.trim() === '') return;

      setLoading(true);
      try {
        const response = await getCityWeatherApi(searchQuery);
        const data = response as unknown as WeatherItem;

        if (data) {
          setWeatherData([data]);
          setVisibleItems([data.id]);
        } else {
          setWeatherData([...itemsCities]);
          itemsCities.forEach((item, index) => {
            setTimeout(() => {
              setVisibleItems(prevVisible => [...prevVisible, item.id]);
            }, index * 300);
          });
        }
      } catch (error) {
        console.error(`Error fetching weather for city ${searchQuery}:`, error);
        setWeatherData([...itemsCities]);
        itemsCities.forEach((item, index) => {
          setTimeout(() => {
            setVisibleItems(prevVisible => [...prevVisible, item.id]);
          }, index * 300);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForSearch();
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const elements = weatherData.map(item => (
    <WeatherCard
      className={`${styles.citiesItem} ${visibleItems.includes(item.id) ? styles.show : ''}`}
      item={item}
      location={location}
      key={item.id}
    />
  ));

  return (
    <>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search for a city by full name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      {weatherData.length === 0 ? (
        <Loader />
      ) : (
        <ul className={styles.citiesList}>{elements}</ul>
      )}
    </>
  );
};

export default CitiesList;
