import {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

const useInternetStatus = () => {
  const [reachable, setReachable] = useState<any>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable !== reachable) {
        setReachable(state.isInternetReachable);
      }
    });

    return () => unsubscribe();
  }, [reachable]);

  return reachable;
};

export default useInternetStatus;
