import { useEffect, useRef } from 'react';

const useEffectSkipInitialRender = (callback: any, dataArr: any) => {
  // const [data, setData] = useState(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dataArr);
};

export default useEffectSkipInitialRender;
