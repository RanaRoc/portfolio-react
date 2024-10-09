// src/App.js
import React, { useEffect } from 'react';
import Browser from './Browser';


function App() {
  useEffect(() => {
    document.title = "Rana Rochdi's Portfolio"; // Change this to whatever you want as the tab title
  }, []);
  return (
  <div className="App">
      <Browser />
    </div>
  );

}

export default App;
