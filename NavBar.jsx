/**
 * NavBar.js - A responsive navigation bar for web and mobile.
 * - Uses a top navbar for web.
 * - Uses bottom tab navigation for mobile.
 */

import React from "react";
import { Platform, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from 'expo-font';
import { Inter_400Regular,
  Inter_300Light, Inter_700Bold,Inter_100Thin,
  Inter_200ExtraLight } from '@expo-google-fonts/inter';


/*
if (!fontsLoaded) {
  console.log('no fonts') // or a loading spinner
}
*/
const HomeScreen = () => <View style={styles.screen}><Text>Home</Text></View>;
const ChatScreen = () => <View style={styles.screen}><Text>Chat</Text></View>;
const JobScreen = () => <View style={styles.screen}><Text>Add Job</Text></View>;
const ProfileScreen = () => <View style={styles.screen}><Text>Profile</Text></View>;
const MenuScreen = () => <View style={styles.screen}><Text>Menu</Text></View>;
const CalendarScreen = () => <View style={styles.screen}><Text>Calendar</Text></View>;

const Tab = createBottomTabNavigator();

const MobileNavBar = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size }) => {
        const iconColor = "#003D5B";
        let iconName;
        if (route.name === "Home") iconName = focused ? "home" : "home-outline";
        else if (route.name === "Chat") iconName = focused ? "chatbubble" : "chatbubble-outline";
        else if (route.name === "Add Job") iconName = focused ? "add-circle" : "add-circle-outline";
        else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
        else if (route.name === "Menu") iconName = focused ? "menu" : "menu-outline";
        else if (route.name === "Calendar") iconName = focused ? "calendar" : "calendar-outline";
        return <Ionicons name={iconName} size={size} color={iconColor} />;
      },
      tabBarLabelStyle: { color: "#003D5B", fontSize: 9, textAlign: "center",  width: 60 },
      tabBarStyle: styles.tabBar,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Add Job" component={JobScreen} />
    <Tab.Screen name="Calendar" component={CalendarScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Menu" component={MenuScreen} />
  </Tab.Navigator>
);

const WebNavBar = () => {

  const [Hovered, setHovered] = React.useState("");

  //checking which page were on and highlighting it accordingly

  const [currentPage, setCurrentPage] = React.useState("");

  React.useEffect(() => {
    setCurrentPage(window.location.pathname); // Gets the current URL path
  }, []);
///////////
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Chat", path: "/chat" },
    { name: "Add Job", path: "/add-job" },
    { name: "Calendar", path: "/calendar" },
    { name: "Profile", path: "/profile" },
    { name: "Menu", path: "/menu" },
  ];

  return(

  <View style={styles.webNavContainer}>
    <View style={styles.webNav}>
      <View style={styles.logoContainer}>
        <Image source={require("./assets/prepWise Logo.png")} style={styles.logo} />
   {/*  <Text style={styles.logoText}>prepWise</Text> */}
      </View>
      <View style={styles.navLinks}>
      {navItems.map((item) => (
         <TouchableOpacity
         key={item.path}
         onPress={() => (window.location.href = item.path)}
         onMouseEnter={() => setHovered(item.path)}
         onMouseLeave={() => setHovered(null)}
       >
         <Text
           style={[
             styles.link,
             currentPage === item.path ? styles.activeLink : null, // Active styling
             Hovered === item.path && currentPage !== item.path ? styles.linkHover : null, // Hover styling only if not active
           ]}
         >
           {item.name}
         </Text>
       </TouchableOpacity>
       
          ))}
      </View>
    </View>
  </View>
  
        )
};

const NavBar = () =>{
const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_700Bold,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light
});

 return (Platform.OS === "web" ? <WebNavBar /> : <MobileNavBar />);
}
const styles = StyleSheet.create({

///mobile design -tabBar
tabBar:{
  backgroundColor: "#BFB4FF",
  height: 70,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  position: "absolute",
  bottom: 0, 
  left: 0,
  right: 0,
  width: "100%", 
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 5 },
  elevation: 3,
},
  screen: { flex: 1, justifyContent: "center",
     alignItems: "center" ,
    },

  webNavContainer: {
    width: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    position: "fixed",
    left: 0,
    zIndex: 1000,

  },
  webNav: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: "center",
    marginHorizontal: "1%",

  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Aligns items to the left
  left:0
  },
  logo: {
    height: 70,
    width: 120,
    position: "relative",
    marginRight: 10,
    resizeMode: "contain",
  },
  navLinks: {
    flexDirection: "row",
    gap: 20,

  },
  link: {
    textDecorationLine: "none",
    color: "#003D5B",
   // fontWeight: "500",
    fontSize: 16,
    fontFamily: 'Inter_200ExtraLight' // Add fontFamily here
  },
  activeLink: {
    borderBottomWidth: 3,
    borderBottomColor: "#BFB4FF", // Purple underline for the active page
  },
  linkHover: {
    borderBottomWidth: 2,

    borderBottomColor: "#BFB4FF", // Purple on hover
  },
});

export default NavBar;