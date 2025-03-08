import {notFoundData} from 'assets/icons';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
  StatusBarStyle,
  Button,
  Text,
  Image,
} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {h3} from 'utils/styles';
import theme from 'utils/theme';

const hoc =
  (
    Comp: any,
    statusBarColor?: string,
    translucent?: boolean,
    barStyle?: StatusBarStyle,
  ) =>
  ({children, ...props}: any) => {
    return (
      <>
        <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
          <StatusBar
            barStyle={barStyle || 'dark-content'}
            backgroundColor={statusBarColor || theme.colors.navBar.bar}
            translucent={translucent || false}
          />
          <SafeAreaView style={styles.container}>
            <View style={{flex: 1}}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Comp {...props}>{children}</Comp>
              </TouchableWithoutFeedback>
            </View>
          </SafeAreaView>
        </ErrorBoundary>
      </>
    );
  };

const CustomFallbackComponent = (props: {
  error: Error;
  resetError: Function;
}) => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    }}>
    <Image
      source={notFoundData}
      style={{
        width: 250,
        height: 250,
        resizeMode: 'contain',
      }}
    />
    <Text style={[h3, {marginVertical: 20}]}>Something happened!</Text>
    <Text>{props.error.toString()}</Text>
    {/* <Button onPress={props.resetError} title={'Try again'} /> */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grey9,
  },
});

export default hoc;
