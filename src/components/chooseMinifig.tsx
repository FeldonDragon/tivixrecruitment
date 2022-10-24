import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { renderSpinner, hpMinifigData, fetchPartsByMinifigId, 
  hpMinifigPartData, NO_IMG_FILLER } from '../utils/mainUtils';
import CustomModal from './customModal';

const minifigChoiceTile = (
  tileId: number, 
  tileSelected: number, 
  setTileSelected: (tile: number) => void,
  minifigData: hpMinifigData[],
  openDetailsModal: (minifig: hpMinifigData) => void ) => {

  const renderImgFromData = () => {
    const urlImgString = minifigData[tileId-1].set_img_url;
    const imgSrc = urlImgString ? urlImgString : NO_IMG_FILLER;
    return <img alt={minifigData[tileId-1].set_num} src={imgSrc}/>
  }

  const createNameString = () => {
    const nameString = minifigData[tileId-1].name;
    const indexOfCommaInName = nameString.indexOf(",");
    return indexOfCommaInName > 0 ? nameString.slice(0, indexOfCommaInName) : nameString;
  }

  return (
    <div key={tileId} className={`d-flex justify-content-center mx-4 minifigTile pointer 
      ${tileSelected === tileId && "selectedTile"}`} 
      onClick={() => { setTileSelected(tileId) }}>
        <div className="d-flex flex-column justify-content-center align-items-center minifigTileContent">
          <div className="minifigImg">{renderImgFromData()}</div>
          <div className="minifigNameLabel">{createNameString()}</div>
          <div className="mt-3 showDetailsLink"
            onClick={ () => openDetailsModal(minifigData[tileId-1]) }>Show details</div>
        </div>
    </div>
  );
};

const createDetailsModalBody = (minifigData: hpMinifigData) => {

  const textItem = (fieldName: string, fieldValue: string | number) => {
    return (
      <div className="row">
        <div className="col-3">
          <div className="fw-600">{`${fieldName}:`}</div>
        </div>
        <div className="col d-flex align-items-end">
          {fieldValue}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row changeToCol">
        <div className="col-5 d-flex justify-content-center imgCol borderRightLine">
          <div className="minifigImgModal">
            <img alt={minifigData.set_num} src={minifigData.set_img_url || NO_IMG_FILLER}/>
          </div>
        </div>
        <div className="col d-flex align-items-center px-5 borderLeftLine">
          <div className="d-flex flex-column justify-content-center w-100">
            {textItem("Full name", minifigData.name)}
            {textItem("Minifig ID", minifigData.set_num)}
            {textItem("Parts amount", minifigData.num_parts)}
            {textItem("Last modified", dayjs(new Date(minifigData.last_modified_dt)).format('DD-MM-YYYY'))}
            <div className="mt-5">
              <a className="showDetailsLink" href={minifigData.set_url} target="_blank" rel="noreferrer">
                More details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChooseMinifig = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ tileSelected, setTileSelected ] = useState(0);
  const [ modalIsOpen, setModalIsOpen ] = React.useState(false);
  const [ modalHeader, setModalHeader ] = React.useState("");
  const [ modalBody, setModalBody ] = React.useState(<div></div>);
  const [ fetchedParts, setFetchedParts ] = React.useState([] as hpMinifigPartData[]);
  const [ isPartsFetched, setIsPartsFetched ] = React.useState(false);

  const minifigData = location.state?.hpMinifigsData;

  useEffect(() => {
    if (isPartsFetched) navigate("/shipment", {
      state: { 
        hpMinifigsPartsData: fetchedParts,
        selectedMinifig: minifigData[tileSelected-1]
      }
    });
  });

  const openModal = (minifigData: hpMinifigData) => { 
    const indexOfCommaInName = minifigData.name.indexOf(",");

    setModalBody(createDetailsModalBody(minifigData));
    setModalHeader(
      indexOfCommaInName > 0 ? minifigData.name.slice(0, indexOfCommaInName) : minifigData.name
    );
    setModalIsOpen(true); 
  };
  const closeModal = () => { setModalIsOpen(false); };

  const loopForTiles = () => {
    const returnTiles = [] as JSX.Element[];
    if (minifigData) {
      for(let i = 0; i < minifigData.length; i++) {
        returnTiles.push(
          minifigChoiceTile(i+1, tileSelected, setTileSelected, minifigData, (arg) => openModal(arg))
        );
      }
    }
    return returnTiles;
  };

  return (
    <div>
      <div className="d-flex justify-content-center headerContainer">
        <h2 className="header100">CHOOSE YOUR MINIFIG</h2>
      </div>
      <div className="d-flex flex-row justify-content-center minifigTiles">
        { loopForTiles() }
      </div>
      <div className="d-flex justify-content-center btnDiv">
        <button 
          className="btnBlue btnShadow"
          disabled={tileSelected === 0 || isLoading}
          onClick={() => { 
            setIsLoading(true);
            const chosenMinifig = minifigData[tileSelected-1];
            fetchPartsByMinifigId(chosenMinifig.set_num, (partsData) => {
              setIsLoading(false);
              if(typeof partsData !== "boolean") {
                  setFetchedParts(partsData);
                  setIsPartsFetched(true);
              };
            });
          }}> {isLoading ? renderSpinner() : "PROCEED TO SHIPMENT" } </button>
      </div>
      {CustomModal(modalIsOpen, closeModal, modalHeader, modalBody, "", "", "btnBlue btnShadow")}
    </div>
  );
}

export default ChooseMinifig;
