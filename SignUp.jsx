import * as React from 'react';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { Text, View, StyleSheet, TouchableOpacity,Image } from 'react-native';

export default function SignUp({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <View style={styles.avatarContainer}>
       
      <Image source={require('./assets/prepWise Logo.png')} style={styles.avatarContainer} />
         </View>
<View style={styles.buttonsContainer}>
        <Button 
          mode="contained" 
          style={styles.loginButton}
          onPress={() => navigation.navigate('SignUpJobSeeker')}
        >
          Sign Up as a Wise Job Seeker
        </Button>

        <Button mode="contained" style={styles.loginButton}>
          Sign Up as a Mentor
        </Button>

        </View>
  
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#white',
  },
  loginBox: {
    width: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  avatarContainer: {
    width: 90, // Set a fixed width
    height: 90, // Set a fixed height (same as width)
    borderRadius: 45, // Half of width/height to make it round
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode:'contain'
  },

  
  loginButton: {
    backgroundColor: '#BFB4FF',
    padding: 5,
    margin:10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    alignSelf:'center'
  },
  buttonsContainer:{
    justifyContent:'space-evenly'
  }
  
});
