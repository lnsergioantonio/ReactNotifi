/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, List, ListItem, Thumbnail } from 'native-base';
import * as firebase from 'firebase'
import 'firebase/firestore';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

var unsubscribe
export default class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            id:"",
            isLoginScreenPresented:false,
            dataSource:[]
        }
    }
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
        firebase.firestore().settings({	timestampsInSnapshots: true})
        GoogleSignin.configure({
            iosClientId: "395799782093-32k7ocgs3im3e0d7d235sj625jmgu55h.apps.googleusercontent.com",
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
            accountName: '', // [Android] specifies an account name on the device that should be used
            //scopes:['https://www.googleapis.com/auth/plus.me']
        });
        
    }
    async componentDidMount(){
        const isSignedIn = await GoogleSignin.isSignedIn();        
        this.setState({ isLoginScreenPresented: isSignedIn });
        this.observerUsers()
    }
    async signIn(){
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const userInfo = response.user
            // Build Firebase credential with the Google ID token.
            var credential = await  firebase.auth.GoogleAuthProvider.credential(response.idToken, response.accessToken);
            // Sign in with credential from the Google user.
            var dataUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
            console.log(dataUser);
            
            this.setState({isLoginScreenPresented: true, id:dataUser.user.uid})
            this.observerUsers()
            
            // Add a new document in collection "users"
            firebase.firestore().collection("users").doc(dataUser.user.uid).set({
                email:userInfo.email,
                familyName:userInfo.familyName,
                givenName:userInfo.givenName,
                id:dataUser.user.uid,
                name:userInfo.name,
                photo:userInfo.photo
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        } catch (error) {
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
    async signOut(){
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await firebase.firestore().collection("users").doc(this.state.id).delete()            
            await firebase.auth().signOut();
            unsubscribe()
            this.setState({isLoginScreenPresented:false,dataSource:[]})
        } catch (error) {
            console.error(error);
        }
    };
    observerUsers(){
        const context = this
        if(this.state.isLoginScreenPresented)
            unsubscribe = firebase.firestore().collection("users")
                .onSnapshot(function(querySnapshot) {
                    const users = []
                    querySnapshot.forEach(function(doc) {
                        users.push({
                            email:doc.data().email,
                            familyName:doc.data().familyName,
                            givenName:doc.data().givenName,
                            id:doc.data().id,
                            name:doc.data().name,
                            photo:doc.data().photo})
                    });
                    context.setState({dataSource:users})
                });
    }
    render() {
        
        return (
            <Container>
                <Header>
                <Left>
                    <Button transparent>
                    <Icon name='menu' />
                    </Button>
                </Left>
                <Body>
                    <Title>Header</Title>
                </Body>
                <Right />
                </Header>
                <Content>
                    <Text style={styles.welcome}>Este es un ejemplo de envio de datos a Cloud firestore y Notifiaciones push!</Text>
                    <Text style={styles.instructions}>1.- Se hace un login con Gmail, Facebook o Twitter</Text>
                    <Text style={styles.instructions}>2.- Al recibir el login se guarda los datos en Firestore</Text>
                    <Text style={styles.instructions}>3.- Si estas logeado recibes una notifiación de que alguien inicio sesión</Text>
                    {
                        !this.state.isLoginScreenPresented ?
                            <Button onPress={this.signIn.bind(this)} light><Text>Iniciar con Gmail </Text></Button>
                        :
                            <Button onPress={this.signOut.bind(this)} light><Text>Salir</Text></Button>
                    }
                    {
                        this.state.dataSource.length > 0 &&
                            <List
                                dataArray={this.state.dataSource}
                                renderRow={(item) => {
                                    return(
                                        <ListItem avatar>
                                            <Left>
                                                <Thumbnail small source={{ uri: item.photo }} />
                                            </Left>
                                            <Body>
                                                <Text>{item.name}</Text>
                                                <Text note>{item.email}</Text>
                                            </Body>
                                            <Right>
                                                <Text note></Text>
                                            </Right>
                                        </ListItem>
                                    )
                                }}
                                />
                    }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    }
});
