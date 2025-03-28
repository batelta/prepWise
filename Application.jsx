import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, Snackbar, Text } from "react-native-paper";
import { TouchableOpacity, Modal } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function Application() {
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
  const [isEditingContact, setIsEditingContact] = useState(false); // מצב עריכת איש קשר
  const [contactToEdit, setContactToEdit] = useState(null); // איש הקשר שנמצא במצב עריכה
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactEditMode, setContactEditMode] = useState("edit");
  const [jobTypeModalVisible, setJobTypeModalVisible] = useState(false);

  const jobTypeList = [
    { label: "Full Time", value: "FullTime" },
    { label: "Part Time", value: "PartTime" },
    { label: "Internship", value: "Internship" },
    { label: "Freelance", value: "Freelance" },
    { label: "Temporary", value: "Temporary" },
    { label: "Student", value: "Student" },
  ];

  const route = useRoute();

  const { applicationID } = route.params;
  const userId = 5;
  /*const { applicationId, userId } = route.params;*/
  /*const userId = 5;
  const applicationId = 32;*/

  useFocusEffect(
    useCallback(() => {
      setApplication({
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

      const fetchApplication = async () => {
        try {
          console.log("🔁 Fetching application with ID:", applicationID);

          const API_URL =
            Platform.OS === "web"
              ? `https://localhost:7137/api/JobSeekers/${userId}/applications/${applicationID}`
              : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications/${applicationID}`;

          const response = await fetch(API_URL);
          const data = await response.json();

          console.log("Fetched application:", data);

          setApplication({ ...data, contacts: data.contacts || [] });
          setLoading(false);
        } catch (error) {
          console.error(" Failed to fetch application", error);
          Alert.alert("Error", "Failed to load application");
        }
      };

      fetchApplication();
    }, [applicationID])
  );

  const handleChange = (field, value) => {
    setApplication((prev) => ({ ...prev, [field]: value }));
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

      if (!response.ok) throw new Error("Failed to update application");

      setSnackbarVisible(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating:", error);
      Alert.alert("Error", `Something went wrong: ${error.message}`);
    }
  };

  const handleContactChange = (field, value) => {
    setContactToEdit((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateContact = async () => {
    try {
      // מצא את איש הקשר שאנחנו רוצים לעדכן
      const updatedContacts = application.contacts.map((contact) => {
        if (contact.contactID === contactToEdit.contactID) {
          return { ...contact, ...contactToEdit }; // עדכון איש הקשר
        }
        return contact;
      });

      setApplication((prev) => ({
        ...prev,
        contacts: updatedContacts,
      }));

      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/${userId}/applications/${applicationID}/contacts/${contactToEdit.contactID}`
          : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications/${applicationID}/contacts/${contactToEdit.contactID}`;

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactToEdit),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact");
      }

      Alert.alert("Success", "Contact updated successfully");
      setIsEditingContact(false);
      setContactToEdit(null);
    } catch (error) {
      console.error("Error updating contact:", error);
      Alert.alert("Error", "Failed to update contact");
    }
  };

  const deleteContact = async (contactID) => {
    try {
      // עדכון ה-API URL עם ה-contactID שנשלח
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/deleteContact/${userId}/applications/${applicationID}/contacts/${contactID}`
          : `http://192.168.1.92:7137/api/JobSeekers/deleteContact/${userId}/applications/${applicationID}/contacts/${contactID}`;

      const response = await fetch(API_URL, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      // עדכון הסטייט של אנשי הקשר אחרי מחיקה
      setApplication((prevApp) => ({
        ...prevApp,
        contacts: prevApp.contacts.filter(
          (contact) => contact.contactID !== contactID
        ),
      }));

      Alert.alert("Success", "Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      Alert.alert("Error", "Failed to delete contact");
    }
  };

  const addContact = async () => {
    try {
      const newContact = {
        contactName: contactToEdit.contactName,
        contactEmail: contactToEdit.contactEmail,
        contactPhone: contactToEdit.contactPhone,
        contactNotes: contactToEdit.contactNotes,
      };

      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/${userId}/applications/${applicationID}/contacts`
          : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications/${applicationID}/contacts`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      // עדכון הסטייט כדי להוסיף את איש הקשר החדש
      const addedContact = await response.json(); // אם השרת מחזיר את איש הקשר החדש

      setApplication((prev) => ({
        ...prev,
        contacts: [...prev.contacts, addedContact],
      }));

      console.log("Contacts after add:", [
        ...application.contacts,
        addedContact,
      ]);

      setIsEditingContact(false);
      setContactToEdit(null);
      setContactEditMode("edit");

      Alert.alert("Success", "Contact added successfully");
      setIsEditingContact(false); // סגירת מצב העריכה
      setContactToEdit(null); // ניקוי הנתונים אחרי השמירה
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert("Error", "Failed to add contact");
    }
  };

  const renderDisplayMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{application.title || "No Title"}</Text>
      <Text style={styles.company}>{application.companyName}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.text}>{application.location}</Text>

      <Text style={styles.label}>Job Type:</Text>
      <Text style={styles.text}>{application.jobType}</Text>

      <Text style={styles.label}>Remote:</Text>
      <Text style={styles.text}>{application.isRemote ? "Yes" : "No"}</Text>

      <Text style={styles.label}>Hybrid:</Text>
      <Text style={styles.text}>{application.isHybrid ? "Yes" : "No"}</Text>

      <Text style={styles.label}>URL:</Text>
      <Text style={styles.text}>{application.url}</Text>

      <Text style={styles.label}>Company Summary:</Text>
      <Text style={styles.text}>{application.companySummary}</Text>

      <Text style={styles.label}>Job Description:</Text>
      <Text style={styles.text}>{application.jobDescription}</Text>

      <Text style={styles.label}>Notes:</Text>
      <Text style={styles.text}>{application.notes}</Text>

      {application.contacts.map((contact, index) => (
        <View key={index} style={styles.contactDisplay}>
          <Text>
            {contact.contactName} - {contact.contactEmail}
          </Text>
          <Text>Phone: {contact.contactPhone}</Text>
          <Text>Notes: {contact.contactNotes}</Text>
          <Button
            onPress={() => {
              setIsEditingContact(true);
              setContactToEdit({ ...contact });
            }}
          >
            Edit Contact
          </Button>
          <Button onPress={() => deleteContact(contact.contactID)}>
            Delete Contact
          </Button>
        </View>
      ))}

      <Button
        mode="outlined"
        onPress={() => setIsEditing(true)}
        style={styles.button}
      >
        Edit Application
      </Button>
      <Button
        mode="outlined"
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

  const renderEditMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Application</Text>

      <TextInput
        label="Job Title"
        value={application.title}
        onChangeText={(text) => handleChange("title", text)}
        style={styles.input}
      />
      <TextInput
        label="Company Name"
        value={application.companyName}
        onChangeText={(text) => handleChange("companyName", text)}
        style={styles.input}
      />
      <TextInput
        label="Location"
        value={application.location}
        onChangeText={(text) => handleChange("location", text)}
        style={styles.input}
      />
      <TextInput
        label="URL"
        value={application.url}
        onChangeText={(text) => handleChange("url", text)}
        style={styles.input}
      />
      <TextInput
        label="Company Summary"
        value={application.companySummary}
        onChangeText={(text) => handleChange("companySummary", text)}
        style={styles.input}
      />
      <TextInput
        label="Job Description"
        value={application.jobDescription}
        onChangeText={(text) => handleChange("jobDescription", text)}
        style={styles.input}
      />
      <TextInput
        label="Notes"
        value={application.notes}
        onChangeText={(text) => handleChange("notes", text)}
        multiline
        style={styles.input}
      />

      <TouchableOpacity
        onPress={() => setJobTypeModalVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 4,
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ color: application.jobType ? "#000" : "#999" }}>
          {jobTypeList.find((j) => j.value === application.jobType)?.label ||
            "Select Job Type"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={jobTypeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setJobTypeModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPressOut={() => setJobTypeModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "80%",
              borderRadius: 8,
              paddingVertical: 10,
            }}
          >
            {jobTypeList.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  handleChange("jobType", item.value);
                  setJobTypeModalVisible(false);
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ fontSize: 16 }}>{item.label}</Text>
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
          style={styles.toggleButton}
        >
          {application.isRemote ? "Yes" : "No"}
        </Button>
      </View>

      <View style={styles.checkboxContainer}>
        <Text>Hybrid:</Text>
        <Button
          mode={application.isHybrid ? "contained" : "outlined"}
          onPress={() => handleChange("isHybrid", !application.isHybrid)}
          style={styles.toggleButton}
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

      <Button
        mode="outlined"
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
        style={{ marginBottom: 20 }}
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

      <TextInput
        label="Contact Name"
        value={contactToEdit.contactName}
        onChangeText={(text) => handleContactChange("contactName", text)}
        style={styles.input}
      />
      <TextInput
        label="Contact Email"
        value={contactToEdit.contactEmail}
        onChangeText={(text) => handleContactChange("contactEmail", text)}
        style={styles.input}
      />
      <TextInput
        label="Contact Phone"
        value={contactToEdit.contactPhone}
        onChangeText={(text) => handleContactChange("contactPhone", text)}
        style={styles.input}
      />
      <TextInput
        label="Contact Notes"
        value={contactToEdit.contactNotes}
        onChangeText={(text) => handleContactChange("contactNotes", text)}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={contactEditMode === "edit" ? handleUpdateContact : addContact}
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
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  company: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
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
  toggleButton: {
    marginLeft: 10,
  },
});
