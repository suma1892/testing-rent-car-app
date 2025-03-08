import store from 'redux/store';

export const currencyFormat = (num: number, customPrefix?: string) => {
  const lang = store.getState()?.utils?.lang;
  const CURRENCY = store.getState().utils.currency;

  if (num === undefined) {
    return '';
  }
  const thousandSeparator: string = '.';

  // const prefix = customPrefix
  //   ? customPrefix
  //   : lang === 'cn'
  //   ? '印尼盾'
  //   : 'Rp. ';
  const prefix = CURRENCY;
  num = Math.round(num);

  const formattedNumber = num
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);

  return lang === 'cn'
    ? `${formattedNumber} ${prefix}`
    : `${prefix} ${formattedNumber}`;
};
