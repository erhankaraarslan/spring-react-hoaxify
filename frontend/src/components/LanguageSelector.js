import React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../api/apiCalls";

const LanguageSelector = (props) => {
  const { i18n } = useTranslation();

  const onChangeLanguage = (language) => {
    //  const { i18n } = props;
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <div className='container'>
      <img
        src='https://countryflagsapi.com/png/tr'
        alt='Turkey flag'
        height='18'
        width='28'
        onClick={() => onChangeLanguage("tr")}
        style={{ cursor: "pointer" }}
      />

      <img
        src='https://countryflagsapi.com/png/us'
        alt='USA flag'
        height='18'
        width='28'
        onClick={() => onChangeLanguage("en")}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default LanguageSelector;
