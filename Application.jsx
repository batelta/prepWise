import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, Snackbar, Text, Switch } from "react-native-paper";
import { TouchableOpacity, Modal } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_300Light,
  Inter_700Bold,
  Inter_100Thin,
  Inter_200ExtraLight,
} from "@expo-google-fonts/inter";
import Icon from "react-native-vector-icons/MaterialIcons";
import NavBar from "./NavBar";

export default function Application({ applicationID: propID }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
  });

  const route = useRoute();
  const applicationID = route.params?.applicationID || propID;

  console.log("🔎 route.params:", route.params);
  console.log("📦 applicationID:", applicationID);

  // משרה ידנית
  /*const [application, setApplication] = useState({
    applicationID: 1,
    title: "Software Engineer",
    companyName: "TechCorp",
    location: "New York, NY",
    url: "https://techcorp.com/jobs/software-engineer",
    companySummary: "A leading tech company providing cutting-edge solutions.",
    jobDescription:
      "Responsible for developing and maintaining software applications.",
    notes: "Looking for candidates with experience in React and Node.js.",
    jobType: "Full Time",
    isHybrid: true,
    isRemote: false,
    contacts: [],
  });*/

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

  const [contactModalVisible, setContactModalVisible] = useState(false); //modal

  const jobTypeList = [
    { label: "Full Time", value: "FullTime" },
    { label: "Part Time", value: "PartTime" },
    { label: "Internship", value: "Internship" },
    { label: "Freelance", value: "Freelance" },
    { label: "Temporary", value: "Temporary" },
    { label: "Student", value: "Student" },
  ];

  /*const route = useRoute();

  /*const { applicationID } = route.params;
  /*const userId = 5;*/
  /*const { applicationId, userId } = route.params;*/
  const userId = 1;
  /* const applicationId = 32;*/

  /*useEffect(() => {
    // אם יש applicationID מה-URL או ממעבר, תוכל להוריד את המידע כאן
    // כרגע נשתמש במידע ידני בלבד
    console.log("📝 Displaying application:", application);
  }, [application]);*/

  useEffect(() => {
    if (!applicationID) return;

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

        console.log(" Fetched application:", data);

        setApplication({ ...data, contacts: data.contacts || [] });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch application", error);
        Alert.alert("Error", "Failed to load application");
      }
    };

    fetchApplication();
  }, [applicationID]);

  const handleChange = (field, value) => {
    setApplication((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      console.log("updating applicationID:", applicationID);
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

  const handleDeleteApplication = async () => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/deleteById/${userId}/${applicationID}`
          : `http://192.168.1.92:7137/api/JobSeekers/deleteById/${userId}/${applicationID}`;

      const response = await fetch(API_URL, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete application");

      Alert.alert("Success", "Application deleted successfully!");

      if (Platform.OS === "web") {
        window.location.reload(); // לרענן רשימה ב־SplitView
      } else {
        // אם במובייל, נחזור לדף הקודם
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      Alert.alert("Error", "Failed to delete application");
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
      const updatedContacts = application.contacts.map((contact) => {
        if (contact.contactID === contactToEdit.contactID) {
          return { ...contact, ...contactToEdit };
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

      setIsEditingContact(false);
      setContactToEdit(null);
      setContactModalVisible(false); // סגירת המודל אחרי עדכון מוצלח
    } catch (error) {
      console.error("Error updating contact:", error);
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

      // סגירת המודל אחרי מחיקה מוצלחת
      setContactModalVisible(false);
      setContactToEdit(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const addContact = async () => {
    try {
      // וודא שיש שם תקין לאיש הקשר לפני השליחה
      if (!contactToEdit.contactName) {
        Alert.alert("Error", "Contact name is required");
        return;
      }

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

      // קבל את התשובה המלאה מהשרת (כולל ID חדש)
      const addedContact = await response.json();
      console.log("Added contact from server:", addedContact);

      setApplication((prevApp) => {
        // יצירת עותק חדש של מערך אנשי הקשר עם איש הקשר החדש
        const updatedContacts = [...prevApp.contacts, addedContact];
        console.log("Updated contacts array:", updatedContacts);
        // החזרת אובייקט אפליקציה חדש עם המערך המעודכן
        return {
          ...prevApp,
          contacts: updatedContacts,
        };
      });

      // סגור את מסך העריכה רק אחרי שהכל הושלם בהצלחה
      setIsEditingContact(false);
      setContactToEdit(null);
      setContactEditMode("edit");
      setContactModalVisible(false); // סגירת המודל
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  /* const addContact = async () => {
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

      // עדכון הסטייט עם איש הקשר החדש
      const addedContact = await response.json();

      // אחרי העדכון, הסטייט אמור להתעדכן כאן
      setApplication((prev) => ({
        ...prev,
        contacts: [...prev.contacts, addedContact], // עדכון הסטייט עם הקשר החדש
      }));

      setIsEditingContact(false); // סגירת מצב העריכה
      setContactToEdit(null); // ניקוי הנתונים אחרי השמירה
      setContactEditMode("edit");
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };*/

  useEffect(() => {
    console.log("Contacts after add:", application.contacts);
  }, [application.contacts]);

  /*const addContact = async () => {
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
      const addedContact = await response.json();

      setApplication((prev) => ({
        ...prev,
        contacts: [...prev.contacts, addedContact],
      }));

      console.log("Contacts after add:", [
        ...application.contacts,
        addedContact,
      ]);

      //setIsEditingContact(false);
      //setContactToEdit(null);

      setIsEditingContact(false); // סגירת מצב העריכה
      setContactToEdit(null); // ניקוי הנתונים אחרי השמירה
      setContactEditMode("edit");
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };*/

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

      <View style={styles.notesBox}>
        {/* כפתור האייקון Add Notes */}
        <View style={styles.addIconButton}>
          <Text style={styles.addText}>
            <Icon name="note-add" size={28} color="#b9a7f2" /> Notes
          </Text>
        </View>
        <Text style={styles.text}>{application.notes}</Text>
      </View>

      {/*application.contacts.map((contact, index) => (
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
      ))*/}

      <View>
        {application.contacts.map((contact, index) => (
          <View key={contact.contactID || index} style={styles.contactRow}>
            {/* אייקון של איש קשר עם שם איש הקשר */}
            <TouchableOpacity
              style={styles.contactIconButton}
              onPress={() => {
                setContactToEdit(contact);
                setContactModalVisible(true);
              }}
            >
              <Icon name="person" size={28} color="#b9a7f2" />
              <Text style={styles.contactName}>
                {contact.contactName || "Contact"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* מודל לתצוגת פרטי איש קשר */}
        <Modal
          visible={contactModalVisible && contactToEdit !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setContactModalVisible(false);
            setContactToEdit(null);
          }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setContactModalVisible(false);
              setContactToEdit(null);
            }}
          >
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalHeader}>
                {contactToEdit?.contactName || "Contact Details"}
              </Text>

              <View style={styles.contactDetailsModal}>
                <Text style={styles.contactDetailItem}>
                  Email: {contactToEdit?.contactEmail || ""}
                </Text>
                <Text style={styles.contactDetailItem}>
                  Phone: {contactToEdit?.contactPhone || ""}
                </Text>
                <Text style={styles.contactDetailItem}>
                  Notes: {contactToEdit?.contactNotes || ""}
                </Text>

                <View style={styles.modalButtonsRow}>
                  {/* כפתור לעריכת איש הקשר */}
                  <Button
                    mode="contained"
                    onPress={() => {
                      setContactModalVisible(false);
                      setIsEditingContact(true);
                    }}
                    style={[styles.modalButton, { backgroundColor: "#BFB4FF" }]}
                  >
                    Edit Contact
                  </Button>

                  {/* כפתור למחיקת איש הקשר */}
                  <Button
                    mode="contained"
                    onPress={() => {
                      deleteContact(contactToEdit?.contactID);
                      setContactModalVisible(false);
                      setContactToEdit(null);
                    }}
                    style={[styles.modalButton, { backgroundColor: "#BFB4FF" }]}
                  >
                    Delete
                  </Button>
                </View>

                {/* כפתור לסגירת המודל */}
                <Button
                  mode="outlined"
                  onPress={() => {
                    setContactModalVisible(false);
                    setContactToEdit(null);
                  }}
                  style={styles.modalCloseButton}
                >
                  Close
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

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
      </View>

      <Button
        mode="outlined"
        onPress={() => setIsEditing(true)}
        style={styles.button}
      >
        Edit Application
      </Button>

      <Button
        mode="outlined"
        onPress={handleDeleteApplication}
        style={styles.button}
      >
        Delete Application
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
      <View style={styles.notesBox}>
        <View style={styles.addIconButton}>
          <Icon name="note-add" size={28} color="#b9a7f2" />
          <Text style={styles.addText}>Notes</Text>
        </View>

        {/* שדה ה־Notes */}
        <TextInput
          label="Notes"
          value={application.notes}
          onChangeText={(text) => handleChange("notes", text)}
          multiline
          style={styles.notesInput}
        />
      </View>

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

      <View style={styles.switchRow}>
        <Text>Is Remote?</Text>
        <Switch
          value={application.isRemote}
          onValueChange={(val) => handleChange("isRemote", val)}
          color="#9FF9D5"
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Is Hybrid?</Text>
        <Switch
          value={application.isHybrid}
          onValueChange={(val) => handleChange("isHybrid", val)}
          color="#9FF9D5"
        />
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

      {Platform.OS === "ios" && !isEditing && <NavBar />}

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
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#163349",
  },
  label: {
    //fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Inter_700Bold",
    color: "#163349",
  },
  text: {
    marginBottom: 10,
    fontFamily: "Inter_300Light",
    color: "#163349",
  },
  input: {
    marginBottom: 10,
    color: "#163349",
  },
  button: {
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginLeft: 170,
    width: "50%",
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

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  notesBox: {
    position: "absolute",
    top: 30,
    right: 10,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b9a7f2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // for Android shadow
    width: "auto",
    minWidth: 200,
    maxWidth: 400,
    minHeight: 150,
    maxHeight: 350,
  },
  addIconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#b9a7f2",
    fontFamily: "Inter_700Bold,",
  },
  notesText: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
  },
  contactIconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#163349",
  },
  contactDetails: {
    marginLeft: 40, // נדחף עם ריווח מהשמאל
    marginTop: 10,
  },

  navBar: {
    position: "relative", // מבנה המיקום של ה־NavBar
    marginTop: 20, // רווח אחרי ה־notesBox
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    maxWidth: 400,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#163349",
    textAlign: "center",
  },
  contactDetailsModal: {
    width: "100%",
  },
  contactDetailItem: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    width: "48%",
  },
  modalCloseButton: {
    marginTop: 15,
    width: "100%",
  },
});
