import 'i18next';
import id from './src/assets/lang/id.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof id;
    };
  }
}
