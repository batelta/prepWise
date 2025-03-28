import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Provider as PaperProvider,
  Button,
  Snackbar,
  Switch,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function AddApplication() {
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

  const jobTypeList = [
    { label: "Full Time", value: "FullTime" },
    { label: "Part Time", value: "PartTime" },
    { label: "Internship", value: "Internship" },
    { label: "Freelance", value: "Freelance" },
    { label: "Temporary", value: "Temporary" },
    { label: "Student", value: "Student" },
  ];

  const [titleError, setTitleError] = useState(false); //for veristion that the user insert title

  const handleAppChange = (field, value) => {
    setApplication((prevApp) => ({ ...prevApp, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setContact((prevContact) => ({ ...prevContact, [field]: value }));
  };

  const addNewApplication = async () => {
    if (!application.Title.trim()) {
      setTitleError(true); // הצג שגיאה
      return; // עצור את השליחה
    } else {
      setTitleError(false);
    }
    const userId = "5"; //wil adjust later to take the ID of the login user

    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/${userId}/applications`
          : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications`;

      const appToSend = {
        ...application, // the app object that send in the reqest
        Contacts: hasContact ? [contact] : [], //if the user add contact he will send in the call body, if no so will send empty arr
      };

      console.log("Sending to API:", JSON.stringify(appToSend, null, 2));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appToSend),
      });

      const resText = await response.text();
      console.log("Response:", resText);

      if (response.ok) {
        console.log("Application submitted!");
        setShowSnackbar(true);
        setTimeout(() => {
          navigation.navigate("AllUserApplications");
        }, 1700);
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text>Add New Application</Text>

          <TextInput
            label="Application Title"
            value={application.Title}
            onChangeText={(text) => {
              handleAppChange("Title", text);
              if (text.trim()) setTitleError(false); // נקה את השגיאה אם המשתמש כתב
            }}
          />
          {titleError && (
            <Text style={{ color: "red", marginBottom: 10 }}>
              Title is required
            </Text>
          )}
          <TextInput
            label="Company Name"
            value={application.CompanyName}
            onChangeText={(text) => handleAppChange("CompanyName", text)}
          />
          <TextInput
            label="Location"
            value={application.Location}
            onChangeText={(text) => handleAppChange("Location", text)}
          />
          <TextInput
            label="URL"
            value={application.Url}
            onChangeText={(text) => handleAppChange("Url", text)}
          />
          <TextInput
            label="Company Summary"
            value={application.CompanySummary}
            onChangeText={(text) => handleAppChange("CompanySummary", text)}
            multiline
          />
          <TextInput
            label="Job Description"
            value={application.JobDescription}
            onChangeText={(text) => handleAppChange("JobDescription", text)}
            multiline
          />
          <TextInput
            label="Notes"
            value={application.Notes}
            onChangeText={(text) => handleAppChange("Notes", text)}
            multiline
          />

          {/* Job Type Dropdown */}
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
            <Text style={{ color: application.JobType ? "#000" : "#999" }}>
              {jobTypeList.find((j) => j.value === application.JobType)
                ?.label || "Select Job Type"}
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
                      handleAppChange("JobType", item.value);
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ marginRight: 10 }}>Is Hybrid?</Text>
            <Switch
              value={application.IsHybrid}
              onValueChange={(val) => handleAppChange("IsHybrid", val)}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ marginRight: 10 }}>Is Remote?</Text>
            <Switch
              value={application.IsRemote}
              onValueChange={(val) => handleAppChange("IsRemote", val)}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ marginRight: 10 }}>
              Do you have a contact person?
            </Text>
            <Switch value={hasContact} onValueChange={setHasContact} />
          </View>

          {hasContact && (
            <>
              <TextInput
                label="Contact Name"
                value={contact.ContactName}
                onChangeText={(text) =>
                  handleContactChange("ContactName", text)
                }
              />
              <TextInput
                label="Contact Email"
                value={contact.ContactEmail}
                onChangeText={(text) =>
                  handleContactChange("ContactEmail", text)
                }
                keyboardType="email-address"
              />
              <TextInput
                label="Contact Phone"
                value={contact.ContactPhone}
                onChangeText={(text) =>
                  handleContactChange("ContactPhone", text)
                }
                keyboardType="phone-pad"
              />
              <TextInput
                label="Contact Notes"
                value={contact.ContactNotes}
                onChangeText={(text) =>
                  handleContactChange("ContactNotes", text)
                }
                multiline
              />
            </>
          )}

          <Button
            mode="contained"
            onPress={addNewApplication}
            style={{ marginTop: 30 }}
          >
            Submit Application
          </Button>

          <Snackbar
            visible={showSnackbar}
            onDismiss={() => setShowSnackbar(false)}
            duration={3000}
          >
            Application submitted successfully!
          </Snackbar>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
