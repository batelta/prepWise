import * as React from "react";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { Linking, Text, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
//import SignUpJob from "./SignUpJob";
import HomePage from "./HomePage";
import GeminiChat from "./GeminiChat";
import LandingPage from "./LandingPage";
import JobForm from "./JobForm";
import AllUserApplications from "./AllUserApplications";
import Application from "./Application";
import AddApplication from "./AddApplication";
import TestAddApp from "./TestAddApp";
import ApplicationSplitView from "./ApplicationSplitView";

// Define your custom theme
const theme = {
  colors: {
    primary: "#BFB4FF", // Button color
    accent: "#9FF9D5", // Highlight color
    background: "#FDFCF5", // Light cream background
    text: "#003D5B", // Text color
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator initialRouteName="Applications">
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="GeminiChat" component={GeminiChat} />
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="JobForm" component={JobForm} />
          <Stack.Screen name="AddApplication" component={AddApplication} />
          <Stack.Screen name="TestAddApp" component={TestAddApp} />

          <Stack.Screen
            name="ApplicationSplitView"
            component={ApplicationSplitView}
          />
          <Stack.Screen
            name="AllUserApplications"
            component={AllUserApplications}
          />

          {/* Unified "Applications" route for both platforms */}
          <Stack.Screen
            name="Applications"
            component={
              Platform.OS === "web" ? ApplicationSplitView : AllUserApplications
            }
          />

          <Stack.Screen name="Application" component={Application} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
