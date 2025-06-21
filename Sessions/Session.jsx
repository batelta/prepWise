import { View, Text,Dimensions, ScrollView, Image,Button, TouchableOpacity, Platform, StyleSheet, SafeAreaView, Alert } from "react-native";
import NavBar from "../NavBar";
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { Inter_400Regular,
  Inter_300Light, Inter_700Bold,Inter_100Thin,
  Inter_200ExtraLight } from '@expo-google-fonts/inter';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import GeminiChat from '../GeminiChat';
import { useContext } from 'react';
import { UserContext } from '../UserContext'; 
import { Card ,RadioButton,TextInput,Appbar,Icon } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalRN  from 'react-native-modal';
  const { width } = Dimensions.get('window');
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from "@react-navigation/native";
import CalendarScreen from '../CalendarScreen'
import StarRating from 'react-native-star-rating-widget';
import { FileUp } from 'lucide-react-native'; // optional icon
import FileSelectorModal from "../FilesComps/FileSelectorModal";

export default function Session({ hideNavbar , sessionId, sessionMode, jobseekerID, mentorID, JourneyID }){
    const { Loggeduser } = useContext(UserContext);
    const apiUrlStart ="http://localhost:5062"
console.log("navbar",hideNavbar ,"sessid" ,sessionId,"isnew", sessionMode, jobseekerID, mentorID, JourneyID);
  const navigation = useNavigation();



    // Form state
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [selectedDateTimeForView, setSelectedDateTimeForView] = useState(null);

    const [sessionLink, setSessionLink] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [feedbackText, setFeedbackText] = useState('');
    const [rating, setRating] = useState(0);
    const [existingFeedback, setExistingFeedback] = useState(false); // for button logic

    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
const [fileSelectorVisible, setFileSelectorVisible] = useState(false);

// NEW: Add a state to track the current session being displayed
const [currentSessionId, setCurrentSessionId] = useState(sessionId);

// FIXED: Reset all form states when sessionId changes
useEffect(() => {
    // Only reset if sessionId actually changed
    if (sessionId !== currentSessionId) {
        console.log('Session ID changed from', currentSessionId, 'to', sessionId);
        
        // Reset all form states
        setSelectedDateTime(null);
        setSelectedDateTimeForView(null);
        setSessionLink('');
        setAttachedFiles([]);
        setFeedbackText('');
        setRating(0);
        setExistingFeedback(false);
        setNotes('');
        setIsSubmitting(false);
        setFileSelectorVisible(false);
        
        // Update current session ID
        setCurrentSessionId(sessionId);
    }
}, [sessionId, currentSessionId]);

const handleFileSelect = async (selectedFile) => {
    try {
      let fileId;

      if (selectedFile.file) {
        // קובץ חדש – נעלה אותו עם FormData
        fileId = await uploadSessionFile(selectedFile, true);
      } else if (selectedFile.fileIdFromDB) {
        // קובץ קיים – רק קישור לסשן
        const res = await fetch(
          `${apiUrlStart}/api/Users/UploadSessionFile?sessionId=${sessionId}&saveToFileList=false`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileID: selectedFile.fileIdFromDB,
              fileName: selectedFile.fileName,
              filePath: selectedFile.filePath,
              fileType: "Resume",
              userID: Loggeduser.id,
            }),
          }
        );

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Link failed");

        fileId = result.fileID;
      }

      // הוספה לרשימה המוצגת
      setAttachedFiles((prev) => [
        ...prev,
        {
          fileID: fileId,
          fileName: selectedFile.fileName || selectedFile.name,
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to attach file.");
    } finally {
      setFileSelectorVisible(false);
    }
  };

  const uploadSessionFile = async (file, saveToProfile = true) => {
    try {
      const formData = new FormData();

      // 🧠 טיפול ב־Web לעומת Mobile
      if (Platform.OS === "web") {
        formData.append("file", file.file, file.name);
      } else {
        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
        });
      }

      // מוסיפים פרטים לשאילתה
      const uploadUrl = `${apiUrlStart}/api/Users/upload-file?userId=${Loggeduser.id}&sessionId=${sessionId}&saveToFileList=${saveToProfile}`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const resultText = await response.text();
      if (!response.ok) throw new Error(resultText);

      const result = JSON.parse(resultText);
      return result.fileId;
    } catch (err) {
      console.error("uploadSessionFile error:", err);
      throw err;
    }
  };

    // FIXED: Separate useEffect for fetching data after sessionId and states are reset
    useEffect(() => {
        if (sessionMode==="edit" && sessionId && sessionId === currentSessionId) {
            console.log('Fetching data for session:', sessionId);
            fetchSessionDetails();
            fetchFeedbackDetails();
        }
    }, [sessionId, sessionMode, currentSessionId]);
    
    const [userType, setUserType] = useState('');

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light
      });
    
    // This runs only once when Loggeduser is first set
