//Type API response
interface MainWeather {
  temp_min: number;
  temp_max: number;
}

interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherCoord {
  lat: number;
  lon: number;
}

interface WeatherSys {
  sunrise: number;
  sunset: number;
}

interface WeatherWind {
  speed: number;
}

export interface WeatherItem {
  coord: WeatherCoord;
  dt: number;
  id: number;
  main: MainWeather;
  name: string;
  sys: WeatherSys;
  timezone: number;
  visibility: number;
  weather: WeatherDescription[];
  wind: WeatherWind;
}
