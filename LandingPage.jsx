import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity} from "react-native";
import { Button } from "react-native-paper";
import {LinearGradient} from "expo-linear-gradient";  // Correct import
import { useFonts } from 'expo-font';
import { Inter_400Regular,
    Inter_300Light, Inter_700Bold,Inter_100Thin,
    Inter_200ExtraLight } from '@expo-google-fonts/inter';


const LandingPage = () => {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light
      });
  return (
    <LinearGradient colors={['#D6CBFF', '#fff']} style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
      <Image source={require("./assets/LogoTransparent.png")} style={styles.logo} />

        <View style={styles.navLeft}>
          <Button mode="outlined" onPress={() => {}} style={styles.navButton} labelStyle={styles.navButtonText}>
            Sign In
          </Button>
          <Button mode="contained" onPress={() => {}}
            labelStyle={styles.getStartedButtonText} // Add this line
          style={styles.getStartedButton}>
            Get Started
          </Button>
        </View>
      </View>
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.TextContainer}>
        <Text style={styles.heading}>Welcome to Prepwise</Text>
        <Text style={styles.description}>
          Your all-in-one platform to prepare for job interviews with real mentors and AI-powered simulations.
        </Text>
        {/* Uncomment if needed
        <Image source={require("./assets/Botimage.png")} style={styles.image} />
        <Image source={require("./assets/video_meeting.png")} style={styles.floatingImage} />
        <Image source={require("./assets/job_symbol.png")} style={styles.floatingImage} />
        */}
        <TouchableOpacity style={styles.mainButton} onPress={() => {}}>
          <Text style={styles.mainButtonText}>Get Started</Text>
        </TouchableOpacity>
        </View>
        <Image source={require("./assets/landingPageImage.png")} style={styles.landingImage}/>
      </View>
</LinearGradient>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 60,
    },
    navbar: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      position: "absolute",
      top: 0,
      height: 60,
    },
    navButtonText: {
        color: "white",
        fontFamily:"Inter_300Light",
        fontWeight:"bold"
      },
      getStartedButton: {
        backgroundColor: "white",
      },
      getStartedButtonText:{
        color:"#003D5B",
        fontFamily:"Inter_300Light"

      },
    navLeft: {
      flexDirection: "row",
      gap: 15,
    },
    navButton: {
        borderColor: "white",
      },
    logo: {
      width: 120,
      height: 60,
      resizeMode: "contain",
    },
    mainContent: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 100,
      paddingHorizontal: 20, // Adds space around text and image
      marginBottom: 40,
    },
    TextContainer: {
      flexDirection: "column",
      alignItems: "center", 
      maxWidth: "50%", // Limits text width so it's not too wide
      padding: 10, // Adds space around text content
    },
    heading: {
      fontSize: 36,
      color: "#003D5B",
      fontWeight: "bold",
      textAlign: "center",
      fontFamily:"Inter_400Regular"
    },
    description: {
      fontSize: 18,
      color: "#003D5B",
      textAlign: "center",
      marginVertical: 20,
      fontFamily:"Inter_300Light"

    },
    mainButton: {
      backgroundColor: "#BFB4FF",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      marginTop: 20,
      width: 180, // Fixes button width
      alignItems: "center",
    },
    mainButtonText: {
      color: "white",
      fontSize: 18,
      textAlign: "center",
      fontFamily:"Inter_300Light"

    },
    landingImage: {
      width: "80%", // Adjusted to balance with text
      resizeMode: "contain",
    },
  });
  

export default LandingPage;