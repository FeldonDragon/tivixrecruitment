import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { renderSpinner } from '../utils/mainUtils'

const ChooseMinifig = () => {
  const location = useLocation();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ tileSelected, setTileSelected ] = useState(0);

  console.log("location.state: ", location.state?.hpMinifigsData);
  
  return (
    <div>
      <div className="d-flex justify-content-center headerContainer">
        <h2 className="header100">CHOOSE YOUR MINIFIG</h2>
      </div>
      <div className="d-flex flex-row justify-content-center minifigTiles">
        <div className={`mx-4 minifigTile pointer ${tileSelected === 1 && "selectedTile"}`} 
          onClick={() => { setTileSelected(1) }}></div>
        <div className={`mx-4 minifigTile pointer ${tileSelected === 2 && "selectedTile"}`} 
          onClick={() => { setTileSelected(2) }}></div>
        <div className={`mx-4 minifigTile pointer ${tileSelected === 3 && "selectedTile"}`} 
          onClick={() => { setTileSelected(3) }}></div>
      </div>
      <div className="d-flex justify-content-center btnDiv">
        <button 
          className="btnBlue btnShadow"
          disabled={tileSelected === 0}
          onClick={() => { 
            console.log();
          }}> {isLoading ? renderSpinner() : "PROCEED TO SHIPMENT" } </button>
      </div>
    </div>
  );
}

export default ChooseMinifig;
