import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  View
} from 'react-native';
import { TILE_SIZE, TILE_MARGIN } from '../utils/constants';

interface TileProps {
  value: number;
  row: number;
  col: number;
  isSelected: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

// Color mapping for different tile values
const getTileColor = (value: number): string => {
  const colorMap: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };

  return value > 2048 ? '#3c3a32' : colorMap[value] || '#cccccc';
};

const getTextColor = (value: number): string => {
  return value <= 4 ? '#776e65' : '#f9f6f2';
};

const getFontSize = (value: number): number => {
  const length = value.toString().length;
  if (length <= 2) return 24;
  if (length === 3) return 20;
  if (length === 4) return 16;
  return 14;
};

const Tile: React.FC<TileProps> = ({ value, isSelected, onPress }) => {
  if (value === 0) {
    return (
      <TouchableOpacity
        style={[
          styles.tile,
          styles.emptyTile,
          {
            marginHorizontal: TILE_MARGIN,
            marginVertical: TILE_MARGIN,
          },
        ]}
        activeOpacity={0.7}
        onPress={onPress}
      />
    );
  }

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: getTileColor(value),
          marginHorizontal: TILE_MARGIN,
          marginVertical: TILE_MARGIN,
          borderWidth: isSelected ? 3 : 0,
          borderColor: isSelected ? '#20a4f3' : 'transparent',
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tileText,
          {
            color: getTextColor(value),
            fontSize: getFontSize(value),
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyTile: {
    backgroundColor: 'rgba(238, 228, 218, 0.35)',
  },
  tileText: {
    fontWeight: 'bold',
  },
});

export default Tile;
