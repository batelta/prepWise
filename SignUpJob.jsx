import * as React from 'react'; 
import { TextInput, Button, Provider as PaperProvider, Modal, Portal, Checkbox, IconButton } from 'react-native-paper';
import { ScrollView, Text ,TouchableOpacity, View, StyleSheet,Image ,KeyboardAvoidingView,Keyboard,Platform,TouchableWithoutFeedback } from 'react-native';
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import LanguageSelector from './LanguageSelector';
import UploadPage from './UploadPage'; // ייבוא הקומפוננטה של העלאת התמונה


const theme = {
  colors: {
    primary: '#BFB4FF',
    accent: '#9FF9D5',
    background: '#fff',
    text: '#003D5B',
    placeholder: '#fff',
    onSurfaceVariant: '#9C9BC2',
    outline: '#f5f5f5',
  },
  roundness: 20,
};

const styles = StyleSheet.create({

  Headline: {
    fontFamily: 'Inter',
    color: '#003D5B',
    fontSize: 48,
    fontWeight: 'regular',
  },
  button: {
    width: '80%',
    marginTop: 40
  },
  textInput: {
    width: '80%',
    marginBottom: 15,
    backgroundColor: '#F2F2F2',
    cursor: 'pointer'

  },
  logo: {
    position: 'relative',
    width: '30%',
    resizeMode: 'contain',
    height:100
  },
  passwordtext: {
    textDecorationLine: 'underline',
    color: '#003D5B',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20, // Center horizontally
    borderRadius: 20,
  },

});

