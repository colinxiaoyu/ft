import React from 'react';

import { create } from 'dva-core';
import { Provider } from 'react-redux';
import createCallback from 'dva-callback';
import models from '../models';
import storage from '@react-native-async-storage/async-storage';
import { persistEnhancer } from './persistEnhancer';
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";





let registered;


const dva = (options) => {
  const app = create(options);
  // HMR workaround
  // tslint:disable-next-line:curly
  if (!registered) {
    options.models.forEach(model => app.model(model));
  }
  registered = true;

  app.start();
  app.use(createCallback({ alias: 'callback' }));

  const store = app._store;

  // 外面传进来的组件作为参数放到Provider组件里面
  app.start = container => () => (
    <Provider store={store}>
      {container}
    </Provider>
  );

  app.getStore = () => store;
  // 把store挂到global上
  if (window) {
    window.dvaStore = store;
  }
  return app;
};


const dvaApp = dva({
  initialState: {},
  // 加载maodel
  models: models,
  extraEnhancers: [
    persistEnhancer(
      {
        key: 'root',
        storage: storage,
        whitelist: [
          'userModal',
          // 'configModal',
          // 'homeScreenModal'
        ],
        blacklist: [
        ],
        stateReconciler: autoMergeLevel2,
      },

    )],
});

export default dvaApp;
