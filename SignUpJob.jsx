import * as React from 'react';
import { List,TextInput,Button, Provider as PaperProvider } from 'react-native-paper';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
// Define your custom theme
const theme = {
  colors: {
    primary: '#BFB4FF', // Button color
    accent: '#9FF9D5',  // Highlight color
    background: '#FDFCF5', // Light cream background
    text: '#003D5B',    // Text color
  },
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
    backgroundColor: '#F2F2F2',
    color:'#F2F2F2'
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
};


export default function SignUpJob({navigation}) {

  //textinput
  const [Nametext, setNameText]=React.useState("");
  const [Emailtext, setEmailText]=React.useState("");
  const [Passwordtext, setPasswordText]=React.useState("");
 ///drop down list state
 const [expanded,setExpanded]=React.useState(true);
// Function to toggle the dropdown visibility
 const handleListPress=()=>setExpanded(!expanded)

 //image set
 ///picking image fron phone

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, justifyContent: 'center',
         alignItems: 'center', 
         borderStyle:'solid',
         backgroundColor: theme.colors.background ,
         position:'relative'}}>
      <Image source={require('./assets/prepWise Logo.png')}
      style={theme.logo}/>
        <Text style={theme.SecHeadline}>Sign Up</Text>
 <TouchableOpacity>
 <Button icon={{source:"camera-plus-outline",direction:"rtl"}}
mode="contained"
style={{ marginTop: 20, paddingVertical: 10 }}></Button>
</TouchableOpacity> 
    <TextInput 
      label={"Enter Full Name"}
      value={Nametext}
      onChangeText={Nametext=>setNameText(Nametext)}
      style={theme.textInput}
      mode="outlined"
      theme={{roundness:20}}
/>
 
  <TextInput 
      label={"Enter Email Address"}
      value={Emailtext}
      onChangeText={Emailtext=>setEmailText(Emailtext)}
      style={theme.textInput}
      mode="outlined"
      theme={{roundness:20}}
/>

<TextInput 
      label={"Enter Password"}
      value={Passwordtext}
      onChangeText={Passwordtext=>setPasswordText(Passwordtext)}
      style={theme.textInput}
      mode="outlined"
      theme={{roundness:20}}
       secureTextEntry
     right={<TextInput.Icon icon="eye"/>}
      />
{/*drop down*/}
<View style={{width:'80%'}}>
<TextInput
    label={'Select A Field'}
    value={expanded?'Field selected':''}
    editable={false}
    style={theme.textInput}
    mode='outlined'
    theme={{roundness:20}}
onPress={handleListPress}
/>
{expanded&&(
        <List.Section>
        <List.Accordion title="options" expanded={expanded}
        onPress={handleListPress}>
            <List.Item
            title="option1"
            onPress={()=>setExpanded(false)}/>
        </List.Accordion>
        </List.Section>
    )}
</View>





      <Button mode="contained" 
      style={theme.button}>Sign Up</Button>
<View style={{flexDirection:'row',marginTop:30}}>
    <Text style={theme.footer}>Already have an account? </Text>
    <Text style={theme.passwordtext}
    onPress={()=>navigation.navigate('SignIn')}>Sign In</Text>
</View>
      </View>
    </PaperProvider>
  );
}

