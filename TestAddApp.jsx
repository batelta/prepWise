import React, { useState } from "react";
import {
  TextInput,
  Button,
  Snackbar,
  Text,
  SegmentedButtons,
  Switch,
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

export default function TestAddApp({ onSuccess }) {
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

  const [jobTypeModalVisible, setJobTypeModalVisible] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [mode, setMode] = useState("url");
  const [imported, setImported] = useState(false);

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
  };

  const addNewApplication = async () => {
    console.log(" SUBMIT CLICKED");
    console.log("hasContact:", hasContact);
    console.log("Contacts field will be sent as:", hasContact ? [contact] : []);

    if (!application.Title.trim()) {
      setTitleError(true);
      return;
    } else {
      setTitleError(false);
    }

    const userID = 1;

    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/${userID}/applications`
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
      console.log("🧾 Final JSON string:", finalJSON);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appToSend),
      });

      console.log("📡 Response status:", response.status);

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
    }
  };

  const importFromUrl = async () => {
    if (!application.Url.trim()) {
      alert("Please enter a valid job URL.");
      return;
    }

    try {
      const API_URL =
        Platform.OS === "web"
          ? "https://localhost:7137/api/Application/fetch-job"
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
    } catch (error) {
      console.error(" Error importing job data:", error);
      alert("Failed to import job details. Please try again.");
    }
  };

  const renderUrlForm = () => (
    //auto fill application
    <>
      <TextInput
        label="Job URL"
        value={application.Url}
        onChangeText={(text) => handleAppChange("Url", text)}
        style={styles.input}
        placeholder="https://example.com/job/..."
      />

      <Button
        mode="outlined"
        onPress={importFromUrl}
        icon="download"
        style={{ marginBottom: 20 }}
      >
        Import Job Details
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
      />
      {titleError && <Text style={styles.errorText}>Title is required</Text>}

      <TextInput
        label="Company Name"
        value={application.CompanyName}
        onChangeText={(text) => handleAppChange("CompanyName", text)}
        style={styles.input}
      />
      <TextInput
        label="Location"
        value={application.Location}
        onChangeText={(text) => handleAppChange("Location", text)}
        style={styles.input}
      />
      <TextInput
        label="Company Summary"
        value={application.Location}
        onChangeText={(text) => handleAppChange("CompanySummary", text)}
        style={styles.input}
      />
      <TextInput
        label="Job Description"
        value={application.JobDescription}
        onChangeText={(text) => handleAppChange("JobDescription", text)}
        style={styles.input}
      />
      <TextInput
        label="Notes"
        value={application.Notes}
        onChangeText={(text) => handleAppChange("Notes", text)}
        style={styles.input}
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
        />

        {mode === "url" && renderUrlForm()}
        {mode === "url" && imported && renderManualForm()}
        {mode === "manual" && renderManualForm()}

        <TouchableOpacity
          onPress={() => setJobTypeModalVisible(true)}
          style={styles.dropdown}
        >
          <Text style={{ color: application.JobType ? "#000" : "#999" }}>
            {jobTypeList.find((j) => j.value === application.JobType)?.label ||
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
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setJobTypeModalVisible(false)}
          >
            <View style={styles.modalContent}>
              {jobTypeList.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    handleAppChange("JobType", item.value);
                    setJobTypeModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={{ fontSize: 16 }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.switchRow}>
          <Text>Is Hybrid?</Text>
          <Switch
            value={application.IsHybrid}
            onValueChange={(val) => handleAppChange("IsHybrid", val)}
            color="#9FF9D5"
          />
        </View>

        <View style={styles.switchRow}>
          <Text>Is Remote?</Text>
          <Switch
            value={application.IsRemote}
            onValueChange={(val) => handleAppChange("IsRemote", val)}
            color="#9FF9D5"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <Text>Do you have a contact person?</Text>
          <Switch
            value={hasContact}
            onValueChange={setHasContact}
            color="#9FF9D5"
          />
        </View>

        {hasContact && (
          <View style={styles.contactBox}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <TextInput
              label="Contact Name"
              value={contact.ContactName}
              onChangeText={(text) => handleContactChange("ContactName", text)}
              style={styles.input}
            />
            <TextInput
              label="Contact Email"
              value={contact.ContactEmail}
              onChangeText={(text) => handleContactChange("ContactEmail", text)}
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              label="Contact Phone"
              value={contact.ContactPhone}
              onChangeText={(text) => handleContactChange("ContactPhone", text)}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TextInput
              label="Contact Notes"
              value={contact.ContactNotes}
              onChangeText={(text) => handleContactChange("ContactNotes", text)}
              multiline
              style={styles.input}
            />
          </View>
        )}

        <Button
          mode="contained"
          onPress={addNewApplication}
          style={{ marginTop: 30 }}
          icon="check"
        >
          Submit Application
        </Button>

        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={3000}
        >
          Application details imported successfully!
        </Snackbar>
      </ScrollView>
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
    //fontWeight: "bold",
    marginBottom: 20,
    color: "#163349",
    fontFamily: "Inter_700Bold",
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
    fontFamily: "Inter_300Light",
    color: "#003D5B",
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  divider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 25,
  },
  contactBox: {
    backgroundColor: "#EFF4F7",
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
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
