import React, {useContext, useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity, AsyncStorage, Dimensions, ActivityIndicator } from 'react-native';
import PersonForm from '../components/PersonForm';
import { Text, Avatar, Button } from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';
import {Context as PeopleContext} from '../context/PeopleContext';
import {Context as CategoryContext} from '../context/CategoryContext';
import {Context as MeetingsContext} from '../context/MeetingsContext';
import { LinearGradient } from 'expo-linear-gradient';

const EditPersonProfileScreen = ({navigation}) =>  {
    const {peopleState, updatePerson, deletePerson} = useContext(PeopleContext);
    // const {meetingState, updateMeetingsAfterPersonDelete} = useContext(MeetingsContext);
    const {categoryState, viewCategories} = useContext(CategoryContext);

    const _id = navigation.getParam('_id');

    const person = peopleState.find(p => p._id === _id);
    
    return (
        <View>
            <NavigationEvents onWillFocus={viewCategories}/>
            <LinearGradient
                colors={['#39abf7', '#4eb2f5', '#bde3fc', '#c7dcfc', 'white', 'white']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: Dimensions.get('window').height
                }}
            />
            {person ?
                <PersonForm 
                    initialValues={{
                        firstname: person.firstname,
                        lastname: person.lastname,
                        category: person.category,
                        imageUrl: person.imageUrl
                        }
                    }
                    isEditProfile={true}
                    categoryState={categoryState}
                    onSubmit={async (firstname, lastname, image, category, newImage) => {
                        if (newImage) {
                            const token = await AsyncStorage.getItem('token');
                            const uri = image;
                            const uriParts = uri.split('.');
                            const fileType = uriParts[uriParts.length - 1];

                            const imgBody = new FormData();
                            imgBody.append('file', {
                                uri,
                                name: `photo.${fileType}`,
                                type: `image/${fileType}`,
                            });

                            const url = 'https://mysterious-reaches-23624.herokuapp.com/upload';
                            fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: imgBody
                            }).then(res => res.json()).then(async(results) => {
                                await updatePerson(_id, firstname, lastname, results.imageUrl, category, () => navigation.pop());
                            }).catch(err => {
                                console.log("Whoops an error occurred: " + err);
                            });
                        } else {
                            await updatePerson(_id, firstname, lastname, image, category, () => navigation.pop());
                        }
                    }}
                    onClick = {async () => {
                        // await updateMeetingsAfterPersonDelete(_id);
                        await deletePerson(_id, () => navigation.popToTop());
                        // await deletePerson(_id);
                        // navigation.popToTop();
                    }}
                />
            : <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
            }
        </View>
        
    )
}

EditPersonProfileScreen.navigationOptions = () => {
    return {
        title: ""
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditPersonProfileScreen;