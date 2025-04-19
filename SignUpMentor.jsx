import React, { useState } from 'react';
import { View,Dimensions ,KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, StyleSheet,Platform,ScrollView} from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular,
  Inter_300Light, Inter_700Bold,Inter_100Thin,
  Inter_200ExtraLight } from '@expo-google-fonts/inter';
  import CustomPopup from "./CustomPopup"; // Import the custom popup
  import Ionicons from '@expo/vector-icons/Ionicons';
  import * as ImagePicker from 'expo-image-picker';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Or any other icon set
  import ModalRN  from 'react-native-modal';
  import LanguageSelector from './LanguageSelector';
import { Button, Checkbox } from 'react-native-paper';
  import AsyncStorage from '@react-native-async-storage/async-storage';
 import AntDesign from '@expo/vector-icons/AntDesign';
 import { useContext } from 'react';
 import { UserContext } from './UserContext'; // adjust the path

  const { width,height } = Dimensions.get('window');


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
     const [PasswordError, setPasswordError] = React.useState(""); //for validating the Email
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
     const [selectedStatuses, setSelectedStatuses] = React.useState([]);
     const statuses = [
       "I'm just getting started! (0 years)",
       "I have some experience, but I'm still learning! (1-2 years)",
       "I'm building my career and expanding my skills. (2-4 years)",
       "I am an experienced professional in my field. (5-7 years)",
       "I have extensive experience and lead projects. (8+ years)",
       "I'm a seasoned expert in my area. (10+ years)"
     ];
     const [Companytext, setCompanyText] = React.useState("");
     const [CompanyError, setCompanyError] = React.useState(""); //for validating the Last name
   
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
     const [base64Image, setBase64Image] = React.useState(null);//chat idea for storing images
   
     const pickImage = async () => {
             {/* Image Upload Component */}
                     {/** <View style={styles.section}>
                           <UploadPage />  {/* הצגת הקומפוננטה של העלאת תמונה */}
                     {/**   </View> 
                      */}   
       let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
         base64: true, // Add this line
   
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
       setSelectedStatuses([status]); // Only allow one status at a time
     };
   
     const addNewUser=async (FirstNametext,LastNametext,Emailtext,Passwordtext,selectedFields,
       selectedStatuses,selectedLanguages,
       FacebookLink,LinkedInLink,Companytext ,selectedMentoring)=>{
         try{
           console.log("Sending request to API...");
       const isMentor=true;
       const API_URL = "https://proj.ruppin.ac.il/igroup11/prod/api/Mentors" 

       if (base64Image===null) {
        const defaultBase64 =`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAPmA+gDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAcIBQYCAwQB/8QASxABAAEDAgIGBgUHCgQGAwAAAAECAwQFEQYHEiExQVFhExQicYGRFSNSocEIMjNDcrHRFiQ0QmJjgqLC8FNUktIXc4Oj4fFWk5T/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAHBEBAQEBAQADAQAAAAAAAAAAAAERAjESQVEh/9oADAMBAAIRAxEAPwCbQHVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGT0jhriHXqujo2iZub17TVZs11Ux757IbppfILmDqERV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`
        setBase64Image(defaultBase64);
      }
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
               CareerField: selectedFields, // Assuming this is an array
               Experience: selectedStatuses[0] ,// Send only one status
               Picture: base64Image, // Save the base64 image in 
               Language: selectedLanguages,  // Send the dummy language
               FacebookLink: FacebookLink,  // Send the dummy Facebook link
               LinkedInLink: LinkedInLink,  // Send the dummy LinkedIn link
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
        const userData = await response.json(); // Retrieve the full user details
   // Extract only the fields you need (e.g., password, email, id)
   const filteredUserData = {
    password: userData.password, // This is just an example; never store raw passwords without encryption
    email: userData.email,       // Store the email if needed
    id: userData.userID,      // Store the user id if needed
    // Add other fields you want to save here
  };
  console.log("filtered",filteredUserData)
    //store the full user data if needed
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
    {selectedStatuses.length ? selectedStatuses.join(', ') : 'Select Your Professional Status'}
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
          status={selectedStatuses.includes(status) ? 'checked' : 'unchecked'} 
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
 {/*</View> */}
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
                      selectedStatuses, selectedLanguages, FacebookLink, LinkedInLink,Companytext,selectedMentoring) }}>SIGN UP</Text>
        </TouchableOpacity>
      </View>


    
    </View>
    </ScrollView>
  );
};

const Webstyles = StyleSheet.create({
  scrollViewContent: {
    //flexGrow: 1,
   // paddingHorizontal: 16,
    paddingBottom: 20,  // To ensure some space at the bottom
  },
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'white',
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
  cameraIconAfter: {
    color: 'white',
    fontSize: 18,
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
    //padding:1,
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
  width: '50%', // adjust as necessary
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
  //flex:1,
 // marginBottom: 1, // Margin between input and error message
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
  //flex:1,
 // marginBottom: 1, // Margin between input and error message
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
    width: 100, // Set a fixed width
    height: 100, // Set a fixed height (same as width)
    borderRadius: 50, // Half of width/height to make it round
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  
});
const styles = StyleSheet.create({
  container: {
 
  }, 
  scrollViewContent: {
    flexGrow: 1,
   // paddingHorizontal: 16,
    paddingBottom: 20,  // To ensure some space at the bottom
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
   // marginVertical: 10,
  },

  loginButton: {
    backgroundColor: '#BFB4FF',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    //marginTop: 10,
   // marginBottom:200,
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
    //marginTop: 30,
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
  cameraIconAfter: {
    color: 'white',
    fontSize: 18,
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
      width: '100%', // adjust as necessary
     // marginBottom: 16,  // Consistent margin between inputs
      // marginTop: 10, // Ensure there's some space between inputs and their error messages
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
      marginBottom: 8, // Margin between input and error message
    },
    modalsInput:{
      //width: 300,
      //padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      fontFamily:'Inter_200ExtraLight',
      fontSize:13,
      height:40,
      //flex:1,
     marginBottom: 7, // Margin between input and error message
    },
  rowPair: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: '1%',  // Adjust the bottom margin for consistent spacing
    height: 'auto',  // Allow the rowPair container to expand as needed,
  },
  
  passwordContainer: {
    width: '100%',
   // height:'60%'
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
    width: 100, // Set a fixed width
    height: 100, // Set a fixed height (same as width)
    borderRadius: 50, // Half of width/height to make it round
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  });
export default SignUpMentor;