import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';

import Navbar from './Navbar/Navbar';
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const UsersCitiesPage = lazy(() => import('../pages/UsersCitiesPage/UsersCitiesPage'));
const DetailedPage = lazy(() => import('../pages/DetailedPage/DetailedPage'));

import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path='users-city' element={<UsersCitiesPage />} />
          <Route path='users-city/:cityName' element={<DetailedPage />} />   
        </Route>
      </Routes>
  );
}

export default App;
