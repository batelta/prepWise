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
import { useRoute, useNavigation } from "@react-navigation/native";
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
import CustomPopup from "./CustomPopup";
import GeminiChat from "./GeminiChat";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Application({ applicationID: propID }) {
  const { Loggeduser } = useContext(UserContext);

  const [User, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
  });

  const route = useRoute();
  const applicationID = route.params?.applicationID || propID;
  const [originalApplication, setOriginalApplication] = useState({}); //for setting the right infoamntion in ui when user edit and did not save

  console.log("🔎 route.params:", route.params);
  console.log("📦 applicationID:", applicationID);

  const [showChat, setShowChat] = useState(false);
  const appliedStyles = Platform.OS === "web" ? Webstyles : styles; //need to change this in pages that only in web/IOS

  const navigation = useNavigation(); // להשתמש בנavigaion ע

  const [contactErrors, setContactErrors] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });



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
  //const [loading, setLoading] = useState(true);
  const [contactEditMode, setContactEditMode] = useState("edit");
  const [jobTypeModalVisible, setJobTypeModalVisible] = useState(false);

  const [contactModalVisible, setContactModalVisible] = useState(false); //modal

  //popup states
  const [customPopupVisible, setCustomPopupVisible] = useState(false);
  const [customPopupMessage, setCustomPopupMessage] = useState("");
  const [customPopupIcon, setCustomPopupIcon] = useState("information");
  const [customPopupConfirmation, setCustomPopupConfirmation] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});

  const jobTypeList = [
    { label: "Full Time", value: "FullTime" },
    { label: "Part Time", value: "PartTime" },
    { label: "Internship", value: "Internship" },
    { label: "Freelance", value: "Freelance" },
    { label: "Temporary", value: "Temporary" },
    { label: "Student", value: "Student" },
  ];



  
// useEffect לקבלת הנתונים של המשתמש המחובר
useEffect(() => {
  if (Loggeduser) {
    console.log("Logged user:", Loggeduser);
    console.log("User ID:", Loggeduser.id);
    setUser(Loggeduser);
  }
}, [Loggeduser]);

