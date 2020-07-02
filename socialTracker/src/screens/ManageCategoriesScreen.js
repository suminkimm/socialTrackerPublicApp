import React, {useContext, useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text, Avatar, ListItem, Button, Input } from 'react-native-elements';
import {Context as CategoryContext} from '../context/CategoryContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { NavigationEvents } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';


const ManageCategoriesScreen = ({navigation}) => {
    const {categoryState, viewCategories, updateCategories, movePeopleToNewCategory} = useContext(CategoryContext);
    const [newCategory, setNewCategory] = useState("");
    const [moveToCategory, setMoveToCategory] = useState("");
    const [categoryToDelete, setCategoryToDelete] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [submitText, setSubmitText] = useState("Cancel");

    var categoryList = categoryState.map(c => ({
        label: c,
        value: c, 
        key: c
    }));

    categoryList.push({label: "Delete everyone", value: "Delete everyone", key: "Delete everyone"});

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <NavigationEvents onWillFocus={viewCategories} />
            {categoryState.length < 6 ?
                <Input
                    containerStyle={{paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10}}
                    placeholder="Add new category (max total: 6)"
                    onChangeText={(value) => setNewCategory(value)}
                    rightIcon={
                        <TouchableOpacity onPress={async () => {
                            await updateCategories([...categoryState, newCategory]);
                            setNewCategory("");
                        }}>
                            <Ionicons name="ios-add" size={24} color="black" />
                        </TouchableOpacity>
                    }
                    value={newCategory}
                />
            : <Input
                disabled
                containerStyle={{paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10}}
                placeholder="Max 6 categories allowed."
                rightIcon={
                    <Ionicons name="ios-add" size={24} color="black" />
                }
            />
            }
                
            <SwipeListView
                keyExtractor={item => item}
                data = {categoryState}
                disableRightSwipe
                rightOpenValue={-75}
                renderItem = {({item}) => {
                    return (
                        <View style={{backgroundColor: 'white'}}>
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Category', {category: item})}
                                underlayColor={'#AAA'}
                            >
                                <ListItem
                                    chevron
                                    title={item} 
                                />
                            </TouchableOpacity>
                        </View>
                            
                        )
                    }
                }
                renderHiddenItem={({item}) => {
                        return (
                            <View style={styles.rowBack}>
                                <TouchableOpacity 
                                    onPress={() => {
                                        setCategoryToDelete(item);
                                        toggleModal();
                                    }}
                                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                                >
                                    <Text style={{ color: 'white' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                }
            />

            <View>
                <Modal isVisible={isModalVisible}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Where do you want to move the people in this category?</Text>
                        <Text style={styles.modalSubText}>*Deleting a person will delete all of his or her meetings.</Text>
                        <RNPickerSelect
                            placeholder={{label: 'Select a category', value: ''}}
                            onValueChange={(value) => {
                                if (value == '') {
                                    setSubmitText("Cancel");
                                } else {
                                    setSubmitText("Confirm");
                                }
                                setMoveToCategory(value);
                            }}
                            items={categoryList.filter(c => c.value != categoryToDelete)}
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
                        <Button 
                            title={submitText} 
                            onPress={async () => {
                                if (moveToCategory != "") {
                                    await updateCategories(categoryState.filter(c => c != categoryToDelete));
                                    await movePeopleToNewCategory(categoryToDelete, moveToCategory);
                                }
                                setNewCategory("");
                                setCategoryToDelete("");
                                toggleModal();
                            }}
                            buttonStyle={
                                {
                                    borderRadius: 50,
                                    padding: 15,
                                    backgroundColor: "#4eb2f5",
                                    borderWidth: 0
                                }
                            }
                            containerStyle={{
                                paddingHorizontal: 15,
                                paddingTop: 30
                            }}
                        />
                    </View>
                </Modal>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 25
    },
    modalText: {
        fontSize: 20,
        paddingBottom: 15
    },
    modalSubText: {
        paddingBottom: 20
    }
});

ManageCategoriesScreen.navigationOptions = () => {
    return {
        title: "",
        headerStyle: {
            backgroundColor: '#4eb2f5',
        },
        headerTintColor: "white"
    };
};


export default ManageCategoriesScreen;