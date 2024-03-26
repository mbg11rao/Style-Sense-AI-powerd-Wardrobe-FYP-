// In a new file, e.g., MainPage.js

import React from 'react';
import Home from './sections/Home';
import About from './sections/About';
import Showcase from './sections/Showcase';
import Team from './sections/Team';

const MainPage = () => {
  return (
    <div>
      <Home />
      <Team />
      <About />
      <Showcase />
    </div>
  );
};

export default MainPage;
