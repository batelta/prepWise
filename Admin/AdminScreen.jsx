import React from "react";
import { View, Text, StyleSheet, Button, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const apiUrlStart ="http://localhost:5062"


const AdminScreen = () => {
  const API_URL =
    Platform.OS === "web"
      ? `${apiUrlStart}/api/MentorMatching/export-feature-data`
      : `${apiUrlStart}/api/MentorMatching/export-feature-data`;

  const handleDownload = async () => {
    if (Platform.OS === "web") {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `features_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert("הקובץ ירד בהצלחה ✅");
      } catch (error) {
        console.error(error);
        alert("ההורדה נכשלה ❌");
      }
      return;
    }

    // למובייל
    try {
      const fileUri =
        FileSystem.documentDirectory + `features_${Date.now()}.csv`;

      const downloadRes = await FileSystem.downloadAsync(API_URL, fileUri);

      Alert.alert("הצלחה", "הקובץ ירד בהצלחה ✅");

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        Alert.alert("הערה", "שיתוף לא זמין על המכשיר הזה");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("שגיאה", "ההורדה נכשלה ❌");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎛️ Admin Dashboard</Text>
      <View style={styles.buttonContainer}>
        <Button title="📥Download Feature table" onPress={handleDownload} />
      </View>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
  },
});