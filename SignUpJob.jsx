import * as React from 'react'; 
import { TextInput, Button, Provider as PaperProvider, Modal, Portal, Checkbox, IconButton } from 'react-native-paper';
import { ScrollView, Text ,TouchableOpacity, View, StyleSheet,Image } from 'react-native';
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

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
  headline: {
    fontFamily: 'Inter',
    color: '#003D5B',
    fontSize: 22,
    fontWeight: 'regular',
    marginBottom: 40
  },
  SecHeadline: {
    fontFamily: 'Inter',
    color: '#003D5B',
    fontSize: 18,
    fontWeight: 'regular',
    marginBottom: 10
  },
  button: {
    width: '80%',
    marginTop: 40
  },
  textInput: {
    width: '80%',
    marginBottom: 15,
    backgroundColor: '#F2F2F2',
  },
  logo: {
    position: 'absolute',
    top: -100,
    width: '30%',
    resizeMode: 'contain'
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
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    textAlign:'center'
  },

 
});

export default function SignUpJob({ navigation }) {
  const [FirstNametext, setFirstNameText] = React.useState("");
  const [LastNametext, setLastNameText] = React.useState("");
  const [Emailtext, setEmailText] = React.useState("");
  const [Passwordtext, setPasswordText] = React.useState("");
  const [FacebookLink, setFacebookLink] = React.useState("");
  const [LinkedInLink, setLinkedInLink] = React.useState("");

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
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

  const addNewUser=async (Nametext,Emailtext,Passwordtext,selectedFields,selectedStatuses)=>{
      try{
        console.log("Sending request to API...");
         // Dummy values for language and links
    const dummyLanguage = 'English';  // Default language
    const dummyFacebookLink = 'https://facebook.com/dummy';  // Dummy Facebook link
    const dummyLinkedInLink = 'https://linkedin.com/dummy';  // Dummy LinkedIn link

    console.log(Nametext,Emailtext,Passwordtext,selectedFields,selectedStatuses,image)
        const response =await fetch ('http://localhost:5062/api/Users', {
          method: 'POST', // Specify that this is a POST request
          headers: {
            'Content-Type': 'application/json' // Indicate that you're sending JSON data
          },
          body: JSON.stringify({ // Convert the user data into a JSON string
            FirstName: Nametext,
            LastName:Nametext,
            Email: Emailtext,
            Password: Passwordtext,
            CareerField: selectedFields, // Assuming this is an array
            Experience: selectedStatuses[0] ,// Send only one status
            Picture: image, // Dummy image URL
            Language: dummyLanguage,  // Send the dummy language
            FacebookLink: dummyFacebookLink,  // Send the dummy Facebook link
            LinkedInLink: dummyLinkedInLink,  // Send the dummy LinkedIn link
          })
        });
        const responseBody = await response.text();  // Use text() instead of json() to handle any response format
        console.log("Response Body:", responseBody);
    
    if(!response.ok){
      throw new Error('failed to post new user')
    }
      }catch(error){
    console.log(error)
      }
  }
  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background, position: 'relative' }}>
          <Image source={require('./assets/prepWise Logo.png')} style={styles.logo} />
          <Text style={styles.SecHeadline}>Sign Up</Text>

          {image ? (
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 20, borderWidth: 2, borderColor: '#BFB4FF' }} />
              <TouchableOpacity onPress={pickImage} style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#F5F5F5', padding: 5, borderRadius: 50 }}>
                <IconButton icon="camera-plus-outline" size={10} style={{ width:10,height:10 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
              <IconButton icon="camera-plus-outline" size={20} style={{ backgroundColor: '#BFB4FF' }} />
            </TouchableOpacity>
          )}

          <TextInput label={"Enter First Name"} value={FirstNametext} onChangeText={setFirstNameText} 
          style={styles.textInput} 
          textColor={theme.colors.text}
          mode="outlined" />
           <TextInput label={"Enter Last Name"} value={LastNametext} onChangeText={setLastNameText} 
          style={styles.textInput} 
          textColor={theme.colors.text}
          mode="outlined" />
          <TextInput label={"Enter Email Address"} value={Emailtext} onChangeText={setEmailText}
           style={styles.textInput} 
           textColor={theme.colors.text}
           mode="outlined" />
          <TextInput label={"Enter Password"} value={Passwordtext} onChangeText={setPasswordText} 
          style={styles.textInput} 
          textColor={theme.colors.text}
          mode="outlined" secureTextEntry right={<TextInput.Icon icon="eye" />} />

  {/* Fields Modal */}
         <Button mode="outlined" onPress={() => setFieldModalVisible(true)} 
          style={styles.textInput}
          labelStyle={{ color: theme.colors.onSurfaceVariant }} // Override text color
>
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
          labelStyle={{ color: theme.colors.onSurfaceVariant }} // Override text color
>
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
          <TextInput label={"Facebook Link"} value={FacebookLink} onChangeText={setFacebookLink} 
          style={styles.textInput} 
          textColor={theme.colors.text}
          mode="outlined" />
           <TextInput label={"LinkedIn Link"} value={LinkedInLink} onChangeText={setLinkedInLink} 
          style={styles.textInput} 
          textColor={theme.colors.text}
          mode="outlined" />
          <Button mode="contained" style={styles.button}
          onPress={()=>{addNewUser(Nametext,Emailtext,Passwordtext,selectedFields,selectedStatuses)}}>Sign Up</Button>
          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <Text>Already have an account? </Text>
            <Text style={styles.passwordtext} onPress={() => navigation.navigate('SignIn')}>Sign In</Text>
          </View>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}
