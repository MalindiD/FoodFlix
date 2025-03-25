import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './routes/Home'; 

function App() {
  return (
    <Router> 
      <Navbar />  
      
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />  
        </Routes>
      </div>
      
      <Footer />  
    </Router>
  );
}

export default App;
