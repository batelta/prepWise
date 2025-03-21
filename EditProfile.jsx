import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Button, Modal, Portal, Checkbox, Provider as PaperProvider } from 'react-native-paper';

const EditProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    facebookLink: "",
    linkedinLink: "",
    picture: "",
    experience: ""
  });

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const experiences = [
    "I'm just getting started! (0 years)",
    "I have some experience, but I'm still learning! (1-2 years)",
    "I'm building my career and expanding my skills. (2-4 years)",
    "I am an experienced professional in my field. (5-7 years)",
    "I have extensive experience and lead projects. (8+ years)",
    "I'm a seasoned expert in my area. (10+ years)"
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("https://localhost:7137/api/Users?userId=30"); 
        const data = await response.json(); 
        console.log("Fetched Data:", data); //בדיקה- הדפסת הנתונים של המשתמש המחובר

        
        setUser({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: data.password || "",
          facebookLink: data.facebookLink || "",
          linkedinLink: data.linkedinLink || "",
          picture: data.picture || "",
          experience: data.experience || "",
        });
     

      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

const [base64Image, setBase64Image] = useState(null);
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: true, // הוספת Base64
  });

  if (!result.canceled) {
    setUser(prevState => ({
      ...prevState,
      picture: result.assets[0].uri
    }));
    setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
  }
};
  const saveChanges = async () => {
    const updatedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      experience: user.experience,
      facebookLink: user.facebookLink,
      linkedinLink: user.linkedinLink,
      careerField: [], 
      language: "", 
      picture: base64Image || user.picture 
    };
  
    try {
      const response = await fetch("https://localhost:7137/api/Users/30", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("User updated successfully:", responseData);
        
        // הוספת הודעה למשתמש שהשינויים נשמרו בהצלחה
      } else {
        const errorData = await response.json();
        console.log("Error updating user:", errorData); // טיפול בשגיאות במידה ויש
      }
    } catch (error) {
      console.error("Error:", error);
      // טיפול בשגיאות אם לא ניתן לשלוח את הבקשה
    }
  };
  
  
  
  return (
    <PaperProvider>
    
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerBackground} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Edit Profile</Text>
        {/**image */}
        <View style={styles.imageContainer}>
  <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
    <Image source={{ uri: user.picture || "" }} style={styles.profileImage} />
    <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
      <AntDesign name="edit" size={20} color="white" />
    </TouchableOpacity>
  </TouchableOpacity>
</View>

        {/* First Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={user.firstName}
            onChangeText={(text) => setUser({ ...user, firstName: text })}
            placeholder="First Name"
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={user.lastName}
            onChangeText={(text) => setUser({ ...user, lastName: text })}
            placeholder="Last Name"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            placeholder="Email Address"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={secureTextEntry}
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
              placeholder="Password"
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
              <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Experience */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Years of Experience</Text>
          <Button
            mode="contained"
            onPress={() => setExperienceModalVisible(true)}
            style={[styles.input, { backgroundColor: "#F2F2F2" }]}
            labelStyle={{ color: "#A9A9A9" }}
          >
            {user.experience || "Select Your Experience Level"}
          </Button>
          <Portal>
            <Modal visible={experienceModalVisible} onDismiss={() => setExperienceModalVisible(false)} contentContainerStyle={[styles.modalContent, { backgroundColor: 'white' }]}>
              {experiences.map((exp, index) => (
                <Checkbox.Item key={index} label={exp} status={user.experience === exp ? 'checked' : 'unchecked'} onPress={() => setUser({ ...user, experience: exp })} />
              ))}
              <Button onPress={() => setExperienceModalVisible(false)}>Done</Button>
            </Modal>
          </Portal>
        </View>
        {/* Facebook Link */}
<View style={styles.inputContainer}>
  <Text style={styles.label}>Facebook Link</Text>
  <TextInput
    style={styles.input}
    value={user.facebookLink}
    onChangeText={(text) => setUser({ ...user, facebookLink: text })}
    placeholder="Facebook link"
  />
</View>

{/* LinkedIn Link */}
<View style={styles.inputContainer}>
  <Text style={styles.label}>LinkedIn Link</Text>
  <TextInput
    style={styles.input}
    value={user.linkedinLink}
    onChangeText={(text) => setUser({ ...user, linkedinLink: text })}
    placeholder="LinkedIn link"
  />
</View>

        {/* Save Button */}
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  placeholderTextColor:{color:"#A9A9A9"},
  container: { flexGrow: 1, backgroundColor: "#FFFFFF", alignItems: "center", paddingTop: 210 },
  backButton: { position: "absolute", top: 60, left: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#003D5B",marginBottom:60 },
  //imageContainer: { alignItems: "center" },
  imageWrapper: { position: "relative" },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "white" },
  cameraIcon: { position: "absolute", bottom: 5, right: 5, backgroundColor: "white", borderRadius: 50, padding: 5 },
  inputContainer: { width: "80%", marginBottom: 10 },
  input: { backgroundColor: "#F2F2F2", padding: 15, borderRadius: 20, width: "100%", color: "#A9A9A9" },
  label: { fontSize: 14, color: "#003D5B", marginBottom: 5 },
  passwordContainer: { flexDirection: "row", alignItems: "center" },
  eyeIcon: { position: "absolute", right: 15 },
  saveButton: { backgroundColor: "#BFB4FF", padding: 15, borderRadius: 20, marginTop: 20 },
  saveText: { color: "#003D5B", fontSize: 16, textAlign: "center" },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#BFB4FF",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white"
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#BFB4FF",
    marginTop: -50,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    width: "150%",
    height: 300,
    backgroundColor: "#EDEDED",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    alignSelf: "center",
  },
  
  
});

export default EditProfile;
