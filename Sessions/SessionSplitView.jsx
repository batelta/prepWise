import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import NavBar from "../NavBar";
import { UserContext } from "../UserContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import GeminiChat from "../GeminiChat";
import Session from "./Session"; // ✅ correct component
import { Card } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";


export default function SessionSplitView() {
    const route = useRoute();
  const { jobseekerID, mentorID, JourneyID ,FirstName,LastName} = route.params;
  const { Loggeduser } = useContext(UserContext);
  const [sessions, setSessions] = useState([]);
const [selectedId, setSelectedId] = useState(null); // or whatever indicates no sessions exist
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const apiUrlStart = "http://localhost:5062";
const [showSessionForm, setShowSessionForm] = useState(false);

  useEffect(() => {
    if (Loggeduser?.id) {
      fetchSessions();
    }
  }, [Loggeduser]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${apiUrlStart}/api/Session/userSessions/${jobseekerID}/${mentorID}`);
      const data = await response.json();
      setSessions(data || []);
      console.log(data)
      if (data.length > 0) setSelectedId(data[0].sessionID);
      else {
        console.log("no sessions yet!")
        setSelectedId("new"); // ⬅️ flag to trigger empty session
      }    } catch (err) {
      console.error("Error fetching sessions", err);
    } finally {
      setLoading(false);
    }
  };

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
        <Text>Loading sessions...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.splitView}>
          <NavBar />

          {/* Left Pane */}
          <View style={styles.leftPane}>
            <Text style={styles.header}>My Sessions</Text>
                       <Text style={styles.title}>{`Your Sessions With ${FirstName}` || "Untitled"}</Text>

            {sessions.map((session) => (
              <TouchableOpacity
                key={session.sessionID}
                style={[
                  styles.card,
                  selectedId === session.sessionID && styles.activeCard,
                ]}
                onPress={() => setSelectedId(session.sessionID)}
              >

                <Card style={{ padding: 12 }}>
                  <Text style={styles.subtitle}>
                     
                    {session.scheduledAt  ? new Date(session.scheduledAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : 'No date set'} 
                  </Text>
                  <Ionicons name="trash-outline" size={24} color="#003D5B"></Ionicons>
                </Card>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
                onPress={() => {
                  //setIsAddingNew(true);
                 // setSelectedId(null);
                }}
                style={styles.addButton}
              >
                <MaterialIcons
                  name="add-circle-outline"
                  size={24}
                  color="#b9a7f2"
                />
                <Text style={styles.addButtonText}>Add New Session</Text>
              </TouchableOpacity>
          </View>
  
          {/* Right Pane */}
          <View style={styles.rightPane}>
       {!showSessionForm && selectedId === "new" ? (
  <View style={{ padding: 20 }}>
    <Text style={styles.subtitle}>
      You haven't had any sessions with this mentor yet.
    </Text>
    <TouchableOpacity
      style={styles.scheduleButton}
      onPress={() => {
        console.log("Button pressed, showing session form");
        setShowSessionForm(true);
      }}
    >
      <Text style={styles.buttonText}>Schedule your first session</Text>
    </TouchableOpacity>
  </View>
) : showSessionForm || selectedId === "new" ? (
  <Session
    hideNavbar={true}
    sessionMode="new"  
    jobseekerID={jobseekerID}
    mentorID={mentorID}
    JourneyID={JourneyID}
  />
) : (
  <Session
    hideNavbar={true}
    sessionId={selectedId}
    sessionMode="edit"
    jobseekerID={jobseekerID}
    mentorID={mentorID}
    JourneyID={JourneyID}
  />
)}

          </View>
        </View>
      </ScrollView>

      {/* Chat */}
      <TouchableOpacity style={styles.chatIcon} onPress={() => setShowChat(!showChat)}>
        <FontAwesome6 name="robot" size={24} color="#9FF9D5" />
      </TouchableOpacity>

      {showChat && (
        <View style={styles.overlay}>
          <View style={styles.chatModal}>
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
  container: {
    flex: 1,
  },
  splitView: {
    flexDirection: "row",
  },
  leftPane: {
    width: "30%",
    backgroundColor: "#F4F4F4",
    padding: 15,
    marginTop: 20,
  },
  rightPane: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "68%",
    margin: 10,
    marginTop: 80,
    overflow: "auto",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#163349",
  },
  card: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
  activeCard: {
    backgroundColor: "#DCEFFF",
  },
  title: {
    fontSize: 20,
    marginTop: 8,
    fontFamily:"Inter_300Light",
  },
  subtitle: {
    fontSize: 15,
    //  marginTop: 8,
      fontFamily:"Inter_300Light",
      textAlign:'center'

  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatIcon: {
    position: "absolute",
    bottom: 5,
    right: 45,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "rgba(159, 249, 213, 0.3)",
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  chatModal: {
    position: "absolute",
    bottom: 80,
    right: 10,
    width: "40%",
    height: 500,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  buttonText:{
    fontSize: 13,
    //  marginTop: 8,
      fontFamily:"Inter_300Light",
      color:'#fff'
  },
  scheduleButton: {
    marginTop: 10,
    backgroundColor: "#BFB4FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
});
