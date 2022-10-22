import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import minifigLego from '../assets/images/minifigLego.png';
import { renderSpinner, fetchAndDrawData, hpMinifigData } from '../utils/mainUtils'

const WelcomePage = () => {
  const navigate = useNavigate();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ isDataFetched, setIsDataFetched ] = useState([] as hpMinifigData[]);
  
  useEffect(() => {
    if (isDataFetched && isDataFetched.length > 0) navigate("/choice", {
      state: { hpMinifigsData: isDataFetched }
    });
  });

  return (
    <div className="welcomePageMainDiv">
      <div className="headerWelcome mx-1">
        <div className="d-flex justify-content-center minifigImgContainer">
          <img alt="minifig" src={minifigLego} className="minifigLegoHeader"/>
        </div>
        <h2 className="header200">LEGO MINIFIGS MYSTERY BOX</h2>
      </div>
      <div className="d-flex justify-content-center btnDiv">
        <button 
          className="btnBlue btnShadow"
          disabled={isLoading}
          onClick={() => { 
            setIsLoading(true);
            fetchAndDrawData((drawnData) => { 
              setIsLoading(false);
              if(typeof drawnData !== "boolean") setIsDataFetched(drawnData);
            });
            }}> {isLoading ? renderSpinner() : "LET'S GO!" } </button>
      </div>
    </div>
  );
}

export default WelcomePage;
