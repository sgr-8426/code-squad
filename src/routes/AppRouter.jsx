import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import UserProfilePage from '../pages/UserProfilePage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/user-profile' element={<UserProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;