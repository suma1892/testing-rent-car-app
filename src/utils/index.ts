import * as Typography from './typography';
import * as Mixins from './mixins';
import theme from './theme';
import deepClone from './deepClone';

const getIndonesianTimeZone = (timezone: any) => {
  let zone;
  switch (timezone) {
    case 'Asia/Jakarta':
      zone = 'WIB';
      break;
    case 'Asia/Makassar':
      zone = 'WITA';
      break;
    case 'Asia/Jayapura':
      zone = 'WIT';
      break;
    case 'Asia/Singapore':
      zone = 'SGT';
      break;
    default:
      zone = 'Zona waktu tidak dikenal';
  }

  return zone;
};

const getIndonesianTimeZoneName = ({
  timezone,
  lang,
}: {
  timezone: 'WIB' | 'WITA' | 'WIT' | 'SGT';
  lang: 'cn' | 'id' | 'en';
}) => {
  let zone;
  if (lang !== 'cn') return timezone;

  console.log('timezone ', timezone)

  switch (timezone) {
    case 'WIB':
      zone = '西部印尼时间';
      break;
    case 'WITA':
      zone = '印度尼西亚中部时间';
      break;
    case 'WIT':
      zone = 'WIT';
      break;
    case 'SGT':
      zone = 'SGT';
      break;
    default:
      zone = 'Zona waktu tidak dikenal';
  }

  return zone;
};

export {
  Typography,
  Mixins,
  theme,
  deepClone,
  getIndonesianTimeZone,
  getIndonesianTimeZoneName,
};
