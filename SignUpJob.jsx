import * as React from 'react';
import { List,TextInput,Button, Provider as PaperProvider } from 'react-native-paper';
import { ScrollView,Text, TouchableOpacity, View ,StyleSheet} from 'react-native';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
// Define your custom theme
const theme = {
  colors: {
    primary: '#BFB4FF', // Button color
    accent: '#9FF9D5',  // Highlight color
    background: '#fff', // Light cream background
    text: '#003D5B',    // Text color
    placeholder: '#003D5B', // Placeholder color
    textColor:'#f5f5f5'
},
  roundness: 20 // Global roundness
};
//StyleSheet
const styles=StyleSheet.create({
    headline:{
        fontFamily:'Inter',
        color:'#003D5B',
        fontSize:22,
        fontWeight:'regular',
        marginBottom:40
          },
          SecHeadline:{
            fontFamily:'Inter',
        color:'#003D5B',
        fontSize:18,
        fontWeight:'regular',
        marginBottom:40
          },
          button:
          {width:'80%',
            marginTop:40
          },
              textInput:{
                width: '80%',
            marginBottom: 15,
            backgroundColor: '#F5F5F5',
        },
              logo:{
                position:'absolute',
                top:-100,//weird
                width:'30%',
                resizeMode:'contain'
              },
              passwordtext:{
                textDecorationLine:'underline',
                color:'#003D5B',
              },
})

export default function SignUpJob({navigation}) {

  //textinput
  const [Nametext, setNameText]=React.useState("");
  const [Emailtext, setEmailText]=React.useState("");
  const [Passwordtext, setPasswordText]=React.useState("");
 ///drop down list fields
const [dropdownVisiblefield,setDropdownVisiblefield]=React.useState(false);
const [selectedField,setSelectedField]=React.useState("");
const Fields=["Software Engineering","Data Science","Proudct Management","UI/UX Design"]

//drop down list status
const statuses=["I'm just getting started! (0 years)",
    "I have some experience, but I'm still learning! (1-2 years)",
    "I'm building my career and expanding my skills. (2-4 years)",
    "I am an experienced professional in my field. (5-7 years)",
    "I have extensive experience and lead projects. (8+ years)",
    "I'm a seasoned expert in my area. (10+ years)"
]
const [selectedStatus,setSelectedStatus]=React.useState("");
const [dropdownVisiblestatus,setDropdownVisiblestatus]=React.useState(false);

//image use state
const [image,setImage]=React.useState(null);


// Function to open image picker
const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setImage(result.assets[0].uri); // Set image URI
    }
  };


  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={{ flexGrow:1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center',
         alignItems: 'center', 
         borderStyle:'solid',
         backgroundColor: theme.colors.background ,
         position:'relative'}}>
      <Image source={require('./assets/prepWise Logo.png')}
      style={styles.logo}/>
        <Text style={styles.SecHeadline}>Sign Up</Text>

       {/*picking image fron phone*/} 
       {image ? (
  <View style={{ position: 'relative' }}>
    <Image 
      source={{ uri: image }} 
      style={{
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        marginTop: 20, 
        borderWidth: 2, 
        borderColor: '#BFB4FF' // Add a border to the image for a polished look
      }} 
    />
    <TouchableOpacity 
      onPress={pickImage} 
      style={{
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        backgroundColor: '#F5F5F5', 
        padding: 5, 
        borderRadius: 50
      }}
    >
      <Button 
        icon="camera-plus-outline" 
        mode="contained" 
        style={{ width: 20, height: 20, borderRadius: 50 }} 
      />
    </TouchableOpacity>
  </View>
) : (
  <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
    <Button 
    icon="camera-plus-outline" 
    mode="contained" 
    labelStyle={{ fontSize: 15 }}
    size={10}
      style={{width: 20
        , height: 20, borderRadius: 50 }} 
    />
  </TouchableOpacity>
)}

    <TextInput 
      label={"Enter Full Name"}
      value={Nametext}
      onChangeText={Nametext=>setNameText(Nametext)}
      style={styles.textInput}
      mode="outlined"
      outlineColor='#f5f5f5'
/>
 
  <TextInput 
      label={"Enter Email Address"}
      value={Emailtext}
      onChangeText={Emailtext=>setEmailText(Emailtext)}
      style={styles.textInput}
      mode="outlined"
      outlineColor='#f5f5f5'/>

<TextInput 
      label={"Enter Password"}
      value={Passwordtext}
      onChangeText={Passwordtext=>setPasswordText(Passwordtext)}
      style={styles.textInput}
      mode="outlined"
      outlineColor='#f5f5f5'
       secureTextEntry
     right={<TextInput.Icon icon="eye"/>}
      />
{/*drop down for fields*/}
<View style={{width:'80%',height:90,zIndex:10}}>
    <List.Section>
        <List.Accordion
        title={selectedField || 'Select Your Career Field'}
        expanded={dropdownVisiblefield}
        onPress={() => setDropdownVisiblefield(!dropdownVisiblefield)}
        style={[styles.textInput, { borderRadius: 20 ,width:'100%'}]}
        titleStyle={{ color: theme.colors.text }}
        >
        {Fields.map((field,index)=>(
            <List.Item
            key={index}
            title={field}
            onPress={()=>{
                setSelectedField(field);
                setDropdownVisiblefield(false);
            }}
            />
        ))}
        </List.Accordion>
    </List.Section>
</View>

{/*drop down for status*/}
<View style={{width:'80%',height:90,zIndex:10}}>
    <List.Section>
        <List.Accordion
        title={selectedStatus || 'Whats Your status in your proffesional journey?'}
        expanded={dropdownVisiblestatus}
        onPress={() => setDropdownVisiblestatus(!dropdownVisiblestatus)}
        style={[styles.textInput, { borderRadius: 20 ,width:'100%'}]}
        titleStyle={{ color: theme.colors.text }}
        >
        {statuses.map((status,index)=>(
            <List.Item
            key={index}
            title={status}
            onPress={()=>{
                setSelectedStatus(status);
                setDropdownVisiblestatus(false);
            }}
            />
        ))}
        </List.Accordion>
    </List.Section>
</View>



      <Button mode="contained" 
      style={styles.button}>Sign Up</Button>
<View style={{flexDirection:'row',marginTop:30}}>
    <Text style={styles.footer}>Already have an account? </Text>
    <Text style={styles.passwordtext}
    onPress={()=>navigation.navigate('SignIn')}>Sign In</Text>
</View>
      </View>
      </ScrollView>
    </PaperProvider>
  );
}

