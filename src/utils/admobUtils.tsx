
import {
    InterstitialAd,
    RewardedAd,
    AdEventType,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

// Interstitial
let interstitialAd: InterstitialAd | null = null;

export const loadInterstitialAd = (adUnitId: string = TestIds.INTERSTITIAL) => {
    interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });
    interstitialAd.load();
};

export const showInterstitialAd = (onAdClosed?: () => void) => {
    if (!interstitialAd) {
        console.warn('Interstitial ad not loaded yet');
        return;
    }

    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        onAdClosed?.();
        interstitialAd?.load(); // Reload for next time
    });

    interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
        console.error('Interstitial Ad Error:', error);
    });

    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        interstitialAd?.show();
    });

    if (interstitialAd.loaded) {
        interstitialAd.show();
    }
};

// Rewarded
let rewardedAd: RewardedAd | null = null;

export const loadRewardedAd = (adUnitId: string = TestIds.REWARDED) => {
    rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });
    rewardedAd.load();
};

export const showRewardedAd = (
    onRewardEarned: () => void,
    onAdClosed?: () => void
) => {
    if (!rewardedAd) {
        console.warn('Rewarded ad not loaded yet');
        return;
    }

    rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
        console.log('Rewarded:', reward);
        onRewardEarned();
    });

    rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        onAdClosed?.();
        rewardedAd?.load(); // Reload for next time
    });

    rewardedAd.addAdEventListener(AdEventType.ERROR, error => {
        console.error('Rewarded Ad Error:', error);
    });

    if (rewardedAd.loaded) {
        rewardedAd.show();
    } else {
        console.warn('Rewarded ad is not ready yet');
    }
};


