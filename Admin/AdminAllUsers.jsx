import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform,
  Button,
} from "react-native";
import axios from "axios";
import { DataTable } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

const apiUrlStart = "https://localhost:7137";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`${apiUrlStart}/api/users/all`)
      .then((response) => {
        console.log("DATA FROM SERVER:", response.data);
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API ERROR:", error);
        setError("אירעה שגיאה בעת טעינת המשתמשים");
        setLoading(false);
      });
  }, []);

  const handleDeleteUser = (userID) => {
    axios
      .delete(`${apiUrlStart}/api/Mentors/${userID}`)
      .then((response) => {
        console.log("Deleted user:", response.data);
        // עדכון הרשימה לאחר מחיקה
        setUsers(users.filter((user) => user.userID !== userID));
        alert("המשתמש נמחק בהצלחה");
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("אירעה שגיאה בניסיון למחוק את המשתמש");
      });
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={{ color: "red", padding: 16 }}>{error}</Text>;

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "mentor") return user.isMentor;
    if (filter === "jobseeker") return !user.isMentor;
  });

  return (
    <ScrollView style={{ padding: 16, direction: "rtl" }}>
      <View style={{ marginBottom: 16 }}>
        <Picker
          selectedValue={filter}
          onValueChange={(value) => setFilter(value)}
          style={{
            height: 50,
            width: "100%",
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
          }}
        >
          <Picker.Item label="See All" value="all" />
          <Picker.Item label="Mentors" value="mentor" />
          <Picker.Item label="Job Seekers" value="jobseeker" />
        </Picker>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Email</DataTable.Title>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {filteredUsers.map((user, index) => (
          <DataTable.Row key={user.userID || index}>
            <DataTable.Cell>
              {user.isMentor ? "Mentor" : "JobSeeker"}
            </DataTable.Cell>
            <DataTable.Cell>{user.email}</DataTable.Cell>
            <DataTable.Cell>{user.userID}</DataTable.Cell>
            <DataTable.Cell>
              {user.firstName} {user.lastName}
            </DataTable.Cell>
            <DataTable.Cell>
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDeleteUser(user.userID)}
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
};

export default AdminAllUsers;
