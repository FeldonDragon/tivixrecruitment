import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm  } from 'react-hook-form';
import { NotificationManager } from 'react-notifications';

import { 
  hpMinifigPartData, 
  hpMinifigData, 
  userFormData, 
  NO_IMG_FILLER, 
  postOrderData,
  renderSpinner } from '../utils/mainUtils';

const renderPartsList = (partsData: hpMinifigPartData[]) => {
  const partImgSize = 50;
  const returnJSXElements = [] as JSX.Element[];

  partsData.forEach((part, key) => {
    returnJSXElements.push(
      <div key={key} className="row mb-3">
        <div className="col-3 d-flex justify-content-center align-items-center partImgParent">
          <img alt={part.part.part_num} src={part.part.part_img_url} width={partImgSize} height={partImgSize}/>
        </div>
        <div className="col">
          <div className="row">
            {part.part.name}
          </div>
          <div className="row goldFont">
            {part.part.part_num}
          </div>
        </div>
      </div>
    );
  });

  return returnJSXElements;
};

const renderSummaryContent = (
  minifig: hpMinifigData, 
  partsData: hpMinifigPartData[], 
  isValid: boolean,
  setSubmitClicked: (isClicked: boolean) => void,
  isLoading: boolean) => {

  const renderImgFromData = () => {
    const urlImgString = minifig?.set_img_url;
    const imgSrc = urlImgString ? urlImgString : NO_IMG_FILLER;
    return <img alt={minifig?.set_num} src={imgSrc}/>
  }

  return minifig ? (
    <div className="d-flex flex-column summaryContent">
      <div className="mx-5">
        <div className="summaryHeaderContainer mb-4">
          <h2 className="header100">SUMMARY</h2>
        </div>
        <div className="summaryContentNoHeader">
          <div className="d-flex flex-column align-items-center">
            <div className="summaryImg px-5">
              {renderImgFromData()}
            </div>
            <div className="summaryMinifigName mb-3">
              {minifig.name}
            </div>
          </div>
          <div className="summaryPartsLabel my-4">
            {`There are ${partsData.length} parts in this minifig:`}
          </div>
          <div className="summaryPartsList">
            {renderPartsList(partsData)}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-end fillContentHeight mb-5">
        <button 
          className="btnBlue btnNoShadow"
          form="shippingFormId"
          type="submit"
          disabled={!isValid || isLoading}
          onClick={() => { 
            setSubmitClicked(true); 
            }}> {isLoading ? renderSpinner() : "SUBMIT"} </button>
      </div>
    </div>
  ) : null;
};

const renderShippingForm = (
  register, 
  handleSubmit, 
  errors, 
  setShipmentUserData: (userData: userFormData) => void,
  setIsLoading: (setLoading: boolean)=> void) => {

  const regExes = {
    phone: new RegExp('^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$'), // eslint-disable-line
    email: new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'), // eslint-disable-line
    zipCode: new RegExp('^[0-9]{5}(?:-[0-9]{4})?$') // eslint-disable-line
  };
  const inputWithValidation = (
    inputType: string, 
    inputPlaceholder: string, 
    labelValue: string, 
    name: string, 
    minLeng?: number,
    regExPattern?: RegExp) => {

    return (
      <div>
        <div className="row formLabelContainer mb-1">
          <label className="px-0">{labelValue}</label>
        </div>
        <div className="row formInputContainer mb-3 mx-1">
          <input {...register(name, { 
              required: "This field is required",
              minLength: minLeng && minLeng !== 0 ? { value: minLeng, message: `Minimal lenght is ${minLeng}` } : null,
              pattern: regExPattern ? { value: regExPattern, message: `${labelValue} must have correct pattern`} : null
            })} type={inputType} placeholder={inputPlaceholder} />
          <p className="formErrorMessage">{errors[name]?.message}</p>
        </div>
      </div>      
    );
  }

  const handleSubmitLocal = (data) => {
    setIsLoading(true);
    setShipmentUserData(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit((data) => { handleSubmitLocal(data) })} id="shippingFormId" className="shippingFormular">
        <div className="row changeToCol">
          <div className="col">
            {inputWithValidation("text", "Your name", "Name", "name", 2)}
          </div>
          <div className="col">
            {inputWithValidation("text", "Your surname", "Surname", "surname", 2)}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {inputWithValidation("tel", "Your Phone Number", "Phone Number", "phoneNumber", 0, regExes["phone"])}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {inputWithValidation("email", "Your Email", "Email", "email", 0, regExes["email"])}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {inputWithValidation("date", "Your Date of birth", "Date of birth", "birthDate")}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {inputWithValidation("text", "Your Address", "Address", "address", 2)}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {inputWithValidation("text", "Your City", "City", "city", 2)}
          </div>
        </div>
        <div className="row changeToCol">
          <div className="col">
            {inputWithValidation("text", "Your State", "State", "state", 2)}
          </div>
          <div className="col">
            {inputWithValidation("number", "Your Zip Code", "Zip Code", "zipCode", 0, regExes["zipCode"])}
          </div>
        </div>
      </form>
    </div>
  );
}

const ShipmentFormView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const minifigPartsData = location.state?.hpMinifigsPartsData;
  const selectedMinifig = location.state?.selectedMinifig;

  const { 
    register, 
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<userFormData>({ mode: "all" });
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [isValidSubmitClicked, setSubmitClicked] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [shipmentUserData, setShipmentUserData] = useState({} as userFormData);
  
  useEffect(() => {
    if (isValidSubmitClicked && isOrderSent) navigate("/");
  });

  useEffect(() => {
    if(isOrderSent) {
      setIsLoading(false);
      NotificationManager.success("Your order has been recived.", "Success!");
    }
  }, [isOrderSent]);
  
  useEffect(() => {
    if (Object.keys(shipmentUserData).length > 0) {
      const orderData = { userShippingData: shipmentUserData, orderedMinifigId: selectedMinifig.set_num };
      postOrderData(orderData, setIsOrderSent);
    };
  }, [shipmentUserData, selectedMinifig]);

  return (
    <div>
      <div className="row formMainContainer">
        <div className="d-flex align-items-center">
          <div className="col-9 shipmentForm px-5">
            <div className="shipmentFormChild">
              <div className="mx-1">
                <h2 className="header100 mb-5">SHIPPING DETAILS</h2>
              </div>
              <div>
                {renderShippingForm(register, handleSubmit, errors, setShipmentUserData, setIsLoading)}
              </div>
            </div>
          </div>
          {/* <div className="col-1"></div> */}
          <div className="col-3 summaryCard">
            {renderSummaryContent(selectedMinifig, minifigPartsData, isValid, setSubmitClicked, isLoading)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentFormView;
