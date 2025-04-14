
import React, { useState } from 'react';
import { View,Dimensions,ScrollView, Text, TextInput, TouchableOpacity, Image, StyleSheet,Platform } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from 'expo-font';
import { Inter_400Regular,
  Inter_300Light, Inter_700Bold,Inter_100Thin,
  Inter_200ExtraLight } from '@expo-google-fonts/inter';
  import CustomPopup from "./CustomPopup"; // Import the custom popup
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Or any other icon set

  const { height,width } = Dimensions.get('window');

const SignIn = ({navigation}) => {

  const [isMentor, setIsMentor]=useState(false)
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

   const loginAsUser=async (email,password )=>{
        try{
          console.log("Sending request to API...");
      const API_URL = Platform.OS === 'web'  //changed the url for web and phone
    ? "http://localhost:5062/api/Users/SearchUser" 
    : "http://192.168.30.157:5062/api/Users/SearchUser";
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

            await AsyncStorage.setItem("user", JSON.stringify(userData));
            setIsMentor(userData.isMentor)
            console.log(userData.isMentor)
            setSuccessPopupVisible(true)
      
           }
      
      if(!response.ok){
        setErrorPopupVisible(true)
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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [secureText, setSecureText] = React.useState(true); // State to toggle password visibility

   const appliedStyles = Platform.OS === 'web' ? Webstyles : styles;
  
  return (
    
    <ScrollView keyboardShouldPersistTaps="handled">
  {successPopupVisible && (
            <View style={styles.overlay}>
                    <CustomPopup visible={successPopupVisible}
                  onDismiss={() => {
                    setSuccessPopupVisible(false);
                    if(isMentor)
                    navigation.navigate("HomePageMentor"); // Navigate after closing popup
                  else
                  navigation.navigate("HomePage");
                  }}
                    icon="check-circle" message="User Logged In successfully!"
                     />
                     </View>   )}
                     {errorPopupVisible && (
            <View style={styles.overlay}>
                    <CustomPopup visible={errorPopupVisible}
                  onDismiss={() => {
                    setErrorPopupVisible(false);
                  }}
                    icon="alert-circle-outline" message="Failed to Log In!"
                     />
                     </View>   )}
    <View style={appliedStyles.container}>
  
    {/**  <Image source={require('./assets/prepWise Logo.png')}
      style={styles.logo}/> */}
      <View style={appliedStyles.loginBox}>
        <View style={appliedStyles.popup}>
     
                     </View>
        <View  style={appliedStyles.avatarContainer}>
        <AntDesign name="user" size={60} color="white"/>
        </View>
        <TextInput
          style={appliedStyles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={appliedStyles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
        />
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={appliedStyles.eyeIcon}>
            <Icon name={secureText ? 'eye-off' : 'eye'} size={24} color="#BFB4FF" />
          </TouchableOpacity>
     {/**   <View style={styles.rowContainer}>
          <Text style={styles.forgotText}>Forgot Password?</Text>  
        </View> */}
        <View style={{flexDirection:'row',marginTop:30,marginBottom:20}}>
      <Text style={appliedStyles.footer}>Don't have an account? </Text>
      <Text style={appliedStyles.CreateAccounttext}
      onPress={()=> navigation.navigate('SignUp')}>Create Account</Text>
      </View>
        <TouchableOpacity style={appliedStyles.loginButton}>
          <Text style={appliedStyles.loginText} onPress={() => loginAsUser(email, password)}>LOGIN</Text>
        </TouchableOpacity>
      </View>


    
    </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',    // Vertical center
    alignItems: 'center',        // Horizontal center
    backgroundColor: '#f9f9f9',
    height:height
  },
  loginBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    //alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,

  },
  
  avatarContainer: {
    backgroundColor: '#BFB4FF',
    width: 80, 
    height: 80, 
    borderRadius: 40,
    justifyContent: 'center',
    alignSelf:'center',
    alignItems: 'center',
    marginBottom: 20,  // Add space below avatar
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    fontFamily: 'Inter_200ExtraLight',
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#BFB4FF',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,  // Add margin to separate button from inputs
  },
  CreateAccounttext: {
    textDecorationLine: 'underline',
    color: '#003D5B',
  },
  overlay: 
  {position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",alignItems: "center",zIndex: 9999,
  },
  loginText: {
    color: 'white',
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    fontFamily: 'Inter_200ExtraLight',
    fontSize: 14,
    color: '#555',
  },
  eyeIcon: {
    position: 'absolute',
    right: 30,
    top: '60%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
});


const Webstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#white',
  },
  loginBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  avatarContainer: {
    backgroundColor: '#BFB4FF',
    width: 80, // Set a fixed width
    height: 80, // Set a fixed height (same as width)
    borderRadius: 40, // Half of width/height to make it round
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    fontFamily:'Inter_200ExtraLight',
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },

  forgotText: {
    color: '#BFB4FF',
    fontFamily:'Inter_200ExtraLight',

  },
  loginButton: {
    backgroundColor: '#BFB4FF',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  CreateAccounttext:{
    textDecorationLine:'underline',
    color:'#003D5B',
  },
  loginText: {
    color: 'white',
    fontFamily:'Inter_400Regular',

  },
  popup:{
zIndex:1000
  },
  eyeIcon: {
    position: 'absolute',
    right:30,
    top: '54%',
    transform: [{ translateY: -12 }],
    zIndex: 1
  },
});

export default SignIn;