import { View, Text,ImageEditor ,ScrollView, Image, TouchableOpacity, Platform,StyleSheet, SafeAreaView, Alert } from "react-native";
import { PlusCircle } from "lucide-react-native";
import NavBar from "./NavBar";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { FAB } from "react-native-paper";
import { useEffect, useState } from "react";

const progress = 0; // 75% completed
const handlePress = () => {
    Alert.alert("Button Pressed", "You clicked the plus button!");
};

export default function HomePage() {
    const [profileImage, setProfileImage] = useState(null);
    const [Name, setName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const API_URL = Platform.OS === 'web'  //changed the url for web and phone
  ? "http://localhost:5062/api/Users" 
  : "http://192.168.30.157:5062/api/Users";
    useEffect(() => {
        fetch(`${API_URL}?userId=30`) // Use your actual API URL
        .then(response => {
            console.log("Raw Response:", response);
            return response.text(); // Read as plain text first
        })
        .then(text => {
            console.log("Response Text:", text);
            return text ? JSON.parse(text) : {}; // Convert to JSON only if not empty
        })
        .then(data => {
            console.log("Parsed Data:", data);

            if (data.picture) {
                setProfileImage(`${data.picture}`);
                
            }
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching image:", error);
            setError("לא הצלחנו לטעון את התמונה");
            setLoading(false);
        });
  
}, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <Image source={require('./assets/prepWise Logo.png')} style={styles.logo} />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                {loading ? (
                    <Text>Loading image...</Text>
                ) : error ? (
                    <Text>{error}</Text>
                ) : profileImage ? (
                    <Image source={{ uri: profileImage }} 
                    style={{ height: 100, width: 100 }}
                    resizeMode={"contain"} />
                ) : (
                    <Text>אין תמונה זמינה</Text>
                )}

                    <Text style={styles.title}>Welcome {Name} , to your Home page!</Text>
                    <Text style={styles.subtitle}>What to do next?</Text>
                </View>

          

                {/* To-Do List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your To-Do List</Text>
                    <View style={styles.toDoList}>
                        <View style={styles.toDoItem}>
                            <AnimatedCircularProgress
                                size={50}
                                width={10}
                                fill={progress} // The progress percentage (0 - 100)
                                tintColor="#9FF9D5" // Primary color
                                backgroundColor="#e0e0e0" // Background circle color
                            />
                            <Text style={styles.toDoText}>0/0</Text>
                            <Text style={styles.toDoLabel}>Weekly Wins</Text>
                        </View>
                        <View style={styles.toDoItem}>
                            <AnimatedCircularProgress
                                size={50}
                                width={10}
                                fill={progress} // The progress percentage (0 - 100)
                                tintColor="#9FF9D5" // Primary color
                                backgroundColor="#e0e0e0" // Background circle color
                            />
                            <Text style={styles.toDoText}>0/0</Text>
                            <Text style={styles.toDoLabel}>Personal Goals</Text>
                        </View>
                    </View>
                </View>

                {/* Applications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>All Applications</Text>
                    <Text style={styles.sectionDescription}>
                        You haven’t started yet—let’s add your first application and kick off your adventure! ✨
                    </Text>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                Press
                                <View style={{ padding: '5' }}>
                                    <TouchableOpacity onPress={handlePress}>
                                        <FAB
                                            icon="plus" // React Native Paper uses Material icons
                                            color="#003D5B" // Icon color
                                            style={{
                                                backgroundColor: "#9FF9D5", // Circle fill
                                                width: 25, // Adjust to your preferred size
                                                height: 25,
                                                borderRadius: 35 / 2, // Ensures it's a perfect circle
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                to add {'\n'} your first Job Application
                            </Text>
                        </View>

                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                Press
                                <View style={{ padding: '5' }}>
                                    <TouchableOpacity>
                                        <FAB
                                            icon="plus" // React Native Paper uses Material icons
                                            color="#003D5B" // Icon color
                                            style={{
                                                backgroundColor: "#9FF9D5", // Circle fill
                                                width: 25, // Adjust to your preferred size
                                                height: 25,
                                                borderRadius: 35 / 2, // Ensures it's a perfect circle
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                to Open {'\n'} your first mentor match request
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View>
                <NavBar />
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    logo: {
        position: 'relative',
        width: '15%',
        resizeMode: 'contain',
        height: 100,
    },
    header: {
        alignItems: "center",
        marginTop: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 8,
    },
    subtitle: {
        color: "gray",
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    sectionDescription: {
        color: "gray",
        marginTop: 8,
    },
    toDoList: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    toDoItem: {
        width: "48%",
        backgroundColor: "#f3f4f6",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    toDoText: {
        color: "gray",
    },
    toDoLabel: {
        marginTop: 8,
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#e5e7eb",
        padding: 15,
        borderRadius: 12,
        width: 250,
        marginTop: 16,
    },
    buttonText: {
        fontWeight: "500",
        fontSize: 15,
    },
});