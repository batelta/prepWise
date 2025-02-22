import * as React from 'react';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { Linking, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
    marginTop:20
  },
      textInput:{
        width: '80%',
    marginBottom: 15,
    backgroundColor: '#F2F2F2',
    color:'#F2F2F2'
  },
      logo:{
        position:'absolute',
        top:0,
        width:'30%',
        resizeMode:'contain'
      },
      passwordtext:{
        textDecorationLine:'underline',
        color:'#003D5B',
      },
};


export default function SignUp({navigation}) {

  //textinput
  const [Emailtext, setEmailText]=React.useState("");
  const [Passwordtext, setPasswordText]=React.useState("");

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
           
      <Button mode="contained" 
      style={theme.button}
      onPress={()=>navigation.navigate('SignUpJob')}
      >Sign Up as a Wise Job Seeker</Button>
        <Button mode="contained" 
      style={theme.button}>Sign Up as a Mentor</Button>
<View style={{flexDirection:'row',marginTop:30}}>
<Text style={theme.footer}>Already have an account? </Text>
<Text style={theme.passwordtext}
onPress={()=>navigation.navigate('SignIn')}>Sign In</Text>
</View>
      </View>
    </PaperProvider>
  );
}

