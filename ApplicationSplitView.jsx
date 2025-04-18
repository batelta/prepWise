import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Application from "./Application";
import AddApplication from "./AddApplication";
import NavBar from "./NavBar";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_300Light,
  Inter_700Bold,
  Inter_100Thin,
  Inter_200ExtraLight,
} from "@expo-google-fonts/inter";
import CustomPopup from "./CustomPopup";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import GeminiChat from "./GeminiChat";

import { useContext } from "react";
import { UserContext } from "./UserContext";
import { useRoute } from "@react-navigation/native";

export default function ApplicationSplitView() {
  const route = useRoute();

  const { startWithAddNew } = route.params || {};
console.log('params from navbar',startWithAddNew)
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
  });
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
 

  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(() => {
    return route.params?.startWithAddNew || false;
  });

  //delete popup states
  const [customPopupVisible, setCustomPopupVisible] = useState(false);
  const [customPopupMessage, setCustomPopupMessage] = useState("");
  const [customPopupIcon, setCustomPopupIcon] = useState("information");
  const [customPopupConfirmation, setCustomPopupConfirmation] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const [showChat, setShowChat] = useState(false);
  const appliedStyles = Platform.OS === "web" ? Webstyles : styles;

  //const userID = 6;

  const { Loggeduser } = useContext(UserContext);

  //  עטיפת fetchApps ב-useCallback
  /*const fetchApps = useCallback(async (userID) => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `https://localhost:7137/api/JobSeekers/${userID}/applications`
          : `http://192.168.1.92:7137/api/JobSeekers/${userID}/applications`;

      const response = await fetch(API_URL);
      const data = await response.json();
      setApplications(data);

      if (data.length > 0) {
        setSelectedId(data[0].applicationID);
        setIsAddingNew(false);
      } else {
        setIsAddingNew(true);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, []);*/

  // קריאה ל-fetchApps בטעינה
  /*useEffect(() => {
    fetchApps();
  }, [fetchApps]);*/

  const fetchApps = useCallback(async (userID) => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `http://localhost:5062/api/JobSeekers/${userID}/applications`
          : `http://192.168.1.92:7137/api/JobSeekers/${userID}/applications`;

      const response = await fetch(API_URL);
      const data = await response.json();
      setApplications(data);

      if (data.length > 0) {
        setApplications(data);
        // Don't force select if you started in add mode
        if (!startWithAddNew) {
          setSelectedId(data[0].applicationID);
          setIsAddingNew(false);
        }
      } else {
        setIsAddingNew(true);
      }
      
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (Loggeduser?.userID) {
      fetchApps(Loggeduser.userID);
    }
  }, [Loggeduser]);

  if (Platform.OS !== "web") {
    return (
      <View style={styles.centered}>
        <Text>This layout is available only on web</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading applications...</Text>
      </View>
    );
  }

  const handleDeleteApplication = async (applicationIDToDelete) => {
    try {
      const API_URL =
        Platform.OS === "web"
          ? `http://localhost:5062/api/JobSeekers/deleteById/${userID}/${applicationIDToDelete}`
          : `http://192.168.1.92:7137/api/JobSeekers/deleteById/${userID}/${applicationIDToDelete}`;

      const response = await fetch(API_URL, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete application");

      // עדכון רשימה אחרי מחיקה
      const updated = applications.filter(
        (app) => app.applicationID !== applicationIDToDelete
      );
      setApplications(updated);

      if (selectedId === applicationIDToDelete) {
        setSelectedId(null);
      }

      if (updated.length === 0) {
        setIsAddingNew(true);
      }

      // הצגת הודעת הצלחה
      setCustomPopupMessage("Application deleted successfully!");
      setCustomPopupIcon("check-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);
    } catch (error) {
      console.error("Error deleting application:", error);

      setCustomPopupMessage("Failed to delete application");
      setCustomPopupIcon("alert-circle");
      setCustomPopupConfirmation(false);
      setCustomPopupVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.splitView}>
          <NavBar style={styles.navbar} />

          {/* 🔹 Left Pane */}

          <View style={styles.leftPane}>
            <Text style={styles.header}>All Applications</Text>
            {applications.map((app) => (
              <TouchableOpacity
                key={app.applicationID}
                style={[
                  styles.card,
                  selectedId === app.applicationID && styles.activeCard,
                ]}
                onPress={() => {
                  setSelectedId(app.applicationID);
                  setIsAddingNew(false);
                }}
              >
                <MaterialIcons name="work-outline" size={34} color="#9FF9D5" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.title}>{app.title}</Text>
                  <Text style={styles.subtitle}>{app.companyName}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => {
                    // שימור ID המשרה למחיקה
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
                  <Text style={{ fontSize: 14, color: "#9FF9D5" }}>X</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => {
                setIsAddingNew(true);
                setSelectedId(null);
              }}
              style={styles.addButton}
            >
              <MaterialIcons
                name="add-circle-outline"
                size={24}
                color="#b9a7f2"
              />
              <Text style={styles.addButtonText}>Add New Application</Text>
            </TouchableOpacity>
          </View>

          {/* 🔹 Right Pane */}
{/***
          <View style={styles.rightPane}>
            {isAddingNew ? (
              <AddApplication
                onSuccess={() => {
                  fetchApps(); // רענון רשימה אחרי הוספה
                  setIsAddingNew(false);
                }}
              />
            ) : selectedId ? (
              <Application applicationID={selectedId} />
            ) : (
              <Text style={{ padding: 20 }}>
                Select an application to view details
              </Text>
            )}
          </View>
 */}

<View style={styles.rightPane}>
  {isAddingNew ? (
    <AddApplication
      onSuccess={() => {
        fetchApps(Loggeduser.userID);
        setIsAddingNew(false);
      }}
    />
  ) : selectedId ? (
    <Application 
      applicationID={selectedId} 
      key={selectedId} // חשוב מאוד! גורם ל-Application להתאפס כאשר המזהה משתנה
    />
  ) : (
    <Text style={{ padding: 20 }}>
      Select an application to view details
    </Text>
  )}
</View>

        </View>
      </ScrollView>
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
              handleDeleteApplication(applicationToDelete);
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
      <TouchableOpacity
        style={styles.chatIcon}
        onPress={() => setShowChat(!showChat)}
      >
        <FontAwesome6 name="robot" size={24} color="#9FF9D5" />
      </TouchableOpacity>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splitView: {
    flexDirection: "row",
  },

  container: {
    flex: 1,
  },

  leftPane: {
    width: "30%",
    backgroundColor: "#rgba(253, 253, 253, 0.51)",
    padding: 15,
    marginTop: 20,
  },
  rightPane: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // עבור אנדרואיד
    width: "68%",
    margin: 10,
    overflow: "auto",
    marginTop: 80,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#163349",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  activeCard: {
    backgroundColor: "#DCEFFF",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#163349",
  },
  subtitle: {
    color: "#666",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#b9a7f2",
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: "#b9a7f2",
    fontWeight: "600",
  },

  deleteIcon: {
    position: "absolute",
    right: 10,
    top: 3,
    zIndex: 2,
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // רקע חצי שקוף
    justifyContent: "center",
    alignItems: "center", // מרכז את הפופאפ על המסך
    zIndex: 1000, // ודא שהפופאפ יהיה מעל כל שאר התוכן
  },
  chatIcon: {
    position: "absolute",
    bottom: 5,
    right: 45,
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
    marginBottom: 12,
  },
  chatModal: {
    position: "absolute",
    bottom: 80,
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