useEffect(() => {
    if (Loggeduser?.id) {
      loginAsUser(Loggeduser.email, Loggeduser.password);
    }
  }, [Loggeduser?.id]);

  const loginAsUser=async (email,password )=>{
    console.log(email,password,Loggeduser.password)

    try{
      console.log("Sending request to API...");
  const API_URL = `${apiUrlStart}/api/Users/SearchUser` 
      const response =await fetch (API_URL, { 
        method: 'POST', // Specify that this is a POST request
        headers: {
          'Content-Type': 'application/json' // Indicate that you're sending JSON data
        },
        body: JSON.stringify({ // Convert the user data into a JSON string
            UserId: 0,
            FirstName: "String",
            LastName: "String",
            Email: email,
            Password: password,
            CareerField: ["String"], // Convert to an array
            Roles: ["String"], // Convert to an array
            Company: ["String"], // Convert to an array
            Experience: "String",
            Picture: "String",
            Language: ["String"], // Convert to an array
            FacebookLink: "String",
            LinkedInLink: "String",
            IsMentor:false
        })
      });

      console.log("response ok?", response.ok);

      if(response.ok)
       {
        console.log('user found ')
        
          // Convert response JSON to an object
        const userData = await response.json();
        console.log(userData)
        console.log('IsMentor value:', userData?.isMentor);

        const type = userData?.isMentor ? 'mentor' : 'jobSeeker';
        setUserType(type)
        console.log('user type:',type )
       }
  
  if(!response.ok){
    throw new Error('failed to find user')
  }
    }catch(error){
  console.log(error)
    }
}     

//fetch existing feedback details for edit mode
const fetchFeedbackDetails = async () => {
  try {
    const response = await fetch(`${apiUrlStart}/api/Session/feedback/${sessionId}`);
    if (response.ok) {
      const data = await response.json();
      setFeedbackText(data.comment);
      setRating(data.rating);
      setExistingFeedback(true); // mark as update mode
    } else {
      console.log("No feedback found.");
    }
  } catch (err) {
    console.error("Error fetching feedback:", err);
  }
};
//add feedback 

const handleAddFeedback = async (sessionId, submittedBy, rating, comment) => {
    try {
        const response = await fetch(`${apiUrlStart}/api/Session/feedback?sessionId=${sessionId}&submittedBy=${submittedBy}&rating=${rating}&comment=${encodeURIComponent(comment)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Feedback submitted successfully:", result.message);
            return true;
        } else {
            const errorData = await response.json();
            console.error("Error submitting feedback:", errorData);
            return false;
        }
    } catch (err) {
        console.error("Error submitting feedback:", err);
        return false;
    }
};

 // Fetch existing session details for edit mode
  const fetchSessionDetails = async () => {
    try {
      const response = await fetch(`${apiUrlStart}/api/Session/${sessionId}`);
      if (response.ok) {
        const sessionData = await response.json();
        // Populate form fields with existing data
        const formattedDate = new Date(sessionData.scheduledAt).toLocaleString('en-US', {
  year: 'numeric',
  month: 'long', // "June"
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true, // to get AM/PM
});

setSelectedDateTimeForView(formattedDate);

        setSelectedDateTime(sessionData.scheduledAt);
        setSessionLink(sessionData.meetingUrl || '');
        setNotes(sessionData.notes || '');
        setAttachedFiles(sessionData.files || []);
        console.log('session data:',sessionData,sessionLink,selectedDateTime)

      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      Alert.alert('Error', 'Failed to load session details');
    }
  };

  // Handle form submission
 // Fixed handleSubmit function - focus only on session data
const handleSubmit = async () => {
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  
  try {
    // Basic validation
    if (!selectedDateTime) {
      Alert.alert('Missing Information', 'Please select a date and time for the session');
      setIsSubmitting(false);
      return;
    }

    // Prepare session data - simplified and consistent
    let sessionData = {
      sessionID: sessionId, // Make sure this matches your API expectation
      JourneyID: JourneyID,
      scheduledAt: selectedDateTime, // Ensure this is ISO string format
      meetingUrl: sessionLink || null,
      status: 'scheduled',
      notes: notes || null
    };

    let response;
    let successMessage;

    switch (sessionMode) {
      case 'new':
        // Create new session with mentor-jobseeker relationship
        console.log("Creating new session:", sessionData);
        response = await fetch(`${apiUrlStart}/api/Session/userAddSessions/${jobseekerID}/${mentorID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sessionData)
        });
        successMessage = 'Session created successfully!';
        break;

      case 'add':
        // Add new session to existing relationship
        console.log("Adding session to existing relationship:", sessionData);
        response = await fetch(`${apiUrlStart}/api/Session/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sessionData)
        });
        successMessage = 'New session added successfully!';
        break;

      case 'edit':
        // Update existing session
        console.log("Updating existing session:", sessionData);
        response = await fetch(`${apiUrlStart}/api/Session/update/${sessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sessionData)
        });
        successMessage = 'Session updated successfully!';
        break;

      default:
        throw new Error('Invalid session mode');
    }

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      const result = await response.text(); // Get response as text first
      console.log('Success response:', result);
      
      Alert.alert(
        'Success', 
        successMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      // Get error details
      const errorText = await response.text();
      console.log('Error response:', errorText);
      console.log('Request data sent:', sessionData);
      
      throw new Error(errorText || `HTTP ${response.status}: Failed to process session`);
    }

  } catch (error) {
    console.error('Error submitting session:', error);
    console.error('Error details:', error.message);
    
    Alert.alert(
      'Error', 
      `Failed to submit session: ${error.message}`
    );
  } finally {
    setIsSubmitting(false);
  }
};

