import * as React from 'react';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { Linking, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './SignIn';
import SignUp from './SignUp';
import HomePage from './HomePage';
import GeminiChat from './GeminiChat';
import LandingPage from './LandingPage';
import JobForm from './JobForm';
import AddApplication from './AddApplication';
import SignUpJobSeeker from './SignUpJobSeeker';
import Profile from './Profile';
import EditProfile from './EditProfile';
import SignUpMentor from './SignUpMentor';
import HomePageMentor from './HomePageMentor';
import Application from './Application';
import EditProfileMentor from './EditProfileMentor';
import AllUserApplications from './AllUserApplications'
import ApplicationSplitView from './ApplicationSplitView'
import { UserProvider } from './UserContext'; // 🔥 import the provider

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
    <UserProvider> {/* 🔥 Wrap everything inside this */}

    <NavigationContainer>
    <PaperProvider theme={theme}>
     <Stack.Navigator initialRouteName='HomePageMentor'>
      <Stack.Screen name="SignIn" component={SignIn}/>
      <Stack.Screen name="SignUp" component={SignUp}/>
      <Stack.Screen name="HomePage" component={HomePage}/>
      <Stack.Screen name="GeminiChat" component={GeminiChat}/>
      <Stack.Screen name="LandingPage" component={LandingPage}/>
      <Stack.Screen name="JobForm" component={JobForm}/>
      <Stack.Screen name="AddApplication" component={AddApplication}/>
      <Stack.Screen name="SignUpJobSeeker" component={SignUpJobSeeker}/>
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="EditProfile" component={EditProfile}/>
      <Stack.Screen name="SignUpMentor" component={SignUpMentor}/>
      <Stack.Screen name="HomePageMentor" component={HomePageMentor}/>
      <Stack.Screen name="Application" component={Application}/>
      <Stack.Screen name="EditProfileMentor" component={EditProfileMentor}/>
      <Stack.Screen name="AllUserApplications" component={AllUserApplications}/>
      <Stack.Screen name="ApplicationSplitView" component={ApplicationSplitView}/>


     </Stack.Navigator>
    </PaperProvider>
    </NavigationContainer>
    </UserProvider>
  );
}

