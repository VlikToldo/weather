import axios, { AxiosResponse } from 'axios';
import { WeatherItem } from '../types/types';

const API_KEY = 'ff3d82ecae2dfef983bd68aa3135ea9e';
const COMMON_URL = `https://api.openweathermap.org/data/2.5/weather?lang=en`;

export const getCityWeatherApi = async (
  city: string
): Promise<AxiosResponse<WeatherItem>> => {
  const { data } = await axios.get<any>(
    `${COMMON_URL}&q=${city}&appid=${API_KEY}`
  );

  return data;
};
