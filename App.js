/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import firebase from "firebase"
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

export default class App extends Component{
    componentWillMount(){
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyBgJwzGMxd_vjDyK8ERw76iVcFNv_c4cug",
            authDomain: "testing-56b3a.firebaseapp.com",
            databaseURL: "https://testing-56b3a.firebaseio.com",
            projectId: "testing-56b3a",
            storageBucket: "testing-56b3a.appspot.com",
            messagingSenderId: "395799782093"
        };
        firebase.initializeApp(config);
    }
    onPress = async () => {
        GoogleSignin.configure({
            iosClientId: "395799782093-32k7ocgs3im3e0d7d235sj625jmgu55h.apps.googleusercontent.com",
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
            accountName: '', // [Android] specifies an account name on the device that should be used
        });
        
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
        } catch (error) {
            console.log(error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Este es un ejemplo de envio de datos a Cloud firestore y Notifiaciones push!</Text>
                <Text style={styles.instructions}>1.- Se hace un login con Gmail, Facebook o Twitter</Text>
                <Text style={styles.instructions}>2.- Al recibir el login se guarda los datos en Firestore</Text>
                <Text style={styles.instructions}>3.- Si estas logeado recibes una notifiación de que alguien inicio sesión</Text>
                <TouchableOpacity style={styles.button} onPress={this.onPress} >
                    <Text> Iniciar con Gmail </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
