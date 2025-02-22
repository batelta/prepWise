import * as React from 'react';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { Linking, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
        top:0,
        width:'30%',
        resizeMode:'contain'
      },
      passwordtext:{
        textDecorationLine:'underline',
        color:'#003D5B',
      },
};


export default function SignIn({navigation}) {

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
        <Text style={theme.headline}>Welcome to Prepwise!</Text>
        <Text style={theme.SecHeadline}>Sign in</Text>
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
      <View style={{alignItems:'flex-end',width:'80%'}}>
     <Text style={theme.passwordtext}
     //change the link below
     onPress={()=>Linking.openURL('https://google.com')}>
      Forgot Password?</Text>
      </View>

      <Button mode="contained" 
      style={theme.button}>Sign in</Button>
<View style={{flexDirection:'row',marginTop:30}}>
<Text style={theme.footer}>Don't have an account? </Text>
<Text style={theme.passwordtext}
onPress={()=> navigation.navigate('SignUp')}>Create Account</Text>
</View>
      </View>
    </PaperProvider>
  );
}

