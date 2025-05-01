import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface CompletionMessageProps {
  visible: boolean;
  hasPath: boolean;
  animation: Animated.Value;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({ visible, hasPath, animation }) => {
  if (!visible || !hasPath) return null;

  return (
    <Animated.View
      style={[
        styles.completionMessage,
        {
          opacity: animation,
          transform: [{
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0]
            })
          }]
        }
      ]}
    >
      <Text style={styles.completionText}>Valid Pattern!</Text>
    </Animated.View>
  );
};

export default CompletionMessage;

const styles = StyleSheet.create({
  completionMessage: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  completionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