export default function SignUpJob({ navigation }) {

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
    setPasswordError("Password must be 5-10 characters (Numbers/Letters).");
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

  const [image, setImage] = React.useState(null);
  const [base64Image, setBase64Image] = React.useState(null);//chat idea for storing images

  const pickImage = async () => {
          {/* Image Upload Component */}
                    <View style={styles.section}>
                        <UploadPage />  {/* הצגת הקומפוננטה של העלאת תמונה */}
                    </View>
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

  const toggleStatus = (status) => {
    setSelectedStatuses([status]); // Only allow one status at a time
  };

  const addNewUser=async (FirstNametext,LastNametext,Emailtext,Passwordtext,selectedFields,
    selectedStatuses,selectedLanguages,
    FacebookLink,LinkedInLink )=>{
      try{
        console.log("Sending request to API...");
    const isMentor=false;
    const API_URL = Platform.OS === 'web'  //changed the url for web and phone
  ? "http://localhost:5062/api/Users" 
  : "http://192.168.30.157:5062/api/Users";
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
            IsMentor:isMentor
          })
        });
        console.log(base64Image)

        const responseBody = await response.text();  // Use text() instead of json() to handle any response format
        console.log("Response Body:", responseBody);
        if(response.ok)
          console.log('user added!',selectedLanguages)
        //  navigation.navigate('HomePage')
    
    if(!response.ok){
      throw new Error('failed to post new user')
    }
      }catch(error){
    console.log(error)
      }
  }
  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.colors.background }}
            keyboardShouldPersistTaps="handled" // Makes sure the input fields remain focused even after tapping outside
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background, position: 'relative' }}>
              <Image source={require('./assets/prepWise Logo.png')} style={styles.logo} />
              <Text style={styles.Headline}>Sign Up</Text>

              {image ? (
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 20, borderWidth: 2, borderColor: '#BFB4FF' }} />
                  <TouchableOpacity onPress={pickImage} style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#F5F5F5', padding: 5, borderRadius: 50 }}>
                    <IconButton icon="camera-plus-outline" size={10} style={{ width: 10, height: 10 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
                  <IconButton icon="camera-plus-outline" size={20} style={{ backgroundColor: '#BFB4FF' }} />
                </TouchableOpacity>
              )}

              <TextInput label={"Enter First Name"} value={FirstNametext} 
                style={styles.textInput} 
                onChangeText={handleFirstNameChange}
                textColor={theme.colors.text}
                mode="outlined" />
              {FirstNameError ? <Text style={{ color: "red" }}>{FirstNameError}</Text> : null} 

              <TextInput label={"Enter Last Name"} value={LastNametext} 
                style={styles.textInput} 
                onChangeText={handleLastNameChange} 
                textColor={theme.colors.text}
                mode="outlined" />
              {LastNameError ? <Text style={{ color: "red" }}>{LastNameError}</Text> : null}

              <TextInput label={"Enter Email Address"} value={Emailtext} 
                onChangeText={handleEmailChange}
                style={styles.textInput} 
                textColor={theme.colors.text}
                mode="outlined" />
              {EmailError ? <Text style={{ color: "red" }}>{EmailError}</Text> : null}

              <TextInput label={"Enter Password"} value={Passwordtext} 
                 onChangeText={handlePasswordChange}
                style={styles.textInput} 
                textColor={theme.colors.text}
                mode="outlined" secureTextEntry={secureText} 
                right={<TextInput.Icon   icon={secureText ? 'eye' : 'eye-off'} // Toggle icon based on secureText state
                onPress={() => setSecureText(!secureText)} // Toggle the secureText state
                iconColor={theme.colors.primary} // Change the icon color
                />} />
              {PasswordError ? <Text style={{ color: "red" }}>{PasswordError}</Text> : null}

            {/* Fields Modal */}
          <Button mode="outlined" onPress={() => setFieldModalVisible(true)} 
          style={styles.textInput}  
          contentStyle={{ justifyContent: 'left',height:45 }} // Ensures left alignment of content
          labelStyle={{color: theme.colors.onSurfaceVariant, fontSize: 16,fontWeight:'regular'}}>
      {selectedFields.length ? selectedFields.join(', ') : 'Select Your Career Fields'}
          </Button>
          <Portal>
            <Modal visible={fieldModalVisible} onDismiss={() => setFieldModalVisible(false)} contentContainerStyle={styles.modalContent}>
              {Fields.map((field, index) => (
                <Checkbox.Item 
                key={index} 
                label={field} 
                status={selectedFields.includes(field) ? 'checked' : 'unchecked'} 
                onPress={() => toggleField(field)} />
              ))}
              <Button onPress={() => setFieldModalVisible(false)}
                >Done</Button>
            </Modal>
          </Portal>

          {/* Statuses Modal */}
          <Button mode="outlined" onPress={() => setStatusModalVisible(true)} 
          style={styles.textInput}
          contentStyle={{ justifyContent: 'left',height:45,borderRadius:10 }} // Ensures left alignment of content
          labelStyle={{color: theme.colors.onSurfaceVariant, fontSize: 16,fontWeight:'regular'}} >
            {selectedStatuses.length ? selectedStatuses.join(', ') : 'Select Your Professional Status'}
          </Button>
          <Portal>
            <Modal visible={statusModalVisible} onDismiss={() => setStatusModalVisible(false)} contentContainerStyle={styles.modalContent}>
              {statuses.map((status, index) => (
                <Checkbox.Item key={index} label={status} status={selectedStatuses.includes(status) ? 'checked' : 'unchecked'} onPress={() => toggleStatus(status)} />
              ))}
              <Button onPress={() => setStatusModalVisible(false)}>Done</Button>
            </Modal>
          </Portal>
          <LanguageSelector
           selectedLanguages={selectedLanguages} 
           setSelectedLanguages={setSelectedLanguages}  />

             
              <TextInput label={"Facebook Link (Optional)"} value={FacebookLink} 
                onChangeText={handleFacebookLinkChange}
                style={styles.textInput} 
                textColor={theme.colors.text}
                mode="outlined" />
              {FacebookLinkError ? <Text style={{ color: "red" }}>{FacebookLinkError}</Text> : null}

              <TextInput label={"LinkedIn Link (Optional)"} value={LinkedInLink} 
              onChangeText={handleLinkedInLinkChange} 
                style={styles.textInput} 
                textColor={theme.colors.text}
                mode="outlined" />
               {LinkedInLinkError ? <Text style={{ color: "red" }}>{LinkedInLinkError}</Text> : null}

              <Button mode="contained" style={styles.button}
                onPress={()=>{addNewUser(FirstNametext,LastNametext,Emailtext,Passwordtext,selectedFields,
                  selectedStatuses,selectedLanguages,
                  FacebookLink,LinkedInLink
                )}}>Sign Up</Button>

              <View style={{ flexDirection: 'row', marginTop: 30 ,marginBottom: 100}}>
                <Text>Already have an account? </Text>
                <Text style={styles.passwordtext} onPress={() => navigation.navigate('SignIn')}>Sign In</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
