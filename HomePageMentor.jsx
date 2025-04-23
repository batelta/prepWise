import { View, Text, ImageEditor, ScrollView, Image, TouchableOpacity, Platform, StyleSheet, SafeAreaView, Alert } from "react-native";
import { PlusCircle } from "lucide-react-native";
import NavBarMentor from "./NavBarMentor";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { FAB,Card } from "react-native-paper";
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { Inter_400Regular,
  Inter_300Light, Inter_700Bold,Inter_100Thin,
  Inter_200ExtraLight } from '@expo-google-fonts/inter';
import AnimatedArrow from './AnimatedArrow'
import AnimatedPlusIcon from "./AnimatedPlusIcon";

import CustomPopup from "./CustomPopup"; // Import the custom popup
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeminiChat from './GeminiChat';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useContext } from 'react';
import { UserContext } from './UserContext'; // adjust the path

const progress = 0; // 75% completed


export default function HomePageMentor() {
    const { Loggeduser } = useContext(UserContext);

    const [showChat, setShowChat] = useState(false);

    ////just checking
   {/*    const [successPopupVisible, setSuccessPopupVisible] = useState(true);*/}
   const [user, setUser] = useState(null);
   const [profileImage, setProfileImage] = useState(null);
   const [firstname, setFirstname] = useState("Guest");

   useEffect(() => {
    if (Loggeduser) {
        setProfileImage(Loggeduser.picture); // use user directly from context
        setUser(Loggeduser);
        console.log(Loggeduser);
        loginAsUser(Loggeduser.email, Loggeduser.password); // use it directly from Loggeduser here

      }
    }, [Loggeduser]);
  
    const loginAsUser=async (email,password )=>{
        console.log(email,password,Loggeduser.password)
    
        try{
          console.log("Sending request to API...");
      const API_URL = "https://proj.ruppin.ac.il/igroup11/prod/api/Users/SearchUser" 
          const response =await fetch (API_URL, { 
            method: 'POST', // Specify that this is a POST request
            headers: {
              'Content-Type': 'application/json' // Indicate that you're sending JSON data
            },
            body: JSON.stringify({ // Convert the user data into a JSON string
                UserId: 0,
                FirstName: "String",
                LastName: "String",
                Email: email,
                Password: password,
                CareerField: ["String"], // Convert to an array
                Experience: "String",
                Picture: "String",
                Language: ["String"], // Convert to an array
                FacebookLink: "String",
                LinkedInLink: "String",
                IsMentor:false
            })
          });
    
          //const responseBody = await response.text();  // Use text() instead of json() to handle any response format
          //console.log("Response Body:", responseBody);
          console.log("response ok?", response.ok);
    
          if(response.ok)
           {
            console.log('user found ')
            
              // Convert response JSON to an object
            const userData = await response.json();   
            if(userData.picture==="string") 
                setProfileImage(require('./assets/defaultProfileImage.jpg'))  
              else
          setProfileImage({ uri: userData.picture })        
        setFirstname(userData.firstName)
           }
      
      if(!response.ok){
        throw new Error('failed to find user')
      }
        }catch(error){
      console.log(error)
        }
    }     
    
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light
      });
    const [Name, setName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = "https://proj.ruppin.ac.il/igroup11/prod/api/Users" 
  
        //this is the real pic from the server 
        {/* 
    useEffect(() => {
        fetch(`${API_URL}?userId=30`)
            .then(response => response.text())
            .then(text => text ? JSON.parse(text) : {})
            .then(data => {
                if (data.picture) {
                    setProfileImage(`${data.picture}`);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching image:", error);
                setError("לא הצלחנו לטעון את התמונה");
                setLoading(false);
            });
    }, []);
*/}
    const LogoImage = () => {
        if (Platform.OS === "ios") {
            return <Image source={require('./assets/prepWise Logo.png')} style={appliedStyles.logo} />;
        }
    };
   
    const appliedStyles = Platform.OS === 'web' ? Webstyles : styles;

    return (
        <SafeAreaView style={appliedStyles.container}>
            <ScrollView>
                {/** logo component is here only for mobile*/}
                <LogoImage />
                <View style={appliedStyles.container}>
                     {/**Success popup */}
                     {/*}
              <CustomPopup
          visible={successPopupVisible}
          onDismiss={() => setSuccessPopupVisible(false)}
          icon="check-circle" // Success icon
          message="Action completed successfully!"
        />
        */}
                    <View style={appliedStyles.header}>
                       {/*  {loading ? (
                            <Text>Loading image...</Text>
                        ) : error ? (
                            <Text>{error}</Text>
                        ) : profileImage ? (
                            <Image source={{ uri: profileImage }} 
                                style={{ height: 100, width: 100 }}
                                resizeMode={"contain"} />
                        ) : (
                            <Text>אין תמונה זמינה</Text>
                        )}
                            */}

                        {/*this is for now only */}
                        <View style={appliedStyles.profileImageContainer}>

                        <View  style={appliedStyles.profileImage}>
                        <Image source={profileImage}
                               style={{  width: '100%',
                                height: '100%',
                                resizeMode: 'cover'}}
                                 />
                                </View>
                                </View>
                          <View style={{flex:1}}>
     
                        <Text style={appliedStyles.title}>Welcome {firstname}, to your Home page!</Text>
                        <Text style={appliedStyles.subtitle}>What to do next?</Text> <AnimatedArrow/>
                    </View>
                    </View>
                </View>
                {/* To-Do List */}
                <View style={appliedStyles.ToDoAndApplications}>
                <View style={appliedStyles.section}>
                    <Text style={appliedStyles.sectionTitle}>Mentorship Journeys 📃</Text>
                    <View style={appliedStyles.toDoList}>
                    <Card style={appliedStyles.Applicationcard}>
                    <Card.Content style={appliedStyles.ApplicationCardcontent}>
                    <Text style={appliedStyles.sectionDescription}>
                        You have no Journeys yet 
                    </Text>
                    </Card.Content>
                    </Card>
                    </View>
                </View>
                {/* Applications Section */}
                <View style={appliedStyles.Applicationsection}> 
                    <Text style={appliedStyles.ApplicationsectionTitle}>Upcoming Sessions💻</Text>
                    <Card style={appliedStyles.Applicationcard}>
                    <Card.Content style={appliedStyles.ApplicationCardcontent}>
                    <Text style={appliedStyles.sectionDescription}>
                        You have no Upcoming sessions yet 
                    </Text>
                    </Card.Content>
                    </Card>
                    </View>
                    </View>

    {/* Bot Icon (can be placed wherever you want) */}
     <TouchableOpacity
  style={appliedStyles.chatIcon}
  onPress={() => setShowChat(!showChat)}
>
<FontAwesome6 name="robot" size={24} color="#9FF9D5" />
</TouchableOpacity>

                {/* new user section*/}
                    <Text style={appliedStyles.sectionTitle}>Get Started 💫</Text>
                    <View style={appliedStyles.pressContainer}>
                  
                            <Card style={appliedStyles.pressCard}>
                            <Card.Content style={appliedStyles.pressCardcontent}>
                            <Text style={appliedStyles.pressText}>
                           Press 
                           <Text style={{ marginRight: 10 }}> </Text>
                           <AnimatedPlusIcon />
                           <Text style={{  marginHorizontal: 10}}>
                           to Open your first Offer
                           </Text>
                           </Text>
                            </Card.Content>
                            </Card>
                            </View>
                <View>

                    <NavBarMentor />
                </View>

                {showChat && (
    <View style={appliedStyles.overlay}>
  <View style={appliedStyles.chatModal}>
  <TouchableOpacity onPress={() => setShowChat(false)} style={{ alignSelf: 'flex-end', padding: 5 }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>✖</Text>
</TouchableOpacity>
    <GeminiChat />
    </View>

  </View>
)}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 50,
        flexDirection: 'row', // Ensures text and image are side by side
        //justifyContent:'space-evenly',
    },
    logo: {
        position: 'relative',
        width: '23%',
        resizeMode: 'contain',
        height: 100,
    },
    header: {
        flexDirection: "row-reverse",
    alignItems: "center",
    width: "130%",
    left: "-15%", // Moves it left without relying on margins
    paddingHorizontal: 16,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 80, // Ensures full circle
        overflow: 'hidden', // Prevents image from going beyond border
        alignSelf: 'flex-start', // גורם לתמונה להיצמד לימין  (הוספה) 
        marginRight:10
},
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 50,

 },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Inter_400Regular",
        flex: 1, // Allows text to expand properly
    },
    subtitle: {
        color: "gray",
        fontFamily:"Inter_200ExtraLight"
    },
    section: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap", // (Change) Allows wrapping if needed for responsiveness
       // alignItems: "center", // (Change) Ensures proper alignment
    },
    Applicationsection: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: "Inter_300Light",
        left: 9,
        marginBottom: 10, // (Change) Added margin to space out title from the cards

    },
    ApplicationsectionTitle:{
        fontSize: 15,
        fontFamily: "Inter_300Light",
        left: 9,
        marginBottom: 10, // (Change) Added margin to space out title from the cards

    },
    sectionDescription: {
          color: "gray",
        fontFamily:"Inter_200ExtraLight",
        //marginTop: 10, // (Change) Added margin to space out title from the cards

    },
    ToDoAndApplications:{
        flexDirection:'column',
        justifyContent:'flex-start',
        marginBottom:30,
            },
    toDoList: {
        flexDirection: "row",
        justifyContent: "space-between", // (Change) Ensures even spacing between cards
        paddingHorizontal: 10,
        flexWrap: "nowrap", // (Change) Prevents wrapping so both cards stay in one row
    },
    ToDocard:{
        width: "48%", // (Change) Adjusted width so both cards fit in one row
       height:120,
       },
       Cardcontent:{
           alignItems: 'center', // Centers items inside Card.Content
           justifyContent: 'center',
       },
    toDoItem: {
        width: "80%",
        height:"130%",
        backgroundColor: "#f3f4f6",
        padding: 10,
        borderRadius: 12,
        alignItems: "center",

    },
    toDoText: {
        color: "gray",

    },
    toDoLabel: {
        marginTop: 8,
        fontWeight: "500",
        fontFamily:"Inter_200ExtraLight"

    },
    Applicationcard:{
     width:'100%',
    },
    ApplicationCardcontent:{
//alignItems: 'center', // Centers items inside Card.Content
        justifyContent: 'flex-start',
    },

    pressText: {
        fontWeight: "500",
        fontSize: 15,
        fontFamily:"Inter_300Light",
      },
    pressCard:{
        width: "90%", // (Change) Increased width to make it look more like a card
        margin: 10,
        alignSelf: "center", // (Change) Centered the card
        padding: 15, // (Change) Added padding to make it visually distinct
        backgroundColor: "#f3f4f6", // (Change) Ensures it looks like a card
        borderRadius: 12, // (Change) Gives a card-like appearance
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // (Change) Adds shadow effect for Android
    },
    pressContainer:{
        marginBottom:80
    },
    chatIcon:{
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 12,
        zIndex: 20, // Add this!
    
      },
    chatModal:{
        position: 'absolute',
        bottom: 90,
        right: 10,
        width: '90%',
        height: 500,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    overlay: {
        position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",alignItems: "center",zIndex: 9999,
      },
      
});

const Webstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 130,
        flexDirection: 'row', // Ensures text and image are side by side
        //justifyContent:'space-evenly',

    },
    header: {
        alignItems: "center",
        marginTop: 16,
        flexDirection: "row-reverse", // הופך את הסדר של התמונה והטקסט(הוספה)
        justifyContent: "space-between",////(הוספה)
        width: "90%",////(הוספה)
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,

 },
    title: {
        fontSize: 20,
       // fontWeight: "bold",
        marginTop: 8,
        fontFamily:"Inter_400Regular"

    },
    subtitle: {
        color: "gray",
        fontFamily:"Inter_300Light"

    },
    section: {
        marginTop: 3,
        width:'30%',
        //paddingLeft:100
    },
    Applicationsection: {
        marginTop: 3,
        width:'35%',
        paddingRight:100
    },
    sectionTitle: {
        fontSize: 18,
      //  fontWeight: "600",
        position:'relative',
        fontFamily:"Inter_400Regular",
     paddingHorizontal:25,

    },
    ApplicationsectionTitle:{
        fontSize: 18,
        //  fontWeight: "600",
          position:'relative',
          fontFamily:"Inter_400Regular",
       paddingHorizontal:10,
    },
    sectionDescription: {
        color: "gray",
        fontFamily:"Inter_300Light",
       // paddingHorizontal:25,

    },
    ToDoAndApplications:{
        flexDirection:'column',
        justifyContent:'space-between',
        marginBottom:90,
            },
    toDoList: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 16,
    paddingHorizontal:25,
    },
    ToDocard:{
     width:'70%',
    height:130,
    marginRight:15
    },
    Cardcontent:{
        alignItems: 'center', // Centers items inside Card.Content
        justifyContent: 'center',
    },
    toDoItem: {
        width: "50%",
        borderRadius: 12,
        alignItems: "center",

    },
    toDoText: {
        color: "gray",
    },
    toDoLabel: {
        marginTop: 8,
        fontWeight: "500",
        fontFamily:"Inter_300Light",
        textAlign:'center'


    },
    ToDoAndApplications:{
flexDirection:'row',
justifyContent:'space-between',
marginBottom:90,
    },
    Applicationcard:{
        width:'120%',
        marginTop: 16,
    },
    ApplicationCardcontent:{
        alignItems: 'center', // Centers items inside Card.Content
        justifyContent: 'center',
    },

    pressText: {
        fontWeight: "500",
        fontSize: 15,
        fontFamily:"Inter_300Light",
      },
    pressCard:{
        width:'35%',
        margin:10,
        marginLeft: 20, marginBottom: 30
    },
    pressCardcontent:{
    },
    profileImageContainer: {
        width: 300,
        height: 300,
        borderRadius: 60, // Ensures full circle
        overflow: 'hidden', // Prevents image from going beyond border
        alignSelf: 'flex-start', // גורם לתמונה להיצמד לימין  (הוספה) 
},
    profileImage: {
        width: 300,
        height: 300,
        borderRadius: 150, // Half of width/height
        overflow: 'hidden', // Ensures the content stays within the round shape
      },
      chatIcon:{
        position: "absolute",
        bottom: 5,
        right: 45,
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 12,
        zIndex: 999, // ערך גבוה יותר כדי להבטיח שיופיע מעל כל אלמנט אחר
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // הגדלנו את אטימות הצל
        shadowRadius: 5,
        elevation: 8, // הגדלנו את הבליטה ב-Android
        // הוספת מסגרת דקה להבלטה נוספת
        borderWidth: 1,
        borderColor: "rgba(159, 249, 213, 0.3)", // מסגרת בצבע דומה לאייקון
        marginBottom: 12,
      },
      chatModal:{
          position: 'absolute',
          bottom: 0,
          right: 10,
          width: '40%',
          height: 450,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
      },
      overlay: {
        position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",alignItems: "center",zIndex: 9999,
      },
      
      
});