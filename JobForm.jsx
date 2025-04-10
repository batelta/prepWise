import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";


const JobForm = () => {
  const [jobLink, setJobLink] = useState(
    "https://www.global-e.com/careers/af-15b/"
  );
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "AIzaSyChUXRg1ZyJOG1mxzqVuhnZE3vN89V3YSY"; // ⚠️ לא בטוח להשאיר כך בפרודקשן

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    setJobData(null);

    try {
      const response = await fetch(
        "https://localhost:7137/api/Application/fetch-job",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ URL: jobLink }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`שגיאה מהשרת: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Application from server:", data);

      setJobData(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput
        placeholder="הכנס לינק למשרה"
        value={jobLink}
        onChangeText={setJobLink}
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
        }}
      />
      <Button title="הבא פרטי משרה" onPress={fetchJobDetails} />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      )}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

      {jobData && (
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontWeight: "bold" }}>📌 Company Name:</Text>
          <Text>{jobData.CompanyName}</Text>

          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            🧑‍💻 Job Title:
          </Text>
          <Text>{jobData.JobTitle}</Text>

          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            🏢 Company Summary:
          </Text>
          <Text>{jobData.CompanySummary}</Text>

          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            📝 Job Description:
          </Text>
          <Text>{jobData.JobDescription}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default JobForm;