// Also fix the date handling in handleMeetingSaved
const handleMeetingSaved = (meetingDetails) => {
  console.log('Meeting set to:', meetingDetails);
  
  // Create proper ISO date string
  const dateObj = new Date(`${meetingDetails.date}T${String(meetingDetails.time.hours).padStart(2, '0')}:${String(meetingDetails.time.minutes).padStart(2, '0')}:00`);
  
  // Make sure it's a valid date
  if (isNaN(dateObj.getTime())) {
    Alert.alert('Error', 'Invalid date selected');
    return;
  }
  
  const isoString = dateObj.toISOString();
  setSelectedDateTime(isoString);
  console.log('Selected DateTime set to:', isoString);
};


  const [showChat, setShowChat] = useState(false);
    const appliedStyles = Platform.OS === 'web' ? Webstyles : styles;
    const LogoImage = () => {
        if (Platform.OS === "android") {
            return <Image source={require('../assets/prepWise Logo.png')} style={appliedStyles.logo} />;
        }
    };

 // Get button text based on session mode
    const getSubmitButtonText = () => {
      switch (sessionMode) {
        case 'new':
          return 'CREATE SESSION';
        case 'add':
          return 'ADD SESSION';
        case 'edit':
          return 'UPDATE SESSION';
        default:
          return 'SUBMIT';
      }
    };

     
  return(<>
<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
<ScrollView
    contentContainerStyle={{ paddingBottom: 60 }}
    style={{ flex: 1 }}
  >

                {/** logo component is here only for mobile*/}
                <LogoImage />
  
                <View style={appliedStyles.Topview}>
              
        <Card style={appliedStyles.screenCard}>
        <Text style={appliedStyles.title}>Your Session Space</Text>
          <Card.Title 
            title={<Text style={appliedStyles.subtitle}>Schedule, share, prep, reflect —all in one place. </Text>}
           />
          <Card.Title 
            title={<Text style={appliedStyles.subtitle}> Come back anytime to update! </Text>}
           />

             <Text style={appliedStyles.subtitle}>Date&Time 🗓️</Text>
             <Text style={appliedStyles.subtitlesmall}>Pick a time that works for you. We’ll send reminders and let your mentor know too!</Text>
                         <CalendarScreen onMeetingSaved={handleMeetingSaved} />

               <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.subtitle}>Link 🔗</Text>
<Text style={appliedStyles.subtitlesmall}>Got the link already? Drop it here. If not — you can come back and add it anytime.</Text>

<TextInput 
                    style={appliedStyles.halfInput} 
                    placeholder="Paste your Zoom, Meet, or Teams link here"
                    placeholderTextColor="#888"
                     value={sessionLink}
                     onChangeText={setSessionLink}
                    contentStyle={{backgroundColor:"#FFF"
                    }}
                    mode="outlined"
                     />
