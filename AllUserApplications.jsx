import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Provider as PaperProvider, Button } from "react-native-paper";
import NavBar from "./NavBar";
import CustomPopup from "./CustomPopup";

export default function AllUserApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  //states for popup
  const [customPopupVisible, setCustomPopupVisible] = useState(false);
  const [customPopupMessage, setCustomPopupMessage] = useState("");
  const [customPopupIcon, setCustomPopupIcon] = useState("information");
  const [customPopupConfirmation, setCustomPopupConfirmation] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const userId = 6;

  /*const sampleApplication = {
    applicationID: 1,
    title: "Software Engineer",
    companyName: "TechCorp",
    location: "New York, NY",
    jobType: "Full Time",
  };*/

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const API_URL =
          Platform.OS === "web"
            ? `https://localhost:7137/api/JobSeekers/${userId}/applications`
            : `http://10.0.0.18:7137/api/JobSeekers/${userId}/applications`;

        /*192.168.1.64/92*/
        /*10.0.0.18:7137*/

        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("Applications from API:", data);
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#666" />
        <Text>Loading applications...</Text>
      </View>
    );
  }

  const handleDelete = async (applicationID) => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/deleteById/${userId}/${applicationID}`
          : `http://192.168.1.92:7137/api/JobSeekers/deleteById/${userId}/${applicationID}`;

      console.log("🔍 Deleting application at URL:", API_URL);

      const response = await fetch(API_URL, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete");

      setApplications((prev) =>
        prev.filter((app) => app.applicationID !== applicationID)
      );

      // הצגת הודעת הצלחה
      setCustomPopupMessage("Application deleted successfully!");
      setCustomPopupIcon("check-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);
    } catch (error) {
      console.error(" Error deleting:", error);
      // הצגת הודעת שגיאה
      setCustomPopupMessage("Could not delete application.");
      setCustomPopupIcon("alert-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* התוכן הגולל */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>All Applications</Text>
        {applications.map((app) => (
          <View key={app.applicationID} style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => {
                // שמירת ה-ID של המשרה למחיקה
                setApplicationToDelete(app.applicationID);
                // הצגת פופאפ אישור
                setCustomPopupMessage(
                  "Are you sure you want to delete this application?"
                );
                setCustomPopupIcon("alert-circle");
                setCustomPopupConfirmation(true);
                setCustomPopupVisible(true);
              }}
            >
              <Text style={{ fontSize: 16, color: "#9FF9D5" }}>X</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                console.log("Navigating to:", app.applicationID);
                navigation.navigate("Application", {
                  applicationID: app.applicationID,
                });
              }}
            >
              <View style={styles.row}>
                <MaterialIcons
                  name="work-outline"
                  size={36}
                  color="#9FF9D5"
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text style={styles.title}>{app.title}</Text>
                  <Text style={styles.company}>{app.companyName}</Text>
                </View>
              </View>

              <MaterialIcons name="chevron-right" size={24} color="#9FF9D5" />
            </TouchableOpacity>
          </View>
        ))}

        <Button
          mode="contained"
          onPress={() => navigation.navigate("AddApplication")}
          style={{ marginTop: 30 }}
        >
          Add New Application
        </Button>
      </ScrollView>

      <NavBar />

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
            if (applicationToDelete) {
              handleDelete(applicationToDelete);
            }
            setCustomPopupVisible(false);
            setApplicationToDelete(null);
          }}
          onCancel={() => {
            setCustomPopupVisible(false);
            setApplicationToDelete(null);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    minHeight: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#163349",
  },
  cardContainer: {
    marginBottom: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  deleteIcon: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 2,
  },
  card: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    padding: 15,
    paddingLeft: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#163349",
  },
  company: {
    fontSize: 14,
    color: "#555",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  wrapper: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
