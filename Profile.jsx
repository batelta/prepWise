
import React, { useState, useEffect } from "react";
import { View, Text, Image, Switch, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,Platform,Alert} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
//import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import NavBar from './NavBar';
import { useFonts } from 'expo-font';
import {Inter_400Regular,Inter_300Light, Inter_700Bold,Inter_100Thin,Inter_200ExtraLight } from '@expo-google-fonts/inter';
import CustomPopup from "./CustomPopup"; 
import AsyncStorage from '@react-native-async-storage/async-storage';//




//
const defaultImage = require('../prepWise/assets/womanImage.jpg'); // תמונה קבועה לאפליקציה (בדיקה בטלפון)

const Profile = () => {


 const [fontsLoaded] = useFonts({
     Inter_400Regular,
     Inter_700Bold,
     Inter_100Thin,
     Inter_200ExtraLight,
     Inter_300Light
   });

  const [popupVisible, setPopupVisible] = useState(false);
   
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // משתנה לשמירת פרטי המשתמש
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    picture:""
  });
{/** 
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
        const response = await fetch(`https://localhost:7137/api/Users?userId=${userId}`);
        const data = await response.json();
        console.log("User details:", data);
        setUser(data);
        }
        else {
          console.log("User ID not found in AsyncStorage");}}
       catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
   */}
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch("http://localhost:5062/api/Users?userId=21");
          const data = await response.json();
          console.log("User details:", data);
          setUser(data);
  
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
  
   

    fetchUserDetails();
  }, []);
  console.log("Profile Image URL:", user.picture);
  const deleteUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
      const response = await fetch(`http://localhost:5062/api/Users/Deletebyid?userid=${userId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        Alert.alert("Success", "Your profile has been deleted.");
        setPopupVisible(true);
      } else {
        Alert.alert("Error", "Failed to delete your profile.");
      }}
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Delete error:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}> 
        <Image source={require("../prepWise/assets/backgroundProfileImage.jpg")} style={styles.headerBackground} />

            <View style={styles.cardContainer}>
            <View style={styles.detailsContainer}>
        {/* תמונת הפרופיל */}
        {Platform.OS === 'web' ? (
        user.picture ? (
          <Image source={{ uri: user.picture }} style={styles.profileImage} />
        ) : (
          <Text>Loading image...</Text>
        )
      ) : (
        <Image source={defaultImage} style={styles.profileImage} />
      )}

        {/* שם המשתמש ואימייל }
        {user.firstName ? <Text style={styles.name}>{user.firstName} {user.lastName}</Text> : null}
        {user.email ? <Text style={styles.email}>{user.email}</Text> : null}
        {*/}

        {/* -בדיקה לטלפון שם המשתמש ואימייל */}
        <Text style={styles.name}>{user.firstName ? `${user.firstName} ${user.lastName}` : Platform.OS !== "web" 
        ? "Natelie Cohen" : ""}</Text>

        <Text style={styles.email}>{user.email ? user.email : Platform.OS !== "web" ? "NatalieCohen@gmail.com" : ""}
        </Text>
        </View>
        <View style={styles.boxContainer}>
        {/* תיבה ראשונה - הגדרות */}
        <View style={styles.box}> 
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("EditProfile")}>
            <Text style={styles.optionText}>
              <AntDesign name="edit" size={20} color="black" /> Edit profile information
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
            <Text style={styles.optionText}>
              <Ionicons name="notifications-outline" size={20} color={notificationsEnabled ? "black" : "gray"} /> Notifications
            </Text>
            <Switch value={notificationsEnabled} onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
             trackColor={{ false: "#D3D3D3", true: "#9FF9D5" }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => deleteUserProfile()}>
            <Text style={styles.optionText}>
              <AntDesign name="delete" size={20} color="black" /> Delete My Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* תיבה שנייה - עזרה */}
        <View style={styles.box}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
           {/*}   <MaterialIcons name="support-agent" size={20} color="black" /> Help & Support */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              <MaterialCommunityIcons name="message-processing-outline" size={20} color="black" /> Contact us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              <AntDesign name="lock" size={20} color="black" /> Privacy policy
            </Text>
          </TouchableOpacity>
        </View>
</View>
</View>



 {popupVisible && (//צריך להוסיף בשביל ההחשכה
<View style={styles.overlay}> {/*צריך גם להוסיף בשביל ההחשכה*/ }
<CustomPopup
visible={popupVisible}
  isConfirmation={true}
  icon="alert-circle-outline"
  message="Are you sure?"
  onConfirm={() => {
    setPopupVisible(false);
    navigation.navigate("SignIn"); 
  }}
  onCancel={() => setPopupVisible(false)}
/>
</View>
)}

        {/* סרגל הניווט */}
        <View style={styles.tabContainer}>
          <NavBar />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  overlay: {//צריך להוסיף בשביל ההחשכה, את כל העיצוב של overlay
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    alignItems: "center",
    paddingTop: 205,
    paddingBottom: 60,
    flexGrow: 1, // זה יגרום ל-ScrollView למלא את כל הגובה של המסך, כך ש-NavBar יהיה בתחתית
  },

  headerBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: Platform.OS === "web" ? "100%" : 220,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: "center",
    resizeMode: "cover",
    opacity:Platform.OS === "web" ?0.5:1

  },
  


  profileImage: {
    width: Platform.OS === "web" ? 200 : 150,
    height: Platform.OS === "web" ? 200 : 150,
    borderRadius: Platform.OS === "web" ? 130 : 80,
    borderWidth: 3,
    borderColor: "white",
    alignSelf:'flex-start',
    marginLeft:20,},
  
    name: {
    fontSize: 22,
    marginTop: Platform.OS === "web" ? 10 : 15,
    fontFamily:"Inter_400Regular",
    alignSelf:'flex-start',
    marginLeft:Platform.OS === "web" ? 70 : 45,
    color:"#003D5B" 

  },
  email: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
    fontFamily:"Inter_400Regular",
    alignSelf:'flex-start',
    marginLeft:Platform.OS === "web" ? 67 : 45,
    marginTop:5

  },
  box: {
    width: Platform.OS === "web" ? "50%" : "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1.5, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginRight:Platform.OS === "web" ? 200 : 0,


  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    fontFamily:"Inter_300Light"

  },
  tabContainer: {
position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",

  },

  boxContainer:{
  width: Platform.OS === "web" ? "90%" : "100%",
  marginLeft:Platform.OS === "web" ? "500px" : 40,
  marginRight:Platform.OS === "web" ? 0 : 0, 
  marginTop:Platform.OS === "web" ?"-220px":0,

  },

  cardContainer:{height:"90%",
    width:Platform.OS === "web" ?"70%":"100%",
    marginRight:Platform.OS === "web" ?0:30,
    backgroundColor:Platform.OS === "web" ?"white":"null",
    borderRadius:Platform.OS === "web" ? "12px":"0px",
    boxShadow: Platform.OS === "web" ?"0 4px 8px rgba(0, 0, 0, 0.1)":"0",
    padding: Platform.OS === "web" ?"20px":"0px",
    
  },

  detailsContainer:{
    width:Platform.OS === "web" ?"30%":"100%",
    backgroundColor:Platform.OS === "web" ?"white":"null",
    borderRadius:Platform.OS === "web" ? "12px":"0px",
    boxShadow: Platform.OS === "web" ?"0 6px 12px rgba(0, 0, 0, 0.2)":"0",
    padding: Platform.OS === "web" ?"20px":"0px",

  }

});

export default Profile;