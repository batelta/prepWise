import { View, Text,Dimensions, ScrollView, Image, TouchableOpacity, Platform, StyleSheet, SafeAreaView, Alert } from "react-native";
import NavBar from "../NavBar";
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { Inter_400Regular,
  Inter_300Light, Inter_700Bold,Inter_100Thin,
  Inter_200ExtraLight } from '@expo-google-fonts/inter';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import GeminiChat from '../GeminiChat';
import { useContext } from 'react';
import { UserContext } from '../UserContext'; 
import { Card ,RadioButton,TextInput,Button,Appbar,Icon } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalRN  from 'react-native-modal';
  const { width } = Dimensions.get('window');
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from "@react-navigation/native";
import CalendarScreen from '../CalendarScreen'
import StarRating from 'react-native-star-rating-widget';
import { FileUp } from 'lucide-react-native'; // optional icon

export default function Query(){
    const { Loggeduser } = useContext(UserContext);
    const navigation = useNavigation();

    const apiUrlStart ="http://localhost:5062"

    const [userType, setUserType] = useState('');

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light
      });
    
    // This runs only once when Loggeduser is first set
useEffect(() => {
    if (Loggeduser?.id) {
      loginAsUser(Loggeduser.email, Loggeduser.password);
    }
  }, [Loggeduser?.id]);

  const loginAsUser=async (email,password )=>{
    console.log(email,password,Loggeduser.password)

    try{
      console.log("Sending request to API...");
  const API_URL = `${apiUrlStart}/api/Users/SearchUser` 
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
            Roles: ["String"], // Convert to an array
            Company: ["String"], // Convert to an array
            Experience: "String",
            Picture: "String",
            Language: ["String"], // Convert to an array
            FacebookLink: "String",
            LinkedInLink: "String",
            IsMentor:false
        })
      });

      console.log("response ok?", response.ok);

      if(response.ok)
       {
        console.log('user found ')
        
          // Convert response JSON to an object
        const userData = await response.json();
        console.log(userData)
        console.log('IsMentor value:', userData?.isMentor);

        const type = userData?.isMentor ? 'mentor' : 'jobSeeker';
        setUserType(type)
        console.log('user type:',type )
       }
  
  if(!response.ok){
    throw new Error('failed to find user')
  }
    }catch(error){
  console.log(error)
    }
}     
  const [showChat, setShowChat] = useState(false);
    const appliedStyles = Platform.OS === 'web' ? Webstyles : styles;
    const LogoImage = () => {
        if (Platform.OS === "ios") {
            return <Image source={require('../assets/prepWise Logo.png')} style={appliedStyles.logo} />;
        }
    };

///for the feedback
    const [rating, setRating] = useState(0);

  
      console.log("rate:",rating)
    

        const pageTitle = userType === 'mentor'
        ? 'Help Us Understand Your Mentoring Style 🫱🏼‍🫲🏼'
        : 'To Find Your Perfect Mentor, Tell Us a Bit About You 🙂';
    
      const pageSubtitle = userType === 'mentor'
        ? 'Your answers will help us match you with mentees who benefit from your unique strengths.'
        : 'Your answers will help us connect you with a mentor who truly fits your learning and communication style.';
  return(<>
<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
<ScrollView
    contentContainerStyle={{ paddingBottom: 60 }}
    style={{ flex: 1 }}
  >
    <View>
    <Appbar.Header>
        <Appbar.Content title="My App" />
        <Appbar.Action icon={() => <Icon name="bell-outline" size={24} color="white" />} onPress={() => {}} />
    </Appbar.Header>
    </View>
                {/** logo component is here only for mobile*/}
                <LogoImage />
  
                <View style={appliedStyles.Topview}>
              
        <Card style={appliedStyles.screenCard}>
        <Text style={appliedStyles.title}>Your Session Space</Text>
          <Card.Title 
            title={<Text style={appliedStyles.subtitle}>Schedule, share, prep, reflect — all in one place. Come back anytime to update!</Text>}
           />
             <Text style={appliedStyles.subtitle}>Date&Time 🗓️</Text>
             <Text style={appliedStyles.subtitlesmall}>Pick a time that works for you. We’ll send reminders and let your mentor know too!</Text>
                         <CalendarScreen/>

               <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.subtitle}>Link 🔗</Text>
<Text style={appliedStyles.subtitlesmall}>Got the link already? Drop it here. If not — you can come back and add it anytime.</Text>

