import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import { View, Text } from "react-native";

//מסכים שניתן לעבור אליהם דרך הNAVBAR
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Home Screen</Text>
  </View>
);
const ChatScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Chat Screen</Text>
  </View>
);
const JobScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Add Job Screen</Text>
  </View>
);
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Profile Screen</Text>
  </View>
);
const MenuScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Menu Screen</Text>
  </View>
);
const CalendarScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Calendar Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const CustomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          const iconColor = "#003D5B"; 

          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "Add Job") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Menu") {
            iconName = focused ? "menu" : "menu-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          }

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarLabel: route.name,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          color: "#003D5B",
          fontSize: 9,
          textAlign: "center",
          width: 60,
        },
        tabBarStyle: {
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
            elevation: 5,
          },
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
};

export default CustomTabNavigator;
