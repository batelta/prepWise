import React, { useState } from 'react';
import { View,Dimensions ,KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, StyleSheet,Platform,ScrollView} from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular,
  Inter_300Light, Inter_700Bold,Inter_100Thin,
  Inter_200ExtraLight } from '@expo-google-fonts/inter';
  import CustomPopup from "./CustomPopup"; 
  import Ionicons from '@expo/vector-icons/Ionicons';
  import * as ImagePicker from 'expo-image-picker';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
  import ModalRN  from 'react-native-modal';
  import LanguageSelector from './LanguageSelector';
import { Button, Checkbox } from 'react-native-paper';
  import AsyncStorage from '@react-native-async-storage/async-storage';
 import { useContext } from 'react';
 import { UserContext } from './UserContext'; // adjust the path

  const { width } = Dimensions.get('window');


const SignUpMentor = ({navigation}) => {
  const { setLoggedUser} = useContext(UserContext);

  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

     ///////////////////////////////

     const [FirstNametext, setFirstNameText] = React.useState("");
     const [FirstNameError, setFirstNameError] = React.useState(""); //for validating the first name
   
     const handleFirstNameChange = (text) => {
       setFirstNameText(text);
         // If input is empty, clear the error message
       if(!text.trim()) {
         setFirstNameError(""); 
        // If input is not valid (only letters, max 15), show error message// .test() checks if the input matches the regex pattern
       } else if (!/^[A-Za-z]{1,15}$/.test(text)) {
         setFirstNameError("Only letters, up to 15 characters.");
       } else {
         setFirstNameError(""); // Clear error if input becomes valid
       }
     };
   
     const [LastNametext, setLastNameText] = React.useState("");
     const [LastNameError, setLastNameError] = React.useState(""); //for validating the Last name
   
     const handleLastNameChange = (text) => {
       setLastNameText(text);
      // If input is empty, clear the error message
     if (!text.trim()) {
       setLastNameError(""); // Clear error if input is empty// .test() checks if the input matches the regex pattern
     } else if (!/^[A-Za-z]{1,15}$/.test(text)) {
       setLastNameError("Only letters, up to 15 characters.");
     } else {
       setLastNameError(""); // Clear error if input becomes valid
     }
   };
   
     const [Emailtext, setEmailText] = React.useState("");
     const [EmailError, setEmailError] = React.useState(""); //for validating the Email
   
     const handleEmailChange = (text) => {
       setEmailText(text);
      // If input is empty, clear the error message
      if (!text.trim()) {
       setEmailError(""); // Clear error if input is empty // .test() checks if the input matches the regex pattern
     } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
       setEmailError("Enter a valid email address.");
     } else {
       setEmailError(""); // Clear error if input becomes valid
     }
   };
   
   const [secureText, setSecureText] = React.useState(true); // State to toggle password visibility
     const [Passwordtext, setPasswordText] = React.useState("");
     const [PasswordError, setPasswordError] = React.useState(""); //for validating the password
     const handlePasswordChange = (text) => {
       setPasswordText(text);
      // If input is empty, clear the error message
      if (!text.trim()) {
       setPasswordError(""); // Clear error if input is empty // .test() checks if the input matches the regex pattern
     } else if (!/[A-Za-z0-9]{5,10}$/.test(text)) {
       setPasswordError("Password must be 5-10 characters.");
     } else {
       setPasswordError(""); // Clear error if input becomes valid
     }
   };
   
   //this is sent as a prop to language selector component
   const [selectedLanguages, setSelectedLanguages] = React.useState([]);
   
     const [FacebookLink, setFacebookLink] = React.useState("");
     const [FacebookLinkError, setFacebookLinkError] = React.useState(""); 
     const handleFacebookLinkChange = (text) => {
       setFacebookLink(text);
       if (!text.trim()) {
         setFacebookLinkError(""); 
       } else if (!/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?(\#)?&%=+_\-\/]+$/.test(text)) {
         setFacebookLinkError("Enter a valid Facebook URL.");
       } else {
         setFacebookLinkError(""); 
       }
     };
   
     const [LinkedInLink, setLinkedInLink] = React.useState("");
     const [LinkedInLinkError, setLinkedInLinkError] = React.useState(""); 
   
     const handleLinkedInLinkChange = (text) => {
       setLinkedInLink(text);
       if (!text.trim()) {
         setLinkedInLinkError(""); 
       } else if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+$/.test(text)) {
         setLinkedInLinkError("Enter a valid LinkedIn URL.");
       } else {
         setLinkedInLinkError(""); 
       }
     };
   
     const [fieldModalVisible, setFieldModalVisible] = React.useState(false);
     const [selectedFields, setSelectedFields] = React.useState([]);
     const Fields = ["Software Engineering", "Data Science", "Product Management", "UI/UX Design"];
   
     const [statusModalVisible, setStatusModalVisible] = React.useState(false);
     const [selectedStatus, setSelectedStatus] = React.useState([]);
     const statuses = [
       "I'm just getting started! (0 years)",
       "I have some experience, but I'm still learning! (1-2 years)",
       "I'm building my career and expanding my skills. (2-4 years)",
       "I am an experienced professional in my field. (5-7 years)",
       "I have extensive experience and lead projects. (8+ years)",
       "I'm a seasoned expert in my area. (10+ years)"
     ];
     const [Companytext, setCompanyText] = React.useState("");
     const [CompanyError, setCompanyError] = React.useState(""); //for validating the company name
   
     const handleCompanyChange = (text) => {
        setCompanyText(text);
      // If input is empty, clear the error message
     if (!text.trim()) {
        setCompanyError(""); // Clear error if input is empty// .test() checks if the input matches the regex pattern
     } else if (!/^[A-Za-z]{1,15}$/.test(text)) {
        setCompanyError("Only letters, up to 15 characters.");
     } else {
        setCompanyError(""); // Clear error if input becomes valid
     }
   };

   const [mentoringModalVisible, setMentoringModalVisible] = React.useState(false);
     const [selectedMentoring, setSelectedMentoring] = React.useState([]);
     const mentoringtypes = [
       "Journey ",
       "One-time Session",
       "All-in-One"
     ];
     const [image, setImage] = React.useState(null);
     const [base64Image, setBase64Image] = React.useState("string");
   
     const pickImage = async () => { 
       let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
         base64: true, 
   
       });
   
       if (!result.canceled) {
         console.log(result);
         setImage(result.assets[0].uri);
         setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`); // Convert to base64 format
       }
     };
   
     const toggleField = (field) => {
       setSelectedFields((prev) =>
         prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
       );
     };
     const toggleMentoring = (mentoring) => {
        setSelectedMentoring([mentoring])
      };
     const toggleStatus = (status) => {
      setSelectedStatus(status); // תשמור סטטוס אחד בלבד
     };
   
     const addNewUser=async (FirstNametext,LastNametext,Emailtext,Passwordtext,selectedFields,
      selectedStatus,selectedLanguages,
       FacebookLink,LinkedInLink,Companytext ,selectedMentoring)=>{
         try{
           console.log("Sending request to API...");
       const isMentor=true;
       const API_URL = "https://proj.ruppin.ac.il/igroup11/prod/api/Mentors" 

           const response =await fetch (API_URL, { 
             method: 'POST', // Specify that this is a POST request
             headers: {
               'Content-Type': 'application/json' // Indicate that you're sending JSON data
             },
             body: JSON.stringify({ // Convert the user data into a JSON string
               FirstName: FirstNametext,
               LastName:LastNametext,
               Email: Emailtext,
               Password: Passwordtext,
               CareerField: selectedFields, 
               Experience: selectedStatus ,
               Picture: base64Image, 
               Language: selectedLanguages,  
               FacebookLink: FacebookLink,  
               LinkedInLink: LinkedInLink,  
               IsMentor:isMentor,
               Company:Companytext,
               MentoringType:selectedMentoring[0]
             })
           });
           console.log(base64Image)
           console.log("response ok?", response.ok);

           if(response.ok)
            {
             console.log('User successfully added');
             // Now login to get full user data and save it
             await loginAsUser(Emailtext, Passwordtext);
       
            }
       
       if(!response.ok){
         setErrorPopupVisible(true)
         throw new Error('failed to post new user')
       }
         }catch(error){
       console.log(error)
         }
     }
   
  //////////////////////////
///here we are fetching the new user info from our database in order to save his info in the local storage
const loginAsUser = async (email, password) => {
    try {
      console.log("Sending request to API...");
      const API_URL =  "https://proj.ruppin.ac.il/igroup11/prod/api/Users/SearchUser"
      
  
      const response = await fetch(API_URL, {
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
          IsMentor: true
        })
      });
  
      console.log("response ok?", response.ok);
  
      if (response.ok) {
        console.log('User found');
        const userData = await response.json(); // get the full user details
   // get only the fields you need (password, email, id)
   const filteredUserData = {
    password: userData.password, 
    email: userData.email,       
    id: userData.userID,      
  };
  console.log("filtered",filteredUserData)
    //store the user data 
    await AsyncStorage.setItem("user", JSON.stringify(filteredUserData));
    setLoggedUser(filteredUserData);
        setSuccessPopupVisible(true);
  
      } else {
        setErrorPopupVisible(true);
        throw new Error('Failed to find user');
      }
  
    } catch (error) {
      console.log(error);
    }
  };

  const [fontsLoaded] = useFonts({
      Inter_400Regular,
      Inter_700Bold,
      Inter_100Thin,
      Inter_200ExtraLight,
      Inter_300Light
    });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const appliedStyles = Platform.OS === 'web' ? Webstyles : styles;
  
  return (

<ScrollView contentContainerStyle={styles.scrollViewContent}>
    
    <View style={appliedStyles.container}>
       
    {/**  <Image source={require('./assets/prepWise Logo.png')}
      style={styles.logo}/> */}
      {successPopupVisible && (
            <View style={styles.overlay}>
                    <CustomPopup visible={successPopupVisible}
                  onDismiss={() => {
                    setSuccessPopupVisible(false);
                    navigation.navigate("HomePageMentor"); // Navigate after closing popup
                  }}
                    icon="check-circle" message="User Signed Up successfully!"
                     />
                     </View>   )}
                     {errorPopupVisible && (
            <View style={styles.overlay}>
                    <CustomPopup visible={errorPopupVisible}
                  onDismiss={() => {
                    setErrorPopupVisible(false);
                  }}
                    icon="alert-circle-outline" message="Failed to sign Up!"
                     />
                     </View>   )}
      <View style={appliedStyles.loginBox}>
      
                     {image ? (
  <View style={appliedStyles.imageAndIconContainer}>
    <Image source={{ uri: image }} style={appliedStyles.profileImage} />
    <TouchableOpacity onPress={pickImage} style={appliedStyles.cameraButtonAfter}>
      <Ionicons name="camera-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>
) : (
  <View style={appliedStyles.imageAndIconContainer}>
    <View style={appliedStyles.avatarContainer}>
      <Image source={require('./assets/defaultProfileImage.jpg')}style={appliedStyles.profileImage}></Image>
    </View>
    <TouchableOpacity onPress={pickImage} style={appliedStyles.cameraButtonAfter}>
      <Ionicons name="camera-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>
)}


<View style={appliedStyles.rowPair}>
  <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>First Name</Text>

  <TextInput
    style={appliedStyles.halfInput}
    placeholder="First Name"
    placeholderTextColor="#888"
    value={FirstNametext}
    onChangeText={handleFirstNameChange}
  />
  {FirstNameError ? <Text style={{ color: "#003D5B",marginBottom:'1%' }}>{FirstNameError}</Text> : null}

</View>

<View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>Last Name</Text>
  <TextInput
    style={appliedStyles.halfInput}
    placeholder="Last Name"
    placeholderTextColor="#888"
    value={LastNametext}
    onChangeText={handleLastNameChange}
  />
{LastNameError ? <Text style={{ color: "#003D5B",marginBottom:'1%' }}>{LastNameError}</Text> : null}

  </View>
</View>


<View style={appliedStyles.rowPair}>
<View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>Email</Text>
        <TextInput
    style={appliedStyles.halfInput}
    placeholder="Email"
          placeholderTextColor="#888"
          value={Emailtext}
          onChangeText={handleEmailChange}
        />
        {EmailError ? <Text style={{ color: "#003D5B",marginBottom:'1%' }}>{EmailError}</Text> : null}
        </View>

        <View style={appliedStyles.passwordContainer}>
        <View style={appliedStyles.inputBlock}>
        <Text style={appliedStyles.inputTitle}>Password</Text>
  <TextInput
    style={[appliedStyles.halfInput, { paddingRight: 40 }]} // Add padding to prevent text hiding under icon
    secureTextEntry={secureText}
    placeholder="Enter password"
    placeholderTextColor="#888"
    value={Passwordtext}
    onChangeText={handlePasswordChange}
  />
  <TouchableOpacity onPress={() => setSecureText(!secureText)} style={appliedStyles.eyeIcon}>
    <Icon name={secureText ? 'eye-off' : 'eye'} size={24} color="#BFB4FF" />
  </TouchableOpacity>
  
  </View>
  {PasswordError ? <Text style={{ color: "#003D5B",marginBottom:'1%' }}>{PasswordError}</Text> : null}

</View>


    </View>
   
<View style={appliedStyles.rowPair}>

  {/* Fields Modal */}
  <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>Career Fields</Text>
  <Button 
    mode="outlined" 
    onPress={() => setFieldModalVisible(true)} 
    style={appliedStyles.modalsInput}  
    contentStyle={appliedStyles.modalText} 
    labelStyle={appliedStyles.modalLabelText}
  >

    {selectedFields.length ? selectedFields.join(', ') : 'Select Your Career Fields'}
  </Button>
  </View>

  <ModalRN 
    isVisible={fieldModalVisible} 
    onBackdropPress={() => setFieldModalVisible(false)} 
    onBackButtonPress={() => setFieldModalVisible(false)}
    style={{ justifyContent: 'flex-end', margin: 0 }} // ⬅️ makes it appear from the bottom

  >
    <View style={appliedStyles.modalBox}>
      {Fields.map((field, index) => (
        <Checkbox.Item 
          key={index} 
          label={field} 
          status={selectedFields.includes(field) ? 'checked' : 'unchecked'} 
          onPress={() => toggleField(field)} 
        />
      ))}
      <Button onPress={() => setFieldModalVisible(false)}>Done</Button>
    </View>
  </ModalRN>

  {/* Status Modal */}
  <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>Years Of Experience</Text>
  <Button 
    mode="outlined" 
    onPress={() => setStatusModalVisible(true)} 
    style={appliedStyles.modalsInput} 
    contentStyle={appliedStyles.modalText} 
    labelStyle={appliedStyles.modalLabelText}
  >
    {selectedStatus ? selectedStatus : 'Select Your Professional Status'}
  </Button>
  </View>

  <ModalRN 
    isVisible={statusModalVisible} 
    onBackdropPress={() => setStatusModalVisible(false)} 
    onBackButtonPress={() => setStatusModalVisible(false)}
    style={{ justifyContent: 'flex-end', margin: 0 }} // ⬅️ makes it appear from the bottom

  >
    <View style={appliedStyles.modalBox}>
      {statuses.map((status, index) => (
        <Checkbox.Item 
          key={index} 
          label={status} 
          status={selectedStatus === status ? 'checked' : 'unchecked'} 
          onPress={() => toggleStatus(status)} 
        />
      ))}
      <Button onPress={() => setStatusModalVisible(false)}>Done</Button>
    </View>
  </ModalRN>

</View>

          
<View style={appliedStyles.rowPair}>
<View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>Facebook</Text>

<TextInput 
                    onChangeText={handleFacebookLinkChange}
                    style={appliedStyles.halfInput} 
                    placeholder="Facebook Link (Optional)"
                    placeholderTextColor="#888"
                    value={FacebookLink} />
 {FacebookLinkError ? <Text style={{ color: "#003D5B",marginBottom:'1%' }}>{FacebookLinkError}</Text> : null}                 
      </View>
      <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>LinkedIn</Text>
                  <TextInput  
                    onChangeText={handleLinkedInLinkChange} 
                    style={appliedStyles.halfInput} 
                    placeholder="LinkedIn Link (Optional)"
                    placeholderTextColor="#888"
                    value={LinkedInLink} />
 {LinkedInLinkError ? <Text style={{ color: "#003D5B",marginBottom:'1%' }}>{LinkedInLinkError}</Text> : null}
                    </View>
  </View>
  <View style={appliedStyles.rowPair}>
  <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>Company</Text>

<TextInput 
                    onChangeText={handleCompanyChange}
                    style={appliedStyles.halfInput} 
                    placeholder="Company (Optional)"
                    placeholderTextColor="#888"
                    value={Companytext} />
 {CompanyError ? <Text style={{ color: "#003D5B",marginBottom:'1%' }}>{CompanyError}</Text> : null}                 
      </View>
 
  {/* Mentoring type Modal */}
  <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.inputTitle}>Mentoring Type</Text>
  <Button 
    mode="outlined" 
    onPress={() => setMentoringModalVisible(true)} 
    style={appliedStyles.modalsInput}  
    contentStyle={appliedStyles.modalText} 
    labelStyle={appliedStyles.modalLabelText}
  >

    {selectedMentoring.length ? selectedMentoring.join(', ') : 'Select Your Mentoring Type'}
  </Button>
  </View>

  <ModalRN 
    isVisible={mentoringModalVisible} 
    onBackdropPress={() => setMentoringModalVisible(false)} 
    onBackButtonPress={() => setMentoringModalVisible(false)}
    style={{ justifyContent: 'flex-end', margin: 0 }} // ⬅️ makes it appear from the bottom

  >
    <View style={appliedStyles.modalBox}>
      {mentoringtypes.map((mentor, index) => (
        <Checkbox.Item 
          key={index} 
          label={mentor} 
          status={selectedMentoring.includes(mentor) ? 'checked' : 'unchecked'} 
          onPress={() => toggleMentoring(mentor)} 
        />
      ))}
      <Button onPress={() => setMentoringModalVisible(false)}>Done</Button>
    </View>
  </ModalRN>
</View>
<View style={appliedStyles.languageContainer}>
 <Text style={appliedStyles.inputTitle}>Language</Text>
    <LanguageSelector
                selectedLanguages={selectedLanguages} 
                setSelectedLanguages={setSelectedLanguages}
              />
</View>
        <View style={appliedStyles.rowContainer}>
       {/**  <Text style={appliedStyles.forgotText}>Forgot Password?</Text> */}
        </View>
        <View style={{flexDirection:'row',marginTop:30,marginBottom:25}}>
      <Text style={appliedStyles.footer}>Already have an account?</Text>
      <Text style={appliedStyles.CreateAccounttext}
      onPress={()=> navigation.navigate('SignIn')}>Login Here</Text>
      </View>
        <TouchableOpacity style={appliedStyles.loginButton}>
          <Text style={appliedStyles.loginText} onPress={() => {addNewUser(FirstNametext, LastNametext, Emailtext, Passwordtext, selectedFields, 
                      selectedStatus, selectedLanguages, FacebookLink, LinkedInLink,Companytext,selectedMentoring) }}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

    </View>
    </ScrollView>
  );
};

const Webstyles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 20,  
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  loginBox: {
    width: 700,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
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
  overlay: 
  {position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",alignItems: "center",zIndex: 9999,
  },

  profileImage:{
    width: 100,
     height: 100, 
     borderRadius: 50,
      marginTop: 20, 
      borderWidth: 2,
       borderColor: '#BFB4FF',
       mode:"contained",

  },
  cameraButtonAfter: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    backgroundColor: '#d6cbff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  imageAndIconContainer: {
    flexDirection: 'row',
    position:'relative',
    alignSelf: 'center',
    marginLeft: 10,
    marginBottom: 20,
    marginTop:10,
  },

 
  languageContainer:{
    paddingLeft:20,
    alignSelf:'center',
    fontFamily:'Inter_200ExtraLight',
    fontSize:13,
    width: '50%',
    height: 40,
    marginTop:10,
    marginBottom:15,
    flex: 1,

},
modalText:{
  justifyContent: 'left', 
  borderRadius: 10,
  paddingLeft:10,

},
modalLabelText:{
  color: "#888", 
  fontSize:13,
   fontFamily:'Inter_200ExtraLight', 
   marginLeft:1,

  },
 
inputBlock: {
  width: '50%', 
},

inputTitle: {
  fontSize: 14,
  marginBottom: 10,
  color: '#003D5B',
},
halfInput: {
  width: 300,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  fontFamily:'Inter_200ExtraLight',
  fontSize:13,
  height:35

},
rowPair: {
flexDirection: 'row',
gap:20,
justifyContent:'flex-start',
alignSelf:'center',
marginBottom:10,
width:'90%'
},
modalsInput:{
  width: 300,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  fontFamily:'Inter_200ExtraLight',
  fontSize:13,
  height:35

},
  passwordContainer: {
    width: '99%',
  },
  eyeIcon: {
    position: 'absolute',
    right:0,
    top: '70%',
    transform: [{ translateY: -12 }],
    zIndex: 1
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    width: '50%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainer: {
    backgroundColor: '#fff',
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  
});
const styles = StyleSheet.create({

  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, 
  },
  
  loginBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  loginButton: {
    backgroundColor: '#BFB4FF',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  CreateAccounttext: {
    textDecorationLine: 'underline',
    color: '#003D5B',
    fontFamily:'Inter_400Regular',
  },
  loginText: {
    color: 'white',
    fontFamily: 'Inter_400Regular',
  },
  overlay: 
  {position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",alignItems: "center",zIndex: 9999,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#BFB4FF',
  },
  modalLabelText:{
    color: "#888", fontSize:13,
     fontFamily:'Inter_200ExtraLight',
      marginLeft:1,
  },
  cameraButtonAfter: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    backgroundColor: '#d6cbff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  
  imageAndIconContainer: {
    flexDirection: 'row',
    position:'relative',
    alignSelf: 'center',
    marginLeft: 10,
    marginBottom: 20,
    marginTop:10,
  },

  languageContainer: {
    paddingLeft: 0,
    alignSelf: 'center',
    fontFamily: 'Inter_200ExtraLight',
    fontSize: 13,
    width: '100%',
    marginTop: 5,
    marginBottom: 40,
    zIndex:1,
  },

    inputBlock: {
      width: '100%', 
    maxHeight:'auto'
    },
  
    inputTitle: {
      fontSize: 14,
      marginBottom: 5,
      color: '#003D5B',
    },
    halfInput: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      fontFamily:'Inter_200ExtraLight',
      fontSize:13,
      marginBottom: 8, 
    },
    modalsInput:{
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      fontFamily:'Inter_200ExtraLight',
      fontSize:13,
      height:40,
     marginBottom: 7, 
    },
  rowPair: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: '1%',  
    height: 'auto',  
  },
  
  passwordContainer: {
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '62%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    width: width * 0.9,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText:{
    justifyContent: 'left', 
    borderRadius: 10,
    paddingLeft:10,

  },
  avatarContainer: {
    backgroundColor: '#fff',
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  });
export default SignUpMentor;