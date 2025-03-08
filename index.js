/**
 * @format
 */

import './wdyr';
import {AppRegistry, Platform} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Config from 'react-native-config';
import 'react-native-get-random-values';
// import NewRelic from 'newrelic-react-native-agent';
import {name, version} from './package.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// if (Config.ENV === 'production') {
//   let appToken;
//   if (Platform.OS === 'ios') {
//     appToken = '<IOS-APP-TOKEN>';
//   } else {
//     appToken = 'AA4b4bf59ab4119c286422b11ff43000bbff3f411d-NRMA';
//   }
//   const agentConfiguration = {
//     //Android Specific
//     // Optional:Enable or disable collection of event data.
//     analyticsEventEnabled: true,
//     // Optional:Enable or disable crash reporting.
//     crashReportingEnabled: true,
//     // Optional:Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
//     interactionTracingEnabled: true,
//     // Optional:Enable or disable reporting successful HTTP requests to the MobileRequest event type.
//     networkRequestEnabled: true,
//     // Optional:Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
//     networkErrorRequestEnabled: true,
//     // Optional:Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
//     httpRequestBodyCaptureEnabled: true,
//     // Optional:Enable or disable agent logging.
//     loggingEnabled: true,
//     // Optional:Specifies the log level. Omit this field for the default log level.
//     // Options include: ERROR (least verbose), WARNING, INFO, VERBOSE, AUDIT (most verbose).
//     logLevel: NewRelic.LogLevel.INFO,
//     // iOS Specific
//     // Optional:Enable/Disable automatic instrumentation of WebViews
//     webViewInstrumentation: true,
//     // Optional:Set a specific collector address for sending data. Omit this field for default address.
//     // collectorAddress: "",
//     // Optional:Set a specific crash collector address for sending crashes. Omit this field for default address.
//     // crashCollectorAddress: "",
//     // Optional:Enable or disable reporting data using different endpoints for US government clients
//     fedRampEnabled: false,
//     // Optional: Enable or disable offline data storage when no internet connection is available.
//     offlineStorageEnabled: true,

//     // iOS Specific
//     // Optional: Enable or disable Background Reporting.
//     backgroundReportingEnabled: true,

//     // iOS Specific
//     // Optional: Enable or disable to use our new, more stable event system for iOS agent.
//     newEventSystemEnabled: true,
//   };
//   // NewRelic.startAgent(appToken, agentConfiguration);
//   // NewRelic.setJSAppVersion(version);
// }
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('remoteMessage = ', remoteMessage);
  AsyncStorage.setItem('@title_fcm', remoteMessage?.notification?.title);
  AsyncStorage.setItem('@body_fcm', remoteMessage?.notification?.body);
});

messaging().onMessage(async remoteMessage => {
  console.log('Payload diterima:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
