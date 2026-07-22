import React, { Fragment, useEffect } from 'react';
import RootRouter from './navigation/RootRouter';


import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import { action } from './utils';


const RootApp = (props) => {


  useEffect(() => {
    // 订阅网络状态变化
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('state', state)

      if (state.isConnected) {
        props.dispatch(action('configModal/refesh',)); // 任务状态变更刷新页面

      } else {

      }
    });

    // 清理订阅
    return () => unsubscribe();
  }, []);


  return (
    <RootRouter />

  );
};

export default connect()(RootApp)






