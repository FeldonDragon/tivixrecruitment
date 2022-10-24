import React from 'react';
import axios from 'axios';

const BASE_URL = "https://rebrickable.com/api/v3/lego";
const USER_AUTH_TOKEN = "cdacee5abb500aeca3ad548aa89eb1ea";
export const NO_IMG_FILLER = "https://rebrickable.com/static/img/nil_mf.jpg";

export interface hpMinifigData {
  last_modified_dt: string;
  name: string;
  num_parts: number;
  set_img_url: string;
  set_num: string;
  set_url: string;
};

export interface hpMinifigPartData {
  color: {
    external_ids: {
      [ key: string ]: {
        ext_descrs: string[][];
        ext_ids: number[];
      };
    };
    id: number;
    is_trans: boolean;
    name: string;
    rgb: string;
  };
  element_id: string;
  id: number;
  inv_part_id: number;
  is_spare: boolean;
  num_sets: number;
  part: {
    external_ids: {
      [ key: string ]: string[];
    };
    name: string;
    part_cat_id: number;
    part_img_url: string;
    part_num: string;
    part_url: string;
    print_of: string;
  };
  quantity: number;
  set_num: string;
};

interface theme {
  id: number;
  parent_id: number;
  name: string;
};

export interface userFormData {
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface dataForOrder {
  userShippingData: userFormData;
  orderedMinifigId: string;
}


export const renderSpinner = () => {
  return (
    <div className="d-flex justify-content-center mx-auto w-50">
      <div 
        className="spinner-grow spinner-grow-sm text-warning my-auto" 
        role="status" 
        aria-hidden="true"/>
      <div className="my-auto text-warning loadingTextSpinner">Loading...</div>
    </div>
  );
};

const findAllHPThemes = (themes: theme[]) => {
  const hpThemes = themes && themes.filter(theme => theme.name.toLowerCase().includes("harry potter"));

  const finalThemes: theme[] = [];
  const findChildren = (id: number) => {
    const children = themes.filter(theme => id === theme.parent_id);
    children.forEach(child => {
      finalThemes.push(child);
      findChildren(child.id);
    });
  };

  hpThemes.forEach(hpTheme => {
    findChildren(hpTheme.id);
    finalThemes.push(hpTheme);
  });

  return finalThemes.map(finalHPTheme => finalHPTheme.id);
};

async function fetchAllThemes(passAllHPData: (result: hpMinifigData[] | boolean) => void) {
  axios.get(BASE_URL + "/themes/?page_size=999", {
    headers: {
      'Authorization': `key ${USER_AUTH_TOKEN}`
    }
  })
  .then(response => {
    const themes = response.data.results;
    const allHPThemesId = findAllHPThemes(themes);

    const axiosMultiCallURLs = allHPThemesId.length > 0 && allHPThemesId.map(themeId => {
      return axios.get(BASE_URL + `/minifigs/?in_theme_id=${themeId}&page_size=999`, {
        headers: {
          'Authorization': `key ${USER_AUTH_TOKEN}`
        }
      });
    });

    axiosMultiCallURLs && axios.all(axiosMultiCallURLs)
      .then(
        axios.spread((...responses) => {
          const allHPMinifigs = responses && responses.map(resp => resp.data.results);
          passAllHPData(allHPMinifigs.flat());
        })
      ).catch(err => {
        console.error("ERROR: ", err);
        passAllHPData(false);
      });
  })
  .catch(err => {
    console.error("ERROR: ", err);
    passAllHPData(false);
  });
};

const getThreeRandomMinifigs = (allMinifigs: hpMinifigData[]) => {
  const resultArr = [] as hpMinifigData[];
  const allMinifigsLength = allMinifigs.length;
  
  while(resultArr.length < 3) {
    const rand = Math.floor(Math.random() * allMinifigsLength) + 1;
    if(resultArr.indexOf(allMinifigs[rand]) === -1) resultArr.push(allMinifigs[rand]);
  }

  return resultArr;
};

export async function fetchAndDrawData(passResult: (minifigsData: hpMinifigData[] | boolean) => void) {
  const getAllHPDataAndDraw = (result) => {
    passResult(getThreeRandomMinifigs(result));
  };
  
  fetchAllThemes(getAllHPDataAndDraw);
};

export async function fetchPartsByMinifigId(
  minifigId: string, 
  passResult: (partsData: hpMinifigPartData[] | boolean) => void) {
  
  axios.get(BASE_URL + `/minifigs/${minifigId}/parts/?page_size=99`, {
    headers: {
      'Authorization': `key ${USER_AUTH_TOKEN}`
    }
  })
    .then(resp => {
      const parts = resp.data.results;
      passResult(parts);
    })
    .catch(err => {
      console.error("ERROR: ", err);
    });
};

export async function postOrderData( dataForOrder: dataForOrder, passResult: (orderSent: boolean) => void ) {
  // fake post request:
        // axios.post(BASE_URL + 'orders/freemysterybox/', {
        //   headers: {
        //     'Authorization': `key ${USER_AUTH_TOKEN}`
        //   }
        // }).then(response => {}).catch(err => { console.error("ERROR: ", err); });
  const fakeRequest = new Promise((res) => {
    setTimeout(res, 1000);
  });

  fakeRequest.then(() => {
    console.log("order data: ", dataForOrder);
    passResult(true);
  });
};