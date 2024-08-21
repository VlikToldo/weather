import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCityWeather } from './weather-operations';

import { WeatherItem } from '../../shared/types/types';

interface ErrorResponse {
  message: string;
}

interface WeatherState {
  itemsCities: WeatherItem[];
  itemsUserCities: WeatherItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  itemsCities: [],
  itemsUserCities: [],
  isLoading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addUserCity: (store, action: PayloadAction<WeatherItem>) => {
      if (
        !store.itemsUserCities.some(item => item.name === action.payload.name)
      ) {
        store.itemsUserCities.push(action.payload);
      }
    },
    removeUserCity: (store, action: PayloadAction<string>) => {
      store.itemsUserCities = store.itemsUserCities.filter(
        item => item.name !== action.payload
      );
    },
    updateCity: (store, action: PayloadAction<WeatherItem>) => {
      const cityIndex = store.itemsCities.findIndex(
        item => item.name === action.payload.name
      );
      if (cityIndex !== -1) {
        store.itemsCities[cityIndex] = action.payload;
      }

      const userCityIndex = store.itemsUserCities.findIndex(
        item => item.name === action.payload.name
      );
      if (userCityIndex !== -1) {
        store.itemsUserCities[userCityIndex] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCityWeather.pending, store => {
        store.isLoading = true;
      })
      .addCase(
        getCityWeather.fulfilled,
        (store, action: PayloadAction<WeatherItem>) => {
          store.isLoading = false;
          if (
            !store.itemsCities.some(item => item.name === action.payload.name)
          ) {
            store.itemsCities.push(action.payload);
          }
        }
      )
      .addCase(
        getCityWeather.rejected,
        (store, action: PayloadAction<ErrorResponse | undefined>) => {
          store.isLoading = false;
          store.error = action.payload
            ? action.payload.message
            : 'Unknown error occurred';
        }
      );
  },
});

export const { addUserCity, removeUserCity, updateCity } = weatherSlice.actions;

export default weatherSlice.reducer;
