import React from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import { loadInterstitialAd,loadRewardedAd} from './utils/admobUtils';

loadInterstitialAd(); 
loadRewardedAd();


const App = () => {
  return <AppNavigator />;
};

export default App;