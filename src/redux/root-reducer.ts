import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import weatherSlice from './weather/weather-slice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  weather: weatherSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default persistedReducer;