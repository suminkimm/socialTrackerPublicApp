import React, {useEffect, useContext} from 'react';
import {View, ScrollView, StyleSheet, AsyncStorage, Dimensions} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {Context as CategoryContext} from '../context/CategoryContext';
import {Context as PeopleContext} from '../context/PeopleContext';
import {Context as ImageContext} from '../context/ImageContext';
import { NavigationEvents } from 'react-navigation';
import PersonForm from '../components/PersonForm';
import { LinearGradient } from 'expo-linear-gradient';


var FormData = require('form-data');

const AddPersonScreen = ({navigation}) => {
    const {categoryState, viewCategories} = useContext(CategoryContext);
    const {createPerson} = useContext(PeopleContext);

    return (
        <ScrollView>
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
        <NavigationEvents onWillFocus={viewCategories}/>
        <PersonForm
            isEditProfile={false}
            categoryState={categoryState}
            onSubmit={async (firstname, lastname, image, category, newImage) => {
                
                if (newImage == true) {
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
                    }).then(res => res.json()).then(results => {
                        createPerson(firstname, lastname, results.imageUrl, category);
                        navigation.navigate('Add');
                    }).catch(err => {
                        console.log("Whoops an error occurred: " + err);
                    });
                    
                } else {
                    createPerson(firstname, lastname, image, category);
                    navigation.navigate('Add');
                }
            }}
        />
        </ScrollView>
    )
}

AddPersonScreen.navigationOptions = () => {
    return {
        title: ""
    };
};

const styles = StyleSheet.create({});

export default AddPersonScreen;