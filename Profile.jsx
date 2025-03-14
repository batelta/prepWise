import React, { useState } from "react";
import { View, Text, Image, Switch, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import CustomTabNavigator from './CustomTabNavigator'

const Profile = () => {
  const navigation = useNavigation(); // מאפשר ניווט
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // מצב ההתראות

  return (
    <SafeAreaView style={styles.container}>  {/* משתמש ב-SafeAreaView למניעת חיתוך */}
      {/* הוספה של העיגול העליון בתחילת הדף*/}
      <View style={styles.headerBackground} />

      {/* תמונת הפרופיל */}
      <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} />

      {/* שם המשתמש ומייל */}
      <Text style={styles.name}>Natalie Cohen</Text>
      <Text style={styles.email}>NatalieCohen@gmail.com | +01 234 567 89</Text>

      {/* תיבה ראשונה - הגדרות */}
      <View style={styles.box}>
        <TouchableOpacity style={styles.option}
          onPress={() => navigation.navigate("EditProfile")} // מעבר למסך עריכה
        >
          <Text style={styles.optionText}>
            <AntDesign name="edit" size={20} color="black" /> Edit profile information
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setNotificationsEnabled(!notificationsEnabled)} //  שינוי מצב ההתראות בלחיצה
        >
          <Text style={styles.optionText}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={notificationsEnabled ? "black" : "gray"} //אפור שנכבה את ההתראות-שינוי צבע בהתאם למצב ההתראות
            /> Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
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

      {/* הוספתי את ה-CustomTabNavigator בתור רכיב עצמאי */}
      <View style={styles.tabContainer}>
        <CustomTabNavigator />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        paddingTop: 205,
        paddingBottom: 60, // מונע חפיפה עם ה-Tab Bar
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
