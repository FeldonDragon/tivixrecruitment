import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { NotificationContainer } from 'react-notifications';

import questionMark from '../assets/images/questionMark.png';
import WelcomePage from './welcomePage';
import ChooseMinifig from './chooseMinifig';
import ShipmentFormView from './shipmentForm';

const App = () => {
  return (
    <div className="App">
      <div className="mainDiv"></div>
        <img alt="questionMark1" src={questionMark} className="questionMark topLeft"/>
        <img alt="questionMark2" src={questionMark} className="questionMark rightBottom"/>
        <Router>
          <NotificationContainer /> {/* WARNING: This component causes warning 
            that is related to the package source code but it's working fine.*/}
          <Routes>
            <Route path="/" element={<WelcomePage />}/>
            <Route path="/choice" element={<ChooseMinifig />}/>
            <Route path="/shipment" element={<ShipmentFormView />}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
