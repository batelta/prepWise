import * as React from 'react';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { Linking, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignUpJob from './SignUpJob';
import HomePage from './HomePage';
import GeminiChat from './GeminiChat';

// Define your custom theme
const theme = {
  colors: {
    primary: '#BFB4FF', // Button color
    accent: '#9FF9D5',  // Highlight color
    background: '#FDFCF5', // Light cream background
    text: '#003D5B',    // Text color
  }
};

const Stack=createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
    <PaperProvider theme={theme}>
     <Stack.Navigator initialRouteName='GeminiChat'>
      <Stack.Screen name="SignIn" component={SignIn}/>
      <Stack.Screen name="SignUp" component={SignUp}/>
      <Stack.Screen name="SignUpJob" component={SignUpJob}/>
      <Stack.Screen name="HomePage" component={HomePage}/>
      <Stack.Screen name="GeminiChat" component={GeminiChat}/>


     </Stack.Navigator>
    </PaperProvider>
    </NavigationContainer>
  );
}