// המשך הקוד עם ה-useEffect לטעינת המשרה
useEffect(() => {
  // תוודא שיש מזהה משרה לפני ניסיון טעינה
  if (!applicationID || !User) {
    console.log("Missing applicationID or user data, skipping fetch");
    setLoading(false);
    return;
  }
   // איפוס ערכי המשרה לפני טעינת נתונים חדשים
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

  console.log("Fetching application in Application component, ID:", applicationID);
  
  const fetchApplication = async () => {
    try {
      console.log("API call with ID:", applicationID, "User ID:", User.id);
      
      const API_URL =
        `https://proj.ruppin.ac.il/igroup11/prod/api/JobSeekers/${User.id}/applications/${applicationID}`
          
      console.log("Fetch URL:", API_URL);
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched application data:", data);
      
      setOriginalApplication({ ...data, contacts: data.contacts || [] });
      setApplication({ ...data, contacts: data.contacts || [] });
    } catch (error) {
      console.error("Failed to fetch application", error);
      Alert.alert("Error", "Failed to load application");
    } finally {
      setLoading(false);
    }
  };
  
  fetchApplication();
}, [applicationID, User]); // תלות גם ב-applicationID וגם ב-User
  // כפתור חזור

  const handleChange = (field, value) => {
    setApplication((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      console.log("updating applicationID:", applicationID);
      const API_URL =
         `https://proj.ruppin.ac.il/igroup11/prod/api/JobSeekers/${User.id}/applications/${applicationID}`

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
         `https://proj.ruppin.ac.il/igroup11/prod/api/JobSeekers/deleteById/${User.id}/${applicationID}`

      const response = await fetch(API_URL, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete application");

      setCustomPopupMessage("Application deleted successfully!");
      setCustomPopupIcon("check-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);

      if (Platform.OS === "web") {
        window.location.reload(); // לרענן רשימה ב־SplitView
      } else {
        // אם במובייל, נחזור לדף הקודם
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      // הצג פופאפ שגיאה
      setCustomPopupMessage("Failed to delete application");
      setCustomPopupIcon("alert-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);
    }
  };

  const handleContactChange = (field, value) => {
    setContactToEdit((prev) => ({
      ...prev,
      [field]: value,
    }));

    // בדיקות תקינות לפי סוג השדה
    if (field === "contactName") {
      if (!value.trim()) {
        setContactErrors((prevErrors) => ({ ...prevErrors, contactName: "" }));
      } else if (!/^[A-Za-z\u0590-\u05FF\s]{1,30}$/.test(value)) {
        // תומך גם בעברית
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          contactName: "Only letters and spaces, up to 30 characters.",
        }));
      } else {
        setContactErrors((prevErrors) => ({ ...prevErrors, contactName: "" }));
      }
    }

    if (field === "contactEmail") {
      if (!value.trim()) {
        setContactErrors((prevErrors) => ({ ...prevErrors, contactEmail: "" }));
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      ) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          contactEmail: "Enter a valid email address.",
        }));
      } else {
        setContactErrors((prevErrors) => ({ ...prevErrors, contactEmail: "" }));
      }
    }

    if (field === "contactPhone") {
      if (!value.trim()) {
        setContactErrors((prevErrors) => ({ ...prevErrors, contactPhone: "" }));
      } else if (!/^[0-9+\-\s]{6,15}$/.test(value)) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          contactPhone: "Enter a valid phone number (6-15 digits).",
        }));
      } else {
        setContactErrors((prevErrors) => ({ ...prevErrors, contactPhone: "" }));
      }
    }
  };

  const validateContact = () => {
    let hasValidationError = false;
    let updatedErrors = { ...contactErrors };

    // בדיקה שיש לפחות שם
    if (!contactToEdit.contactName.trim()) {
      updatedErrors.contactName = "Contact name is required";
      hasValidationError = true;
    } else if (
      !/^[A-Za-z\u0590-\u05FF\s]{1,30}$/.test(contactToEdit.contactName)
    ) {
      updatedErrors.contactName =
        "Only letters and spaces, up to 30 characters.";
      hasValidationError = true;
    } else {
      updatedErrors.contactName = "";
    }

    // בדיקת אימייל אם קיים
    if (
      contactToEdit.contactEmail.trim() &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        contactToEdit.contactEmail
      )
    ) {
      updatedErrors.contactEmail = "Enter a valid email address.";
      hasValidationError = true;
    } else {
      updatedErrors.contactEmail = "";
    }

    // בדיקת טלפון אם קיים
    if (
      contactToEdit.contactPhone.trim() &&
      !/^[0-9+\-\s]{6,15}$/.test(contactToEdit.contactPhone)
    ) {
      updatedErrors.contactPhone = "Enter a valid phone number (6-15 digits).";
      hasValidationError = true;
    } else {
      updatedErrors.contactPhone = "";
    }

    // עדכון השגיאות בתצוגה
    setContactErrors(updatedErrors);

    return !hasValidationError;
  };

  const handleUpdateContact = async () => {
    if (!validateContact()) {
      return;
    }

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
         `https://proj.ruppin.ac.il/igroup11/prod/api/JobSeekers/${User.id}/applications/${applicationID}/contacts/${contactToEdit.contactID}`

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
      console.log("Attempting to delete contact with ID:", contactID);
      // עדכון ה-API URL עם ה-contactID שנשלח
      const API_URL =
        `https://proj.ruppin.ac.il/igroup11/prod/api/JobSeekers/deleteContact/${User.id}/applications/${applicationID}/contacts/${contactID}`

      const response = await fetch(API_URL, {
        method: "DELETE",
      });

      console.log("Response status:", response.status);

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

      // הצג פופאפ הצלחה
      setCustomPopupMessage("Contact deleted successfully!");
      setCustomPopupIcon("check-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);
    } catch (error) {
      console.error("Error deleting contact:", error);

      setCustomPopupMessage("Failed to delete contact");
      setCustomPopupIcon("alert-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);
    }
  };

  const addContact = async () => {
    if (!validateContact()) {
      return;
    }

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
        `https://proj.ruppin.ac.il/igroup11/prod/api/JobSeekers/${User.id}/applications/${applicationID}/contacts`

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

      // עכשיו שנקבל את איש הקשר שנוסף, נעדכן את הסטייט
      setApplication((prevApp) => {
        const updatedContacts = [...prevApp.contacts, addedContact];
        console.log("Updated contacts array:", updatedContacts);
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

  useEffect(() => {
    console.log("Contacts after add:", application.contacts);
  }, [application.contacts]);

  const renderDisplayMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      {/* go back to all applications only for ios*/}
      {(Platform.OS === "ios" || Platform.OS === "android") && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AllUserApplications")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 5,
          }}
        >
          <FontAwesome name="arrow-left" size={24} color="#9FF9D5" />
          <Text
            style={{
              marginLeft: 10,
              marginLeft: 10,
              fontSize: 16,
              color: "#003D5B",
              fontFamily: "Inter_400Regular",
            }}
          >
            All Applications
          </Text>
        </TouchableOpacity>
      )}

      {/*a[[lication title*/}
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
        {/* Add Notes icon */}
        <View style={styles.addIconButton}>
          <Text style={styles.addText}>
            <Icon name="note-add" size={30} color="#b9a7f2" /> Notes
          </Text>
        </View>
        <Text style={styles.text}>{application.notes}Notes</Text>
      </View>

      <View>
        {application.contacts.map((contact, index) => (
          <View key={contact.contactID || index} style={styles.contactRow}>
            {/* contact icon*/}
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

        {/* Contacts modal*/}
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
                  {/* Edit Contact btn*/}
                  <Button
                    mode="contained"
                    onPress={() => {
                      setContactModalVisible(false);
                      setIsEditingContact(true);
                    }}
                    style={[styles.modalButton, { backgroundColor: "#d6cbff" }]}
                    //labelStyle={{ color: "#003D5B" }}
                    labelStyle={styles.buttonLabel}
                  >
                    Edit Contact
                  </Button>

                  {/* delte contact btn*/}
                  <Button
                    mode="contained"
                    onPress={() => {
                      console.log(
                        "Deleting contact with ID:",
                        contactToEdit.contactID
                      );
                      setContactModalVisible(false);
                      setCustomPopupMessage(
                        "Are you sure you want to delete this contact?"
                      );
                      setCustomPopupIcon("alert-circle");
                      setCustomPopupConfirmation(true);
                      // שלח את ה־ID לפופאפ כך שפונקציית המחיקה תוכל לפעול ישירות.
                      setOnConfirmAction(
                        () => () => deleteContact(contactToEdit.contactID)
                      ); // העברת ה־ID ישירות לפונקציה
                      setCustomPopupVisible(true);
                    }}
                    style={[styles.modalButton, { backgroundColor: "#d6cbff" }]}
                    labelStyle={styles.buttonLabel}
                  >
                    Delete
                  </Button>
                </View>

                <Button
                  mode="outlined"
                  onPress={() => {
                    setContactModalVisible(false);
                    setContactToEdit(null);
                  }}
                  style={styles.modalCloseButton}
                  labelStyle={styles.cancelButtonLabel}
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
        onPress={() => {
          // שמור את המצב הנוכחי לפני העריכה
          setOriginalApplication({ ...application });
          setIsEditing(true);
        }}
        style={styles.button}
      >
        Edit Application
      </Button>

      <Button
        mode="outlined"
        onPress={() => {
          setCustomPopupMessage(
            "Are you sure you want to delete this application?"
          );
          setCustomPopupIcon("alert-circle");
          setCustomPopupConfirmation(true);
          setOnConfirmAction(() => handleDeleteApplication); // שימו לב: אנחנו צריכים לשמור את הפונקציה עצמה
          setCustomPopupVisible(true);
        }}
        style={styles.button}
      >
        Delete Application
      </Button>
    </ScrollView>
  );

  /*const inputTheme = {
    colors: {
      text: "#003D5B", // צבע הטקסט בתוך השדה
      primary: "#BFB4FF", // צבע התווית כשהשדה בפוקוס
      placeholder: "#003D5B", // צבע הפלייסהולדר
    },
    fonts: {
      regular: {
        fontFamily: "Inter_400Regular",
      },
    },
  };*/

  const renderEditMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Application</Text>

      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Job Title
          </Text>
        }
        value={application.title}
        onChangeText={(text) => handleChange("title", text)}
        style={styles.input}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Company Name
          </Text>
        }
        value={application.companyName}
        onChangeText={(text) => handleChange("companyName", text)}
        style={styles.input}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Location
          </Text>
        }
        value={application.location}
        onChangeText={(text) => handleChange("location", text)}
        style={styles.input}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            URL
          </Text>
        }
        value={application.url}
        onChangeText={(text) => handleChange("url", text)}
        style={styles.input}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Company Summary
          </Text>
        }
        value={application.companySummary}
        onChangeText={(text) => handleChange("companySummary", text)}
        style={styles.input}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Job Description
          </Text>
        }
        value={application.jobDescription}
        onChangeText={(text) => handleChange("jobDescription", text)}
        style={styles.input}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />

      <View style={styles.notesBox}>
        <View style={styles.addIconButton}>
          <Icon name="note-add" size={28} color="#b9a7f2" />
          <Text style={styles.addText}></Text>
        </View>

        {/* שדה ה־Notes */}
        <TextInput
          label={
            <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
              Notes
            </Text>
          }
          value={application.notes}
          onChangeText={(text) => handleChange("notes", text)}
          multiline
          style={styles.notesInput}
          textColor="#003D5B"
          fontFamily="Inter_400Regular"
        />
      </View>

      <TouchableOpacity
        onPress={() => setJobTypeModalVisible(true)}
        style={styles.dropdown}
      >
        <Text
          style={[
            styles.dropdownText,
            { color: application.JobType ? "#003D5B" : "#999" },
          ]}
        >
          {jobTypeList.find((j) => j.value === application.JobType)?.label ||
            "Select Job Type"}
        </Text>
      </TouchableOpacity>

      {/* Modal JobType */}
      <Modal
        visible={jobTypeModalVisible}
        transparent={true}
        onRequestClose={() => setJobTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* כותרת המודל */}
            <Text style={styles.modalHeader}>Select Job Type</Text>

            {/* רשימת האפשרויות */}
            <ScrollView>
              {jobTypeList.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange("JobType", item.value);
                    setJobTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setJobTypeModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Is Remote?</Text>
        <Switch
          value={application.isRemote}
          onValueChange={(val) => handleChange("isRemote", val)}
          color="#9FF9D5"
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Is Hybrid?</Text>
        <Switch
          value={application.isHybrid}
          onValueChange={(val) => handleChange("isHybrid", val)}
          color="#9FF9D5"
        />
      </View>

      <Button
        mode="contained"
        onPress={handleUpdate}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Save Changes
      </Button>
      <Button
        onPress={() => {
          // החזר את המצב המקורי
          setApplication({ ...originalApplication });
          setIsEditing(false);
        }}
        style={[styles.button, styles.cancelButton]}
        labelStyle={styles.cancelButtonLabel}
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
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Contact Name
          </Text>
        }
        value={contactToEdit.contactName}
        onChangeText={(text) => handleContactChange("contactName", text)}
        style={[
          styles.input,
          contactErrors.contactName ? styles.inputError : null,
        ]}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      {contactErrors.contactName ? (
        <Text style={styles.errorText}>
          <FontAwesome name="exclamation-circle" size={12} color="#BFB4FF" />{" "}
          {contactErrors.contactName}
        </Text>
      ) : null}

      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Contact Email
          </Text>
        }
        value={contactToEdit.contactEmail}
        onChangeText={(text) => handleContactChange("contactEmail", text)}
        style={[
          styles.input,
          contactErrors.contactEmail ? styles.inputError : null,
        ]}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      {contactErrors.contactEmail ? (
        <Text style={styles.errorText}>
          <FontAwesome name="exclamation-circle" size={12} color="#BFB4FF" />{" "}
          {contactErrors.contactEmail}
        </Text>
      ) : null}
      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Contact Phone
          </Text>
        }
        value={contactToEdit.contactPhone}
        onChangeText={(text) => handleContactChange("contactPhone", text)}
        style={[
          styles.input,
          contactErrors.contactPhone ? styles.inputError : null,
        ]}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      {contactErrors.contactPhone ? (
        <Text style={styles.errorText}>
          <FontAwesome name="exclamation-circle" size={12} color="#BFB4FF" />{" "}
          {contactErrors.contactPhone}
        </Text>
      ) : null}

      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_400Regular" }}>
            Contact Notes
          </Text>
        }
        value={contactToEdit.contactNotes}
        onChangeText={(text) => handleContactChange("contactNotes", text)}
        style={styles.input}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />

      <Button
        mode="contained"
        onPress={contactEditMode === "edit" ? handleUpdateContact : addContact}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {contactEditMode === "edit" ? "Save Contact" : "Add Contact"}
      </Button>
      <Button
        onPress={() => {
          setIsEditingContact(false);
          setContactToEdit(null);
          setContactErrors({
            contactName: "",
            contactEmail: "",
            contactPhone: "",
          });
        }}
        style={[styles.button, styles.cancelButton]}
        labelStyle={styles.cancelButtonLabel}
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
      {Platform.OS === "web" && <NavBar />} {/* Show NavBar only on web */}
      {isEditingContact
        ? renderContactEditMode()
        : isEditing
        ? renderEditMode()
        : renderDisplayMode()}
      {/*Platform.OS === "ios" && !isEditing && <NavBar />*/}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Application updated successfully!
      </Snackbar>
      {/* הוספת הפופאפ המותאם */}
      <View
        style={[
          styles.popupOverlay,
          !customPopupVisible && { display: "none" },
        ]}
      >
        <CustomPopup
          visible={customPopupVisible}
          onDismiss={() => setCustomPopupVisible(false)}
          icon={customPopupIcon}
          message={customPopupMessage}
          isConfirmation={customPopupConfirmation}
          onConfirm={() => {
            setCustomPopupVisible(false);
            onConfirmAction(); // מבצע את הפעולה אחרי אישור
          }}
          onCancel={() => setCustomPopupVisible(false)}
        />
      </View>
      {Platform.OS !== "web" && (
        <TouchableOpacity
          style={styles.chatIcon}
          onPress={() => setShowChat(!showChat)}
        >
          <FontAwesome6 name="robot" size={24} color="#9FF9D5" />
        </TouchableOpacity>
      )}
      {showChat && (
        <View style={appliedStyles.overlay}>
          <View style={appliedStyles.chatModal}>
            <TouchableOpacity
              onPress={() => setShowChat(false)}
              style={{ alignSelf: "flex-end", padding: 5 }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>✖</Text>
            </TouchableOpacity>
            <GeminiChat />
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5, // צל ב-Android
  },
  chatModal: {
    position: "absolute",
    bottom: 80, // שינוי מ-90 ל-80 להתאמה למיקום החדש
    right: 10,
    width: "90%",
    height: 500,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  container: {
    padding: 20,
    backgroundColor: "white",
    position: Platform.OS === "web" ? "static" : "relative", // תעשה את ה־position relative רק במובייל
  },
  header: {
    fontSize: 24,
    fontWeight: 900,
    marginBottom: 20,
    color: "#003D5B",
    fontFamily: "Inter_400Regular",
    textAlign: Platform.OS === "web" ? "left" : "center",
    marginTop: Platform.OS === "web" ? 0 : 20, // במובייל נשאיר רווח קטן מעל הכותרת כדי לתת מקום לכפתור
  },
  label: {
    fontWeight: 800, //need to add more bold
    fontSize: 18,
    marginTop: 10,
    fontFamily: "Inter_400Regular",
    color: "#003D5B",
  },
  text: {
    marginBottom: 10,
    fontSize: 17,
    fontFamily: "Inter_300Light",
    color: "#003D5B",
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
    marginLeft:
      Platform.OS === "ios" || Platform.OS === "android" ? "25%" : 170, // במובייל נמרכז את הכפתור
  },

  cancelButton: {
    backgroundColor: "#rgba(243, 240, 240, 0.89)",
  },
  company: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 10,
    color: "#003D5B",
    fontFamily: "Inter_300Light",
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

  switchText: {
    fontFamily: "Inter_400Regular",
    color: "#003D5B",
    fontSize: 16,
  },

  notesBox: {
    position:
      Platform.OS === "ios" || Platform.OS === "android"
        ? "relative"
        : "absolute", // ב־iOS ו־Android, נשים את ה־notesBox מתחת לשדות
    top: Platform.OS === "ios" || Platform.OS === "android" ? 20 : 30, // Adjust top margin for mobile
    right: Platform.OS === "ios" || Platform.OS === "android" ? 5 : 10, // הזזת ה־right
    left: Platform.OS === "ios" || Platform.OS === "android" ? 2 : undefined, // הוספת left במובייל כדי להזיז ימינה
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
    marginTop: Platform.OS === "ios" || Platform.OS === "android" ? 20 : 0, // הוספת רווח במובייל
    marginBottom: Platform.OS === "ios" || Platform.OS === "android" ? 40 : 0, // הוספת רווח נוסף בין ה־notesBox לכפתורים במובייל
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
    fontSize: 20,
    fontFamily: "Inter_300Light",
    color: "#003D5B",
    fontWeight: 600,
  },

  buttonLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#003D5B",
  },

  cancelButtonLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#003D5B",
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
    fontSize: 24,
    //fontWeight: "bold",
    marginBottom: 15,
    color: "#003D5B",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  modalItemText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#003D5B",
    textAlign: "center",
    paddingVertical: 8,
  },
  contactDetailsModal: {
    width: "100%",
  },
  contactDetailItem: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Inter_400Regular",
    color: "#003D5B",
  },

  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    width: "48%",
    fontFamily: "Inter_400Regular",
  },
  modalCloseButton: {
    marginTop: 15,
    width: "100%",
    borderColor: "#ccc",
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      Platform.OS === "web" ? "transparent" : "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10,
    color: "#2C3E50",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
    //fontFamily: "Inter_300Light",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  dropdownText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    text: "#003D5B",
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // גבול בין כל אפשרות באותו המודל
    justifyContent: "center",
    alignItems: "center",
    color: "#003D5B",
  },

  // סגנון לכפתור ביטול
  modalCancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  modalCancelButtonText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#BFB4FF",
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: Platform.OS === "web" ? 0 : 20, // ריווח עליון במצב נייד
  },
  backButtonHeader: {
    marginRight: 15,
    paddingRight: 5,
  },
});

const Webstyles = StyleSheet.create({
  chatIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    zIndex: 10,
  },
  chatModal: {
    position: "absolute",
    bottom: 0,
    right: 10,
    width: "40%",
    height: 450,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  errorText: {
    color: "#BFB4FF",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputError: {
    borderColor: "#BFB4FF",
    borderWidth: 1,
  },
});