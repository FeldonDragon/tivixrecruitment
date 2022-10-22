import React from 'react';
import axios from 'axios';

const BASE_URL = "https://rebrickable.com/api/v3/lego/";
const USER_AUTH_TOKEN = "cdacee5abb500aeca3ad548aa89eb1ea";

export interface hpMinifigData {
  last_modified_dt: string;
  name: string;
  num_parts: number;
  set_img_url: string;
  set_num: string;
  set_url: string;
};

interface theme {
  id: number;
  parent_id: number;
  name: string;
};


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
}