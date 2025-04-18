import React, { useState ,useEffect} from "react";
import {
  TextInput,
  Button,
  Snackbar,
  Text,
  SegmentedButtons,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_300Light,
  Inter_700Bold,
  Inter_100Thin,
  Inter_200ExtraLight,
} from "@expo-google-fonts/inter";
import GeminiChat from "./GeminiChat";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function AddApplication({ onSuccess }) {
  const { Loggeduser } = useContext(UserContext);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if (Loggeduser) {
      setUserID(Loggeduser.userID);
      console.log(Loggeduser);
    }
  }, [Loggeduser]);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
  });
  const navigation = useNavigation();

  const [application, setApplication] = useState({
    Title: "",
    CompanyName: "",
    Location: "",
    Url: "",
    CompanySummary: "",
    JobDescription: "",
    Notes: "",
    JobType: "",
    IsHybrid: false,
    IsRemote: false,
    Contacts: [],
  });

  const [hasContact, setHasContact] = useState(false);
  const [contact, setContact] = useState({
    ContactName: "",
    ContactEmail: "",
    ContactPhone: "",
    ContactNotes: "",
  });

  //  סטייט לשגיאות
  const [contactErrors, setContactErrors] = useState({
    ContactName: "",
    ContactEmail: "",
    ContactPhone: "",
  });

  const [jobTypeModalVisible, setJobTypeModalVisible] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [mode, setMode] = useState("url");
  const [imported, setImported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const appliedStyles = Platform.OS === "web" ? Webstyles : styles;

  const jobTypeList = [
    { label: "Full Time", value: "FullTime" },
    { label: "Part Time", value: "PartTime" },
    { label: "Internship", value: "Internship" },
    { label: "Freelance", value: "Freelance" },
    { label: "Temporary", value: "Temporary" },
    { label: "Student", value: "Student" },
  ];

  const handleAppChange = (field, value) => {
    setApplication((prevApp) => ({ ...prevApp, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setContact((prevContact) => ({ ...prevContact, [field]: value }));

    // בדיקות תקינות לפי סוג השדה
    if (field === "ContactName") {
      if (!value.trim()) {
        setContactErrors((prevErrors) => ({ ...prevErrors, ContactName: "" }));
      } else if (!/^[A-Za-z\s]{1,30}$/.test(value)) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          ContactName: "Only letters and spaces, up to 30 characters.",
        }));
      } else {
        setContactErrors((prevErrors) => ({ ...prevErrors, ContactName: "" }));
      }
    }

    if (field === "ContactEmail") {
      if (!value.trim()) {
        setContactErrors((prevErrors) => ({ ...prevErrors, ContactEmail: "" }));
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      ) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          ContactEmail: "Enter a valid email address.",
        }));
      } else {
        setContactErrors((prevErrors) => ({ ...prevErrors, ContactEmail: "" }));
      }
    }

    if (field === "ContactPhone") {
      if (!value.trim()) {
        setContactErrors((prevErrors) => ({ ...prevErrors, ContactPhone: "" }));
      } else if (!/^[0-9+\-\s]{6,15}$/.test(value)) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          ContactPhone: "Enter a valid phone number (6-15 digits).",
        }));
      } else {
        setContactErrors((prevErrors) => ({ ...prevErrors, ContactPhone: "" }));
      }
    }
  };

  const addNewApplication = async () => {
    if (!application.Title.trim()) {
      setTitleError(true);
      return;
    } else {
      setTitleError(false);
    }

    // בדיקת תקינות נתוני איש קשר אם נבחרה האפשרות
    if (hasContact) {
      // בדיקה שיש לפחות שם או אימייל
      const isValidContact =
        contact.ContactName.trim() !== "" || contact.ContactEmail.trim() !== "";

      if (!isValidContact) {
        alert("Please fill in at least a contact name or email.");
        return;
      }

      let hasValidationError = false;

      if (
        contact.ContactName.trim() &&
        !/^[A-Za-z\s]{1,30}$/.test(contact.ContactName)
      ) {
        setContactErrors((prev) => ({
          ...prev,
          ContactName: "Only letters and spaces, up to 30 characters.",
        }));
        hasValidationError = true;
      }

      if (
        contact.ContactEmail.trim() &&
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          contact.ContactEmail
        )
      ) {
        setContactErrors((prev) => ({
          ...prev,
          ContactEmail: "Enter a valid email address.",
        }));
        hasValidationError = true;
      }

      if (
        contact.ContactPhone.trim() &&
        !/^[0-9+\-\s]{6,15}$/.test(contact.ContactPhone)
      ) {
        setContactErrors((prev) => ({
          ...prev,
          ContactPhone: "Enter a valid phone number (6-15 digits).",
        }));
        hasValidationError = true;
      }

      if (hasValidationError) {
        alert(
          "Please fix the errors in the contact information before submitting."
        );
        return;
      }
    }
    ///
    //const userID = 6;

    setIsLoading(true); // הוספתי את זה - מפעיל את מצב הטעינה
    try {
      const API_URL =
        Platform.OS === "web"
          ? `http://localhost:5062/api/JobSeekers/${userID}/applications`
          : `http://192.168.1.92:7137/api/JobSeekers/${userID}/applications`;

      const isValidContact = //in case that the user open the contact switch but didn't add deatils.
        contact.ContactName.trim() !== "" || contact.ContactEmail.trim() !== "";

      if (hasContact && !isValidContact) {
        alert("Please fill in at least a contact name or email.");
        return;
      }

      const appToSend = {
        ...application,
        Contacts: hasContact ? [contact] : [],
      };

      console.log(" appToSend object before sending:", appToSend);
      console.log(" typeof contacts:", typeof appToSend.Contacts);
      console.log(" contacts value:", appToSend.Contacts);

      const finalJSON = JSON.stringify(appToSend, null, 2);
      console.log(" Final JSON string:", finalJSON);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appToSend),
      });

      console.log(" Response status:", response.status);

      setIsLoading(false); // ה מבטל את מצב הטעינה אחרי תגובת השרת

      if (response.ok) {
        setShowSnackbar(true);
        setTimeout(() => {
          if (Platform.OS === "web") {
            onSuccess?.(); // לרענן את רשימת המשרות בווב
          } else {
            navigation.navigate("AllUserApplications"); // נווט לעמוד המתאים במובייל
          }
        }, 1700);
      } else {
        const errorText = await response.text(); // תקבל את הודעת השגיאה מהשרת
        console.error(" Server response text:", errorText);
        throw new Error("Failed to submit application" + errorText);
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setIsLoading(false); // ה מבטל את מצב הטעינה במקרה של שגיאה
    }
  };

  const importFromUrl = async () => {
    if (!application.Url.trim()) {
      alert("Please enter a valid job URL.");
      return;
    }
    setIsLoading(true); // ה מפעיל את מצב הטעינה

    try {
      const API_URL =
        Platform.OS === "web"
          ? "https://localhost:5062/api/Application/fetch-job"
          : "http://192.168.1.92:7137/api/Application/fetch-job";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ URL: application.Url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job data");
      }

      const data = await response.json();
      console.log(" Gemini Result:", data);

      setApplication((prev) => ({
        ...prev,
        Title: data.title || prev.Title,
        CompanyName: data.companyName || prev.CompanyName,
        CompanySummary: data.companySummary || prev.CompanySummary,
        JobDescription: data.jobDescription || prev.JobDescription,
      }));

      //  מעבר אוטומטי למצב עריכה
      //setMode("manual");
      setImported(true);
      setShowSnackbar(true);

      setIsLoading(false); // מבטל את מצב הטעינה אחרי הצלחה
    } catch (error) {
      console.error(" Error importing job data:", error);
      alert("Failed to import job details. Please try again.");
      setIsLoading(false); // הוספתי את זה - מבטל את מצב הטעינה במקרה של שגיאה
    }
  };

  const renderUrlForm = () => (
    //auto fill application
    <>
      <TextInput
        label={
          <Text style={{ color: "#003D5B", fontFamily: "Inter_700Bold" }}>
            Enter Job URL
          </Text>
        }
        value={application.Url}
        onChangeText={(text) => handleAppChange("Url", text)}
        style={styles.input}
        disabled={isLoading}
        placeholder="https://example.com/job/..."
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />

      <Button
        mode="outlined"
        onPress={importFromUrl}
        icon={isLoading ? null : "download"} // ה מסתיר את האייקון בזמן טעינה
        //icon="download"
        style={{ marginBottom: 20 }}
        disabled={isLoading} // ה משבית את הכפתור בזמן טעינה
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} color="#BFB4FF" size="small" />
            <Text style={styles.loadingText}>Importing job details...</Text>
          </View>
        ) : (
          "Import Job Details"
        )}
      </Button>
    </>
  );

  const renderManualForm = () => (
    <>
      <TextInput
        label="Application Title"
        value={application.Title}
        onChangeText={(text) => {
          handleAppChange("Title", text);
          if (text.trim()) setTitleError(false);
        }}
        style={styles.input}
        disabled={isLoading}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      {titleError && <Text style={styles.errorText}>Title is required</Text>}

      <TextInput
        label="Company Name"
        value={application.CompanyName}
        onChangeText={(text) => handleAppChange("CompanyName", text)}
        style={styles.input}
        disabled={isLoading}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label="Location"
        value={application.Location}
        onChangeText={(text) => handleAppChange("Location", text)}
        style={styles.input}
        disabled={isLoading}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label="Company Summary"
        value={application.CompanySummary}
        onChangeText={(text) => handleAppChange("CompanySummary", text)}
        style={styles.input}
        disabled={isLoading}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label="Job Description"
        value={application.JobDescription}
        onChangeText={(text) => handleAppChange("JobDescription", text)}
        style={styles.input}
        disabled={isLoading}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
      <TextInput
        label="Notes"
        value={application.Notes}
        onChangeText={(text) => handleAppChange("Notes", text)}
        style={styles.input}
        disabled={isLoading}
        textColor="#003D5B"
        fontFamily="Inter_400Regular"
      />
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          Platform.OS === "web" && { paddingTop: 90 },
        ]}
      >
        {/* כפתור חזרה עם טקסט - עם צבע טקסט מעודכן */}
        {(Platform.OS === "ios" || Platform.OS === "android") && (
          <TouchableOpacity
            onPress={() => navigation.navigate("AllUserApplications")}
            style={{
              marginTop: 10,
              marginBottom: 25,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 5,
            }}
          >
            <FontAwesome name="arrow-left" size={24} color="#9FF9D5" />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                color: "#003D5B", // צבע טקסט מעודכן
                fontFamily: "Inter_400Regular",
              }}
            >
              All Applications
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.header}>Add New Application</Text>

        <SegmentedButtons //מאפשר את הבחירה בין המצבים של מילוי אוטומטי וידני
          value={mode}
          onValueChange={setMode}
          buttons={[
            { value: "url", label: "Paste Job URL", icon: "link" },
            {
              value: "manual",
              label: "Manualy Job Application", //will change that words later
              icon: "file-document-edit",
            },
          ]}
          style={{ marginBottom: 20 }}
          disabled={isLoading}
        />

        {mode === "url" && renderUrlForm()}
        {mode === "url" && imported && renderManualForm()}
        {mode === "manual" && renderManualForm()}

        <TouchableOpacity
          onPress={() => setJobTypeModalVisible(true)}
          style={styles.dropdown}
        >
          <Text style={{ color: application.JobType ? "#003D5B" : "#999" }}>
            {jobTypeList.find((j) => j.value === application.JobType)?.label ||
              "Select Job Type"}
          </Text>
        </TouchableOpacity>

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
                      handleAppChange("JobType", item.value);
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
          <Text style={styles.switchText}>Is Hybrid?</Text>
          <Switch
            value={application.IsHybrid}
            onValueChange={(val) => handleAppChange("IsHybrid", val)}
            color="#9FF9D5"
            disabled={isLoading}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Is Remote?</Text>
          <Switch
            value={application.IsRemote}
            onValueChange={(val) => handleAppChange("IsRemote", val)}
            color="#9FF9D5"
            disabled={isLoading}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <Text>Do you have a contact person?</Text>
          <Switch
            value={hasContact}
            onValueChange={setHasContact}
            color="#9FF9D5"
            disabled={isLoading}
          />
        </View>

        {hasContact && (
          <View style={styles.contactBox}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <TextInput
              label="Contact Name"
              value={contact.ContactName}
              onChangeText={(text) => handleContactChange("ContactName", text)}
              style={[
                styles.input,
                contactErrors.ContactName ? styles.inputError : null,
              ]}
              disabled={isLoading}
              textColor="#003D5B"
              fontFamily="Inter_400Regular"
            />

            {contactErrors.ContactName ? (
              <Text style={styles.errorText}>
                <FontAwesome
                  name="exclamation-circle"
                  size={12}
                  color="#BFB4FF"
                />{" "}
                {contactErrors.ContactName}
              </Text>
            ) : null}

            <TextInput
              label="Contact Email"
              value={contact.ContactEmail}
              onChangeText={(text) => handleContactChange("ContactEmail", text)}
              keyboardType="email-address"
              style={[
                styles.input,
                contactErrors.ContactEmail ? styles.inputError : null,
              ]}
              disabled={isLoading}
              textColor="#003D5B"
              fontFamily="Inter_400Regular"
            />
            {contactErrors.ContactEmail ? (
              <Text style={styles.errorText}>
                <FontAwesome
                  name="exclamation-circle"
                  size={12}
                  color="#BFB4FF"
                />{" "}
                {contactErrors.ContactEmail}
              </Text>
            ) : null}

            <TextInput
              label="Contact Phone"
              value={contact.ContactPhone}
              onChangeText={(text) => handleContactChange("ContactPhone", text)}
              keyboardType="phone-pad"
              style={[
                styles.input,
                contactErrors.ContactPhone ? styles.inputError : null,
              ]}
              disabled={isLoading}
              textColor="#003D5B"
              fontFamily="Inter_400Regular"
            />
            {contactErrors.ContactPhone ? (
              <Text style={styles.errorText}>
                <FontAwesome
                  name="exclamation-circle"
                  size={12}
                  color="#BFB4FF"
                />{" "}
                {contactErrors.ContactPhone}
              </Text>
            ) : null}

            <TextInput
              label="Contact Notes"
              value={contact.ContactNotes}
              onChangeText={(text) => handleContactChange("ContactNotes", text)}
              multiline
              style={styles.input}
              disabled={isLoading}
              textColor="#003D5B"
              fontFamily="Inter_400Regular"
            />
          </View>
        )}

        <Button
          mode="contained"
          onPress={addNewApplication}
          style={{ marginTop: 30 }}
          icon={isLoading ? null : "check"} // ה מסתיר את האייקון בזמן טעינה
          disabled={isLoading} // ה משבית את הכפתור בזמן טעינה
          //icon="check"
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} color="#fff" size="small" />
              <Text style={[styles.loadingText, { color: "#fff" }]}>
                Submitting...
              </Text>
            </View>
          ) : (
            "Submit Application"
          )}
        </Button>

        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={3000}
        >
          Application details imported successfully!
        </Snackbar>

        {/* Place the chat icon here, directly in the scroll view */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    paddingBottom: 100, // מוסיף ריווח נוסף בתחתית עבור האייקון
  },
  header: {
    marginBottom: 35,
    fontSize: 25,
    fontWeight: 900,
    color: "#003D5B",
    fontFamily: "Inter_400Regular",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 25,
    marginBottom: 10,
    color: "#003D5B",
    fontWeight: 700,
    fontFamily: "Inter_400Regular",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
    //fontFamily: "Inter_400Regular",
    //color: "#003D5B",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
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
  modalItemText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#003D5B",
    textAlign: "center",
    paddingVertical: 8,
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
  modalHeader: {
    fontSize: 24,
    //fontWeight: "bold",
    marginBottom: 15,
    color: "#003D5B",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },

  modalCancelButtonText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#BFB4FF",
    textAlign: "center",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  switchText: {
    fontFamily: "Inter_400Regular",
    color: "#003D5B",
    fontSize: 16,
  },

  divider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 25,
  },
  contactBox: {
    backgroundColor: "rgba(252, 248, 248, 0.91)",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
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

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
  },
  chatIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    zIndex: 999, // ערך גבוה יותר כדי להבטיח שיופיע מעל כל אלמנט אחר
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // הגדלנו את אטימות הצל
    shadowRadius: 5,
    elevation: 8, // הגדלנו את הבליטה ב-Android
    // הוספת מסגרת דקה להבלטה נוספת
    borderWidth: 1,
    borderColor: "rgba(159, 249, 213, 0.3)", // מסגרת בצבע דומה לאייקון
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
    marginBottom: 10,
    marginLeft: 5,
  },
  /*inputError: {
    borderColor: "#BFB4FF",
    borderWidth: 1,
  },*/
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
});