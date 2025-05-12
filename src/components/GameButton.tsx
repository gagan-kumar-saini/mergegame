import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface GradientIconButtonProps {
  imagePath: ImageSourcePropType;
  onPress: () => void;
  imageStyle?: StyleProp<ImageStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
}

const GradientIconButton: React.FC<GradientIconButtonProps> = ({ 
  imagePath, 
  onPress, 
  imageStyle, 
  wrapperStyle,
  disabled = false,
  testID
}) => {
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        testID={testID}
        style={styles.touchable}
      >
        <Image 
          source={imagePath} 
          style={[styles.image, imageStyle]} 
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 70,
    height: 70,
  },
});

export default GradientIconButton;