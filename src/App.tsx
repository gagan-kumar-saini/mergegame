import React, { use ,useEffect} from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import { loadInterstitialAd,loadRewardedAd} from './utils/admobUtils';


const App = () => {
  
useEffect(() => {
  loadRewardedAd('ca-app-pub-5686269557208989/9510232896');
}, []);

  return <AppNavigator />;
};

export default App;