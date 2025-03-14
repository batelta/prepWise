import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Button, Modal, Portal, Checkbox, Provider as PaperProvider } from 'react-native-paper';

const EditProfile = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");
  
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState("");
  const experiences = [
    "I'm just getting started! (0 years)",
    "I have some experience, but I'm still learning! (1-2 years)",
    "I'm building my career and expanding my skills. (2-4 years)",
    "I am an experienced professional in my field. (5-7 years)",
    "I have extensive experience and lead projects. (8+ years)",
    "I'm a seasoned expert in my area. (10+ years)"
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.headerBackground} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <AntDesign name="edit" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Natalie Cohen" placeholderTextColor="gray" />
        </View>

        <View style={styles.inputContainer}>
          <Text>Email Address</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="NatalieCohen@gmail.com" placeholderTextColor="gray" />
        </View>

        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.input} 
              secureTextEntry={secureTextEntry} 
              value={password} 
              onChangeText={setPassword} 
              placeholder="******" 
              placeholderTextColor="gray" 
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
              <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text>Years of Experience</Text>
          <Button mode="outlined" onPress={() => setExperienceModalVisible(true)} style={styles.input}>
            {selectedExperience || "Select Your Experience Level"}
          </Button>
          <Portal>
            <Modal visible={experienceModalVisible} onDismiss={() => setExperienceModalVisible(false)} contentContainerStyle={styles.modalContent}>
              {experiences.map((exp, index) => (
                <Checkbox.Item key={index} label={exp} status={selectedExperience === exp ? 'checked' : 'unchecked'} onPress={() => setSelectedExperience(exp)} />
              ))}
              <Button onPress={() => setExperienceModalVisible(false)}>Done</Button>
            </Modal>
          </Portal>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", paddingTop: 210 },
  headerBackground: { position: "absolute", top: 0, width: "130%", height: 350, backgroundColor: "#EDEDED", borderBottomLeftRadius: 200, borderBottomRightRadius: 200, alignSelf: "center" },
  backButton: { position: "absolute", top: 60, left: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#003D5B", marginBottom: 10 },
  imageContainer: { alignItems: "center" },
  imageWrapper: { position: "relative" },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "white" },
  editIcon: { position: "absolute", bottom: 5, right: 5, backgroundColor: "#BFB4FF", borderRadius: 15, width: 30, height: 30, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "white" },
  inputContainer: { width: "80%", marginBottom: 10 },
  input: { backgroundColor: "#F2F2F2", padding: 20, borderRadius: 20, width: "100%", color: "black" },
  passwordContainer: { flexDirection: "row", alignItems: "center", position: "relative" },
  eyeIcon: { position: "absolute", right: 15 },
  saveButton: { backgroundColor: "#BFB4FF", padding: 15, borderRadius: 20, marginTop: 40, width: '80%' },
  saveText: { color: "#003D5B", fontSize: 16, textAlign: "center" },
  modalContent: { backgroundColor: "white", padding: 20, marginHorizontal: 20, borderRadius: 20, alignItems: "center", justifyContent: "center", textAlign: "center" },
});

export default EditProfile;
