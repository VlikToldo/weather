import { useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks-redux';
import { useLocation } from 'react-router-dom';

import WeatherCard from '../CityItem/CityItem';
import Loader from '../CustomLoader/CustomLoader';

import styles from './users-city-list.module.css';

const CitiesList = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const itemsUserCities = useAppSelector(
    state => state.weather.itemsUserCities
  );
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    itemsUserCities.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems(prevVisible => [...prevVisible, item.id]);
      }, index * 300);
    });
    setLoading(false);
  }, []);

  const filteredWeatherData = itemsUserCities.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const elements = filteredWeatherData.map(item => (
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
          placeholder="Search cities..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      {loading ? <Loader /> : <ul className={styles.citiesList}>{elements}</ul>}
    </>
  );
};

export default CitiesList;
