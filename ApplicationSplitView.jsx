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

export default function ApplicationSplitView() {
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
  const [isAddingNew, setIsAddingNew] = useState(false);

  const userID = 1;

  //  עטיפת fetchApps ב-useCallback
  const fetchApps = useCallback(async () => {
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
  }, []);

  // קריאה ל-fetchApps בטעינה
  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

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
          ? `https://localhost:7137/api/JobSeekers/deleteById/${userID}/${applicationIDToDelete}`
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
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
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
                  onPress={() => handleDeleteApplication(app.applicationID)}
                >
                  <Text style={{ fontSize: 14, color: "#9FF9D5" }}>X</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* 🔹 כפתור הוספת משרה */}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splitView: {
    flexDirection: "row",
    //flex: 1,
    //paddingTop: 80, //  מוסיף מקום ל־NavBar הקבוע למעלה
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

  /*rightPane: {
    width: "70%",
    overflow: "auto",
    marginTop: 20,
  },*/

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
});
