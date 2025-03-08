import Button from 'components/Button';
import CodePush, {DownloadProgress} from 'react-native-code-push';
import hoc from 'components/hoc';
import i18next from 'i18next';
import React, {Component} from 'react';
import {Alert, BackHandler, StyleSheet, Text, View} from 'react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import {theme} from 'utils';

type UpdateVersionState = {
  restartAllowed: boolean;
  progress: DownloadProgress;
  syncMessage: string;
};

class CodepushUpdateManager extends Component<any, UpdateVersionState> {
  constructor(props: any) {
    super(props);
    this.state = {
      restartAllowed: true,
      progress: {
        totalBytes: 0,
        receivedBytes: 0,
      },
      syncMessage: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  getPercentage(num: number) {
    if (num) {
      num *= 100;

      return `${num.toFixed(2)}%`;
    }

    return num;
  }

  codePushStatusDidChange(syncStatus: CodePush.SyncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({syncMessage: 'Checking for update.'});
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({syncMessage: 'Downloading package '});
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({syncMessage: 'Awaiting user action.'});
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({syncMessage: 'Installing update.'});
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({
          syncMessage: 'App up to date.',
          progress: {
            totalBytes: 0,
            receivedBytes: 0,
          },
        });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({
          syncMessage: 'Update cancelled by user.',
          progress: {
            totalBytes: 0,
            receivedBytes: 0,
          },
        });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          syncMessage: 'Update installed and will be applied on restart.',
          progress: {
            totalBytes: 0,
            receivedBytes: 0,
          },
        });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({
          syncMessage: 'An unknown error occurred.',
          progress: {
            totalBytes: 0,
            receivedBytes: 0,
          },
        });
        break;
      default:
        break;
    }
  }

  codePushDownloadDidProgress(progress: DownloadProgress) {
    this.setState({progress});
  }

  sync() {
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  }

  backAction() {
    Alert.alert('Warning!', 'Apakah anda yakin ingin kembali?', [
      {
        text: 'Tidak',
        onPress: () => {
          return null;
        },
        style: 'cancel',
      },
      {
        text: 'Ya',
        onPress: () => {
          return BackHandler.exitApp();
        },
      },
    ]);
    return true;
  }

  render() {
    const {
      progress: {receivedBytes, totalBytes},
    } = this.state;

    let percentage = 0;
    let progressView = (
      <>
        <Text style={styles.messages}>
          {i18next.t('codepush.updates_available')}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            _theme="navy"
            title={i18next.t('global.button.download_update')}
            onPress={this.sync.bind(this)}
            styleWrapper={{
              width: '95%',
              alignSelf: 'center',
              marginVertical: 20,
            }}
          />
        </View>
      </>
    );

    if (receivedBytes || totalBytes) {
      percentage = receivedBytes / totalBytes;

      progressView = (
        <View>
          <Text style={styles.messages}>
            {this.state.syncMessage || ''}
            {percentage <= 99 ? this.getPercentage(percentage) : '100%'}
          </Text>
          <ProgressBar
            progress={isNaN(percentage) ? 0 : percentage}
            styleAttr="Horizontal"
            indeterminate={false}
          />
        </View>
      );
    }

    return <View style={styles.container}>{progressView}</View>;
  }
}

export default hoc(CodepushUpdateManager);

const styles = StyleSheet.create({
  buttonContainer: {
    width: '75%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  messages: {
    color: theme.colors.text.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
});