</View>            
{/**FILES SECTION */}
      <Text style={appliedStyles.subtitle}>Attach Files 📂</Text>
      <Text style={appliedStyles.subtitlesmall}>Want to share a resume, portfolio, or notes before the session? Upload here — you can always add more later.</Text>


      <Card style={{ padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', borderRadius: 12 }}>
   
<View style={{ alignSelf: 'center' }}>
  <FileUp size={32} color="#BFB4FF" />
</View>
      <Text style={{ marginTop: 10, color: '#555', fontWeight: '600',textAlign: 'center' }}>Upload a file</Text>
      <Text style={{ fontSize: 12, color: '#999',textAlign: 'center' }}>(PDF, Image, or Docs — optional)</Text>
<TouchableOpacity
                  style={appliedStyles.loginButton}
                  onPress={() => setFileSelectorVisible(true)}
                >
                 <Text style={appliedStyles.loginText}> Choose File </Text>
                </TouchableOpacity>

                {Loggeduser?.id && (
                  <FileSelectorModal
                    visible={fileSelectorVisible}
                    onClose={() => setFileSelectorVisible(false)}
                    userId={Loggeduser.id}
                    onFileSelect={handleFileSelect}
                  />
                )}    </Card>






{/** */}

{/**FEEDBACK SECTION */}
<Text style={appliedStyles.subtitle}>Give Feedback 📃</Text>
      <Text style={appliedStyles.subtitlesmall}>How was the session? </Text>
 
       <Card style={{ padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', borderRadius: 12 }}>

<Text style={appliedStyles.subtitlesmall}>Anything you'd like to share?</Text>

<TextInput 
                    style={appliedStyles.halfInput} 
                    placeholder="The session was really helpful because..."
                    placeholderTextColor="#888"
                     value={feedbackText}
                     onChangeText={setFeedbackText}
                    contentStyle={{backgroundColor:"#FFF"
                    }}
                    mode="outlined"
                     />

<Text style={appliedStyles.subtitlesmall}>Slide through the stars to rate(
        1 – Needs work,
        2 – Okay,
        3 – Good,
        4 – Great,
        5 – Excellent! )</Text>

      <StarRating
        rating={rating}
        onChange={setRating}
      />
    <TouchableOpacity onPress={()=>handleAddFeedback(sessionId,Loggeduser.id,rating,feedbackText)} style={appliedStyles.loginButton}>
  <Text style={appliedStyles.loginText}>
    {existingFeedback ? 'Update Feedback' : 'Add Feedback'}
  </Text>
</TouchableOpacity>

</Card>

           <View style={appliedStyles.inputBlock}>
<Text style={appliedStyles.subtitle}>Notes 📝</Text>
<Text style={appliedStyles.subtitlesmall}>Here you can add your notes , if you have any.</Text>

<TextInput 
                    style={appliedStyles.halfInput} 
                    placeholder="Notes"
                    placeholderTextColor="#888"
                    value={notes}
                    onChangeText={setNotes}
                    contentStyle={{backgroundColor:"#FFF"
                    }}
                    mode="outlined"
                     />
</View>   

<Text style={appliedStyles.subtitlesmall}>This is your space to reflect or shout out something awesome. Your feedback helps us and your mentor grow — but no pressure, you can always come back later.😊</Text>



{/** */}
          <Card.Content>



        


 <TouchableOpacity   
        style={[
          appliedStyles.loginButton,
          isSubmitting && { backgroundColor: '#ccc' }
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
      <Text style={appliedStyles.loginText}>
        {isSubmitting ? 'SUBMITTING...' : getSubmitButtonText()}
      </Text>
        </TouchableOpacity>

          </Card.Content>
        </Card>

        </View>



                       {/* Bot Icon */}
                       {!hideNavbar &&<TouchableOpacity
  style={appliedStyles.chatIcon}
  onPress={() => setShowChat(!showChat)}
>
<FontAwesome6 name="robot" size={24} color="#9FF9D5" />
</TouchableOpacity>}
{!hideNavbar && <NavBar/>}
{console.log('hideNavbar:', hideNavbar)}
{console.log('showChat:', showChat)}
{ showChat && (
    <View style={appliedStyles.overlay}>
  <View style={appliedStyles.chatModal}>

  <TouchableOpacity onPress={() => setShowChat(false)} style={{ alignSelf: 'flex-end', padding: 5 }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>✖</Text>
</TouchableOpacity>
{!hideNavbar && <GeminiChat />}
    </View>

  </View>
)}  

</ScrollView>
</SafeAreaView>
</>
  );

}

const styles = StyleSheet.create({
  
    title: {
      fontSize: 20,
      marginTop: 8,
      fontFamily:"Inter_300Light"
    },
    subtitle:{
      fontSize: 15,
      //  marginTop: 8,
        fontFamily:"Inter_300Light",

  },
subtitlesmall:{
  fontSize: 13,
  //  marginTop: 8,
    fontFamily:"Inter_300Light",

},
    inputBlock: {
        width: '50%', 
      },
      inputTitle: {
        fontSize: 13,
        marginTop: 8,
        fontFamily:"Inter_300Light"

      },
      halfInput: {
        width: '150%',
        height:40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor:'#fff',
        borderRadius: 5,
        fontFamily:'Inter_200ExtraLight',
        fontSize:13,
        marginBottom: 8, 
      },
      descriptionCard:{
        width:'100%',
        marginTop: 16,
           elevation:1,
          shadowColor:'#E4E0E1'
      },
   
    chatIcon:{
        position: "absolute",
        bottom: 65,
        right: 45,
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 12,
        zIndex: 999, // ערך גבוה יותר כדי להבטיח שיופיע מעל כל אלמנט אחר
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // הגדלנו את אטימות הצל
        shadowRadius: 5,
        elevation: 8, 
        borderWidth: 1,
        borderColor: "rgba(159, 249, 213, 0.3)", // מסגרת בצבע דומה לאייקון
        marginBottom: 12,
      },
    chatModal:{
        position: 'absolute',
        bottom: 0,
        right: 10,
        width: '90%',
        height: 500,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    overlay: {
        position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",alignItems: "center",zIndex: 9999,
      },
      loginButton: {
        backgroundColor: '#BFB4FF',
        padding: 12,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
      },
      loginText: {
        color: 'white',
        fontFamily: 'Inter_400Regular',
      },
      screenCard:{
         margin: 20,
          padding: 16 ,
          width:'110%',
          alignSelf:'center',
          elevation:2,
          shadowColor:'#E4E0E1',
      },
      Topview:{
         paddingHorizontal: 20, 
         paddingTop:20,
         paddingBottom:40
      },
      Dropcontainer: {
        width: '100%',
      },
      dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom:15

      },
      placeholderStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      selectedTextStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      itemTextStyle: {
        fontFamily: 'Inter_200ExtraLight',
        fontSize: 13,
        color: '#888',
      },
   
});
const Webstyles = StyleSheet.create({
   
    screenCard:{
      margin: 20,
       padding: 16 ,
      paddingBottom:60

   },
    title: {
        fontSize: 20,
        marginTop: 8,
        fontFamily:"Inter_300Light"

    },
    subtitle:{
        fontSize: 15,
          margin: 8,
          fontFamily:"Inter_300Light",
  
    },
  subtitlesmall:{
    fontSize: 13,
      margin: 8,
      fontFamily:"Inter_300Light",
  
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
        elevation: 8, 
        borderWidth: 1,
        borderColor: "rgba(159, 249, 213, 0.3)", // מסגרת בצבע דומה לאייקון
        marginBottom: 12,
      },
      inputBlock: {
        width: '50%', 
      },
      inputTitle: {
        fontSize: 13,
        marginTop: 8,
        fontFamily:"Inter_300Light"
      },
      halfInput: {
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor:'#fff',
        borderRadius: 5,
        fontFamily:'Inter_200ExtraLight',
        fontSize:13,
        height:35
      },
      descriptionCard:{
        width:'100%',
        marginTop: 16,
      },
      descriptionCardcontent:{
        alignItems: 'center', // Centers items inside Card.Content
       // justifyContent: 'center',
        padding:0,
      },
      
      chatModal:{
          position: 'absolute',
          bottom: 0,
          right: 10,
          width: '30%',
          height: 480,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
      },
      overlay: {
        position: "absolute",top: 0,left: 0,right: 0,bottom: 0,backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",alignItems: "center",zIndex: 9999,
      },
      loginButton: {
        backgroundColor: '#BFB4FF',
        padding: 12,
        borderRadius: 5,
        width: '70%',
        alignItems: 'center',
        alignSelf:'center',
        marginTop:15
      },
      loginText: {
        color: 'white',
        fontFamily:'Inter_400Regular',
    
      },
      Topview:{
        paddingHorizontal: 20, 
        paddingTop: 100 
     },
     Dropcontainer: {
        width: '100%',
      },
      dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
      },
      placeholderStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      selectedTextStyle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'Inter_200ExtraLight',
      },
      itemTextStyle: {
        fontFamily: 'Inter_200ExtraLight',
        fontSize: 13,
        color: '#888',
      },
       
});