<TextInput 
                    style={appliedStyles.halfInput} 
                    placeholder="Paste your Zoom, Meet, or Teams link here"
                    placeholderTextColor="#888"
                    contentStyle={{backgroundColor:"#FFF"
                    }}
                    mode="outlined"
                     />
      </View>            
{/**FILES SECTION */}
      <Text style={appliedStyles.subtitle}>Attach Files 📂</Text>
      <Text style={appliedStyles.subtitlesmall}>Want to share a resume, portfolio, or notes before the session? Upload here — you can always add more later.</Text>


      <Card style={{ padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', borderRadius: 12 }}>
      <FileUp size={32} color="#BFB4FF" style={{ alignSelf: 'center' }}/>
      <Text style={{ marginTop: 10, color: '#555', fontWeight: '600',textAlign: 'center' }}>Upload a file</Text>
      <Text style={{ fontSize: 12, color: '#999',textAlign: 'center' }}>(PDF, Image, or Docs — optional)</Text>
      <Button  mode="contained" style={{ marginTop: 10 }}>Choose File</Button>
    </Card>






{/** */}

{/**FEEDBACK SECTION */}
<Text style={appliedStyles.subtitle}>Give Feedback 📃</Text>
      <Text style={appliedStyles.subtitlesmall}>How was the session? </Text>
 
<Text style={appliedStyles.subtitlesmall}>Anything you'd like to share?</Text>

<TextInput 
                    style={appliedStyles.halfInput} 
                    placeholder="The session was really helpful because..."
                    placeholderTextColor="#888"
                    contentStyle={{backgroundColor:"#FFF"
                    }}
                    mode="outlined"
                     />

<Text style={appliedStyles.subtitlesmall}>Slide through the stars to rate(
        1 – Needs work,
        2 – Okay,
        3 – Good,
        4 – Great,
        5 – Excellent! )</Text>

      <StarRating
        rating={rating}
        onChange={setRating}
      />

<Text style={appliedStyles.subtitlesmall}>This is your space to reflect or shout out something awesome. Your feedback helps us and your mentor grow — but no pressure, you can always come back later.😊</Text>



{/** */}
          <Card.Content>



        



      <TouchableOpacity   style={appliedStyles.loginButton}
  onPress={() =>  console.log('pressed')}
>
      <Text style={appliedStyles.loginText}>SUBMIT</Text>
        </TouchableOpacity>
          </Card.Content>
        </Card>

        </View>



                       {/* Bot Icon */}
 <TouchableOpacity
  style={appliedStyles.chatIcon}
  onPress={() => setShowChat(!showChat)}
>
<FontAwesome6 name="robot" size={24} color="#9FF9D5" />
</TouchableOpacity>
<NavBar />

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
</>
  );


}

const styles = StyleSheet.create({
  
    title: {
      fontSize: 20,
      marginTop: 8,
      fontFamily:"Inter_300Light"
    },
    subtitle:{
      fontSize: 15,
      //  marginTop: 8,
        fontFamily:"Inter_300Light",

  },
subtitlesmall:{
  fontSize: 13,
  //  marginTop: 8,
    fontFamily:"Inter_300Light",

},
    inputBlock: {
        width: '50%', 
      },
      inputTitle: {
        fontSize: 13,
        marginTop: 8,
        fontFamily:"Inter_300Light"

      },
      halfInput: {
        width: '150%',
        height:40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor:'#fff',
        borderRadius: 5,
        fontFamily:'Inter_200ExtraLight',
        fontSize:13,
        marginBottom: 8, 
      },
      descriptionCard:{
        width:'100%',
        marginTop: 16,
           elevation:1,
          shadowColor:'#E4E0E1'
      },
   
    chatIcon:{
        position: "absolute",
        bottom: 65,
        right: 45,
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 12,
        zIndex: 999, // ערך גבוה יותר כדי להבטיח שיופיע מעל כל אלמנט אחר
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // הגדלנו את אטימות הצל
        shadowRadius: 5,
        elevation: 8, 
        borderWidth: 1,
        borderColor: "rgba(159, 249, 213, 0.3)", // מסגרת בצבע דומה לאייקון
        marginBottom: 12,
      },
    chatModal:{
        position: 'absolute',
        bottom: 0,
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
      loginButton: {
        backgroundColor: '#BFB4FF',
        padding: 12,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
      },
      loginText: {
        color: 'white',
        fontFamily: 'Inter_400Regular',
      },
      screenCard:{
         margin: 20,
          padding: 16 ,
          width:'110%',
          alignSelf:'center',
          elevation:2,
          shadowColor:'#E4E0E1'
      },
      Topview:{
         paddingHorizontal: 20, 
         paddingTop:20,
         paddingBottom:40
      },
      Dropcontainer: {
        width: '100%',
      },
      dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom:15

      },
      placeholderStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      selectedTextStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      itemTextStyle: {
        fontFamily: 'Inter_200ExtraLight',
        fontSize: 13,
        color: '#888',
      },
});
const Webstyles = StyleSheet.create({
   
    screenCard:{
      margin: 20,
       padding: 16 
   },
    title: {
        fontSize: 20,
        marginTop: 8,
        fontFamily:"Inter_300Light"

    },
    subtitle:{
        fontSize: 15,
          margin: 8,
          fontFamily:"Inter_300Light",
  
    },
  subtitlesmall:{
    fontSize: 13,
      margin: 8,
      fontFamily:"Inter_300Light",
  
  },
      chatIcon: {
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
        elevation: 8, 
        borderWidth: 1,
        borderColor: "rgba(159, 249, 213, 0.3)", // מסגרת בצבע דומה לאייקון
        marginBottom: 12,
      },
      inputBlock: {
        width: '50%', 
      },
      inputTitle: {
        fontSize: 13,
        marginTop: 8,
        fontFamily:"Inter_300Light"
      },
      halfInput: {
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor:'#fff',
        borderRadius: 5,
        fontFamily:'Inter_200ExtraLight',
        fontSize:13,
        height:35
      },
      descriptionCard:{
        width:'100%',
        marginTop: 16,
      },
      descriptionCardcontent:{
        alignItems: 'center', // Centers items inside Card.Content
       // justifyContent: 'center',
        padding:0,
      },
      
      chatModal:{
          position: 'absolute',
          bottom: 0,
          right: 10,
          width: '30%',
          height: 480,
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
      loginButton: {
        backgroundColor: '#BFB4FF',
        padding: 12,
        borderRadius: 5,
        width: '70%',
        alignItems: 'center',
        alignSelf:'center',
        marginTop:15
      },
      loginText: {
        color: 'white',
        fontFamily:'Inter_400Regular',
    
      },
      Topview:{
        paddingHorizontal: 20, 
        paddingTop: 100 
     },
     Dropcontainer: {
        width: '100%',
      },
      dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
      },
      placeholderStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      selectedTextStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      itemTextStyle: {
        fontFamily: 'Inter_200ExtraLight',
        fontSize: 13,
        color: '#888',
      },
});
