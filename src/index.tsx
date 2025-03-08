import React from 'react';
import CodePush from 'react-native-code-push';
import i18n from 'assets/lang/i18n';
import Router from './navigator/RootNavigator';
import store, {persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

const initI18n = i18n;

if (!__DEV__) {
  console.log = () => {};
}

const index: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
};

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.IMMEDIATE,
};
const App = CodePush(codePushOptions)(index);

export default App;
