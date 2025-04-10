import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { TextInput, Button, Snackbar, Text } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";

// 💡 שדה טופס כללי
const FormField = ({ label, value, onChangeText, multiline = false }) => (
  <TextInput
    label={label}
    value={value}
    onChangeText={onChangeText}
    multiline={multiline}
    mode="outlined"
    dense
    style={styles.input}
  />
);

// 💡 קומפוננטה לאיש קשר
const ContactForm = ({ contact, onChangeField }) => (
  <>
    <FormField
      label="Contact Name"
      value={contact.contactName}
      onChangeText={(text) => onChangeField("contactName", text)}
    />
    <FormField
      label="Contact Email"
      value={contact.contactEmail}
      onChangeText={(text) => onChangeField("contactEmail", text)}
    />
    <FormField
      label="Contact Phone"
      value={contact.contactPhone}
      onChangeText={(text) => onChangeField("contactPhone", text)}
    />
    <FormField
      label="Contact Notes"
      value={contact.contactNotes}
      onChangeText={(text) => onChangeField("contactNotes", text)}
      multiline
    />
  </>
);

export default function Test({ applicationID: propID }) {
  const route = useRoute();
  const navigation = useNavigation();
  const applicationID = route.params?.applicationID || propID;
  const userId = 42;

  const [application, setApplication] = useState({
    applicationID: null,
    title: "",
    companyName: "",
    location: "",
    url: "",
    companySummary: "",
    jobDescription: "",
    notes: "",
    jobType: "",
    isHybrid: false,
    isRemote: false,
    contacts: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [contactEditMode, setContactEditMode] = useState("edit");
  const [jobTypeModalVisible, setJobTypeModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const jobTypeList = [
    { label: "Full Time", value: "FullTime" },
    { label: "Part Time", value: "PartTime" },
    { label: "Internship", value: "Internship" },
    { label: "Freelance", value: "Freelance" },
    { label: "Temporary", value: "Temporary" },
    { label: "Student", value: "Student" },
  ];

  useEffect(() => {
    if (!applicationID) return;

    const fetchApplication = async () => {
      try {
        const API_URL =
          Platform.OS === "web"
            ? `https://localhost:7137/api/JobSeekers/${userId}/applications/${applicationID}`
            : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications/${applicationID}`;

        const response = await fetch(API_URL);
        const data = await response.json();
        setApplication({ ...data, contacts: data.contacts || [] });
      } catch (error) {
        Alert.alert("Error", "Failed to load application");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationID]);

  const handleChange = (field, value) => {
    setApplication((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setContactToEdit((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/${userId}/applications/${applicationID}`
          : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications/${applicationID}`;

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...application, contacts: [] }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setSnackbarVisible(true);
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteApplication = async () => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/deleteById/${userId}/${applicationID}`
          : `http://192.168.1.92:7137/api/JobSeekers/deleteById/${userId}/${applicationID}`;

      const response = await fetch(API_URL, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete");

      Alert.alert("Success", "Application deleted");
      Platform.OS === "web" ? window.location.reload() : navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const addContact = async () => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/${userId}/applications/${applicationID}/contacts`
          : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications/${applicationID}/contacts`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactToEdit),
      });

      const addedContact = await response.json();
      setApplication((prev) => ({
        ...prev,
        contacts: [...prev.contacts, addedContact],
      }));

      setContactToEdit(null);
      setIsEditingContact(false);
      setContactEditMode("edit");
    } catch (err) {
      Alert.alert("Error", "Failed to add contact");
    }
  };

  const renderEditMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Application</Text>

      <FormField
        label="Job Title"
        value={application.title}
        onChangeText={(t) => handleChange("title", t)}
      />
      <FormField
        label="Company Name"
        value={application.companyName}
        onChangeText={(t) => handleChange("companyName", t)}
      />
      <FormField
        label="Location"
        value={application.location}
        onChangeText={(t) => handleChange("location", t)}
      />
      <FormField
        label="URL"
        value={application.url}
        onChangeText={(t) => handleChange("url", t)}
      />
      <FormField
        label="Company Summary"
        value={application.companySummary}
        onChangeText={(t) => handleChange("companySummary", t)}
        multiline
      />
      <FormField
        label="Job Description"
        value={application.jobDescription}
        onChangeText={(t) => handleChange("jobDescription", t)}
        multiline
      />
      <FormField
        label="Notes"
        value={application.notes}
        onChangeText={(t) => handleChange("notes", t)}
        multiline
      />

      <TouchableOpacity
        onPress={() => setJobTypeModalVisible(true)}
        style={styles.dropdown}
      >
        <Text style={{ color: application.jobType ? "#000" : "#999" }}>
          {jobTypeList.find((j) => j.value === application.jobType)?.label ||
            "Select Job Type"}
        </Text>
      </TouchableOpacity>

      <Modal visible={jobTypeModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setJobTypeModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {jobTypeList.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  handleChange("jobType", item.value);
                  setJobTypeModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.checkboxContainer}>
        <Text>Remote:</Text>
        <Button
          mode={application.isRemote ? "contained" : "outlined"}
          onPress={() => handleChange("isRemote", !application.isRemote)}
        >
          {application.isRemote ? "Yes" : "No"}
        </Button>
      </View>

      <View style={styles.checkboxContainer}>
        <Text>Hybrid:</Text>
        <Button
          mode={application.isHybrid ? "contained" : "outlined"}
          onPress={() => handleChange("isHybrid", !application.isHybrid)}
        >
          {application.isHybrid ? "Yes" : "No"}
        </Button>
      </View>

      <Button mode="contained" onPress={handleUpdate} style={styles.button}>
        Save Changes
      </Button>
      <Button
        onPress={() => setIsEditing(false)}
        style={[styles.button, styles.cancelButton]}
      >
        Cancel
      </Button>
    </ScrollView>
  );

  const renderDisplayMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{application.title || "No Title"}</Text>
      <Text style={styles.label}>Company: {application.companyName}</Text>
      <Text style={styles.label}>Location: {application.location}</Text>
      <Text style={styles.label}>Type: {application.jobType}</Text>
      <Text style={styles.label}>
        Remote: {application.isRemote ? "Yes" : "No"}
      </Text>
      <Text style={styles.label}>
        Hybrid: {application.isHybrid ? "Yes" : "No"}
      </Text>
      <Text style={styles.label}>
        Company Summary: {application.companySummary}
      </Text>
      <Text style={styles.label}>
        Description: {application.jobDescription}
      </Text>
      <Text style={styles.label}>Notes: {application.notes}</Text>

      {application.contacts.map((c, i) => (
        <View key={i} style={styles.contactDisplay}>
          <Text>
            {c.contactName} - {c.contactEmail}
          </Text>
          <Button
            onPress={() => {
              setIsEditingContact(true);
              setContactToEdit(c);
            }}
          >
            Edit Contact
          </Button>
        </View>
      ))}

      <Button onPress={() => setIsEditing(true)} style={styles.button}>
        Edit Application
      </Button>
      <Button onPress={handleDeleteApplication} style={styles.button}>
        Delete Application
      </Button>
      <Button
        onPress={() => {
          setIsEditingContact(true);
          setContactEditMode("add");
          setContactToEdit({
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            contactNotes: "",
          });
        }}
        style={styles.button}
      >
        + Add Contact
      </Button>
    </ScrollView>
  );

  const renderContactEditMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {contactEditMode === "edit" ? "Edit Contact" : "Add New Contact"}
      </Text>
      <ContactForm
        contact={contactToEdit}
        onChangeField={handleContactChange}
      />
      <Button
        mode="contained"
        onPress={contactEditMode === "edit" ? handleUpdate : addContact}
        style={styles.button}
      >
        {contactEditMode === "edit" ? "Save Contact" : "Add Contact"}
      </Button>
      <Button
        onPress={() => {
          setIsEditingContact(false);
          setContactToEdit(null);
        }}
        style={[styles.button, styles.cancelButton]}
      >
        Cancel
      </Button>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {isEditingContact
        ? renderContactEditMode()
        : isEditing
        ? renderEditMode()
        : renderDisplayMode()}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Application updated successfully!
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "white" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#163349",
  },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  input: { marginBottom: 10 },
  button: { marginTop: 20 },
  cancelButton: { backgroundColor: "#ddd" },
  contactDisplay: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  toggleButton: { marginLeft: 10 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 8,
    paddingVertical: 10,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
