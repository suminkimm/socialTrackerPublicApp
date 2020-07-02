import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Alert, View, ScrollView} from 'react-native';
import { Avatar, Text, Button, Input } from 'react-native-elements';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';

import defaultImageUrl from '../components/defaultImage';
import RNPickerSelect from 'react-native-picker-select';
import { Entypo } from '@expo/vector-icons';


const PersonForm = ({onSubmit, initialValues, categoryState, isEditProfile, onClick}) => {
    const [firstname, setFirstName] = useState(initialValues.firstname);
    const [lastname, setLastName] = useState(initialValues.lastname);
    const [category, setCategory] = useState(initialValues.category);
    const [image, setImage] = useState(initialValues.imageUrl);

    var categoryList = categoryState.map(c => ({
        label: c,
        value: c, 
        key: c
    }));

    useEffect(() => {
        (async () => {
          if (Constants.platform.ios) {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <ScrollView>
        <View style={styles.topContainer}>
            <Avatar
                size="xlarge"
                rounded
                source={{uri: image}}
                showAccessory
                onAccessoryPress={pickImage}
            />
        </View>
        <View style={styles.inputContainer}>
            <Input
                autoCorrect={false}
                label="First Name"
                value={firstname}
                onChangeText={(firstname) => setFirstName(firstname)}
            />
            <Input
                autoCorrect={false}
                label="Last Name"
                value={lastname}
                onChangeText={(lastname) => setLastName(lastname)}
            />
        </View>
        <View style={{marginHorizontal: 15}}>
            <RNPickerSelect
                placeholder={{label: 'Select a category', value: ''}}
                value={category}
                onValueChange={(value) => setCategory(value)}
                items={categoryList}
                style={{
                    inputIOS: {
                        fontSize: 18,
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 4,
                        color: 'black',
                        marginHorizontal: 10,
                        paddingRight: 30,
                        backgroundColor: "white"
                      },
                      inputAndroid: {
                        fontSize: 18,
                        paddingHorizontal: 10,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 4,
                        color: 'black',
                        paddingRight: 30,
                        marginHorizontal: 10,
                        backgroundColor: "white"
                      },
                      iconContainer: {
                          top: 10,
                          right: 20,
                          backgroundColor: "white"
                      }
                }}
                Icon={() => {
                    return <Entypo name="chevron-down" size={24} color="black" />;
                }}
            />
        </View>
        <Button 
            title="Save" 
            onPress={() => {
                    var newImage = true;
                    if(image.localeCompare(initialValues.imageUrl) == 0) {
                        newImage = false;
                    }
                    if(firstname == '' || lastname == '' || category == '') {
                        Alert.alert('Incomplete', 
                        'Please fill in all given fields!',
                        [ {text: 'OK'}]
                        )
                    } 
                    else {
                        onSubmit(firstname, lastname, image, category, newImage);
                    }
                }    
            }
            buttonStyle={
                {
                    borderRadius: 50,
                    padding: 15,
                    backgroundColor: "#4eb2f5",
                    borderWidth: 0
                }
            }
            titleStyle={{
                fontSize: 20
            }}
            containerStyle={{
                paddingHorizontal: 15,
                paddingTop: 40
            }}
        />
        {isEditProfile ?
            <Button
                title="Delete"
                onPress={async () => {
                    Alert.alert('Delete this person?',
                    'All of his or her meetings will also be deleted.',
                    [ 
                        {text: 'Cancel'}, 
                        {
                            text: 'Yes',
                            onPress: () => {onClick();}
                        } 
                    ]
                    )
                }}
                buttonStyle={
                    {
                        borderRadius: 50,
                        padding: 15,
                        backgroundColor: "#c74e6c",
                        borderWidth: 0
                    }
                }
                titleStyle={{
                    fontSize: 20
                }}
                containerStyle={{
                    paddingHorizontal: 15,
                    paddingTop: 20
                }}
            />
        : null
        }
                    
        </ScrollView>
    );
}

PersonForm.defaultProps = { // prevent initialValues from giving undefined error
    initialValues: {
        firstname: '',
        lastname: '',
        category: '',
        imageUrl: defaultImageUrl
    }
};

const styles = StyleSheet.create({
    topContainer: {
        padding: 25,
        alignItems: "center",
        marginBottom: 20
    },
    inputContainer: {
        marginHorizontal: 15,
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 40,
        borderRadius: 30
    },
    buttonContainer: {
        paddingVertical: 25,
        paddingHorizontal: 25
    }
})

export default PersonForm;