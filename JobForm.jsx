import React, { useState } from "react";
import { TextInput, Button, View, Text, ActivityIndicator } from "react-native";

const JobForm = () => {
  const [jobLink, setJobLink] = useState("https://www.global-e.com/careers/af-15b/");
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "AIzaSyChUXRg1ZyJOG1mxzqVuhnZE3vN89V3YSY"; // שמירת המפתח בצורה בטוחה

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // First, get the raw HTML from our backend
      const response = await fetch("http://localhost:5000/fetch-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobLink }),
      });
  
      const data = await response.json();
      if (!data.html) throw new Error("No job data found");
  
      // Now send the HTML to Gemini for processing
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`,      
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: `Extract job title, description, and company from the following HTML:\n\n${data.html}` }
                ]
              }
            ]
          }),
          
          
        }
      );
  
      const geminiData = await geminiResponse.json();
      const extractedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No data available";
  
      setJobData(extractedText);
    } catch (error) {
      setError(error.message);
    }
  
    setLoading(false);
  };
  

  return (
    <View>
      <TextInput
        placeholder="הכנס לינק למשרה"
        value={jobLink}
        onChangeText={setJobLink}
      />
      <Button title="הבא פרטי משרה" onPress={fetchJobDetails} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      {jobData && <Text>{jobData}</Text>}
    </View>
  );
};

export default JobForm;
