import React, { use ,useEffect} from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import { loadInterstitialAd,loadRewardedAd} from './utils/admobUtils';


const App = () => {
 
  return <AppNavigator />;
};

export default App;