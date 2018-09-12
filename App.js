/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, FlatList} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, List, ListItem, Thumbnail } from 'native-base';
import * as firebase from 'firebase'
import 'firebase/firestore';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

export default class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            name:"",
            photo:"",
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
    }
    onPress = async () => {
        GoogleSignin.configure({
            iosClientId: "395799782093-32k7ocgs3im3e0d7d235sj625jmgu55h.apps.googleusercontent.com",
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
            accountName: '', // [Android] specifies an account name on the device that should be used
            //scopes:['https://www.googleapis.com/auth/plus.me']
        });
        
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const userInfo = response.user
            console.log(userInfo);
            this.setState({
                    name:userInfo.name,
                    photo:userInfo.photo,
                    dataSource:[
                        ...this.state.dataSource, {
                            id:userInfo.id,
                            email:userInfo.email,
                            familyName:userInfo.familyName,
                            givenName:userInfo.givenName,
                            id:userInfo.id,
                            name:userInfo.name,
                            photo:userInfo.photo
                        }
                    ]
                 })
            // Add a new document in collection "users"
            firebase.firestore().collection("users").doc(userInfo.id).set({
                email:userInfo.email,
                familyName:userInfo.familyName,
                givenName:userInfo.givenName,
                id:userInfo.id,
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
                    <TouchableOpacity style={styles.button} onPress={this.onPress} >
                        <Text> Iniciar con Gmail </Text>
                    </TouchableOpacity>
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
    container: {
        flex: 1,
        marginTop:20,
        // justifyContent: 'center',
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
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap'
        },
    item: {
        backgroundColor: 'red',
        color:"black",
        height:30,
        margin: 3,
        width: 100
    }
});
