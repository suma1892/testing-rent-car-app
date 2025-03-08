import store from 'redux/store';
import en from '../assets/lang/en.json';
import id from '../assets/lang/id.json';

function useLangSelector() {
  const lang = store.getState().appData.languages;

  return lang === 'en' ? en : id;
}

export default useLangSelector;