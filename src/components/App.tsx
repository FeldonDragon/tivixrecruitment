import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import questionMark from '../assets/images/questionMark.png';
import WelcomePage from './welcomePage';
import ChooseMinifig from './chooseMinifig';
import ShipmentForm from './shipmentForm';

const App = () => {
  return (
    <div className="App">
      <div className="mainDiv"></div>
        <img alt="questionMark1" src={questionMark} className="questionMark topLeft"/>
        <img alt="questionMark2" src={questionMark} className="questionMark rightBottom"/>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />}/>
            <Route path="/choice" element={<ChooseMinifig />}/>
            <Route path="/shipment" element={<ShipmentForm />}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
