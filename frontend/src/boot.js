import I18N from '@/I18N';
import { USER_LANGUAGE } from '@/constant'

let userLang = navigator.language || navigator.userLanguage;
userLang = userLang === USER_LANGUAGE.en ? userLang : USER_LANGUAGE.en;
const localStorageLang = localStorage.getItem('lang');

const lang = localStorageLang ? localStorageLang : userLang;
I18N.setLang(lang);

console.log(process.env);
