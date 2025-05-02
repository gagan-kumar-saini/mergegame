import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import GameBoard from '../screens/GameBoard';

export type RootStackParamList = {
  Home: undefined;
  GameBoard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GameBoard" component={GameBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
