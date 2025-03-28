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

export default function AllUserApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const userId = 5;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const API_URL =
          Platform.OS === "web"
            ? `https://localhost:7137/api/JobSeekers/${userId}/applications`
            : `http://192.168.1.92:7137/api/JobSeekers/${userId}/applications`;

        /*192.168.1.64/92*/

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>All Applications</Text>
      {applications.map((app) => (
        <View key={app.applicationID} style={styles.cardContainer}>
          {/* Delete Icon */}
          <TouchableOpacity style={styles.deleteIcon}>
            <Text style={{ fontSize: 16, color: "#2EC4B6" }}>X</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              console.log("Navigating to:", app.applicationID);
              navigation.navigate("Application", {
                applicationID: app.applicationID,
              });
            }} //  navigation.navigate("Application", {
          >
            {/* Icon + Job Info */}
            <View style={styles.row}>
              <MaterialIcons
                name="work-outline"
                size={36}
                color="#94b4c4"
                style={{ marginRight: 12 }}
              />
              <View>
                <Text style={styles.title}>{app.title}</Text>
                <Text style={styles.company}>{app.companyName}</Text>
              </View>
            </View>

            {/* › Arrow */}
            <MaterialIcons name="chevron-right" size={24} color="#94b4c4" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E7F5F3",
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
});
