import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../shared/api/weather-api';

import { WeatherItem } from '../../shared/types/types';

interface ErrorResponse {
  message: string;
}

export const getCityWeather = createAsyncThunk<
WeatherItem,
  string,
  { rejectValue: ErrorResponse }
>('weather/city', async (city: string, thunkAPI) => {
  try {
    const data = await api.getCityWeatherApi(city);
    return data as unknown as WeatherItem;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      message: error?.response?.data?.message || 'Unknown error',
    });
  }
});
