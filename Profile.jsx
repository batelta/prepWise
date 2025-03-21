import React, { useState, useEffect } from "react";
import { View, Text, Image, Switch, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import NavBar from './NavBar';

const Profile = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // משתנה לשמירת פרטי המשתמש
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    picture:""
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("https://localhost:7137/api/Users?userId=30");
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}> 
        <View style={styles.headerBackground} />

        {/* תמונת הפרופיל */}
        {user.picture ? (<Image source={{ uri: user.picture }} style={styles.profileImage} />
        ) : (
        <Text>Loading image...</Text>)}

        {/* שם המשתמש ואימייל */}
        {user.firstName ? <Text style={styles.name}>{user.firstName} {user.lastName}</Text> : null}
        {user.email ? <Text style={styles.email}>{user.email}</Text> : null}


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
            <Switch value={notificationsEnabled} onValueChange={() => setNotificationsEnabled(!notificationsEnabled)} />
          </TouchableOpacity>
        </View>

        {/* תיבה שנייה - עזרה */}
        <View style={styles.box}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              <MaterialIcons name="support-agent" size={20} color="black" /> Help & Support
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

        {/* סרגל הניווט */}
        <View style={styles.tabContainer}>
          <NavBar />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    width: "150%",
    height: 350,
    backgroundColor: "#EDEDED",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    alignSelf: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
    marginTop: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  box: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
  },
  tabContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
});

export default Profile;
