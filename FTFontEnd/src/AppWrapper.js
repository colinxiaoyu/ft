import React, { Fragment } from 'react';
import dvaApp from './dva';
import GlobalAlert from './components/GlobalAlert';
import LoadingIndicator from './components/LoadingIndicator';
import RootApp from './RootApp';



const AppWrapper = () => {

  console.log('window?.dvaStore?.getState()?.configModal', window?.dvaStore?.getState()?.configModal)
  console.log('window?.dvaStore?.getState()?.userModal', window?.dvaStore?.getState()?.userModal)

  return (
    <Fragment>
      <RootApp />

      <GlobalAlert />
      <LoadingIndicator />
    </Fragment>
  );
};



export default dvaApp.start(<AppWrapper />);
