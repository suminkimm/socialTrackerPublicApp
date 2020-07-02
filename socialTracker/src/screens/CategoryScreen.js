import React, {useContext, useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';
import { Context as PeopleContext } from '../context/PeopleContext';
import { LinearGradient } from 'expo-linear-gradient';


const CategoryScreen = ({navigation}) =>  {

    const {peopleState, fetchPeople} = useContext(PeopleContext);
    const category = navigation.getParam('category');

    const filteredPeople = peopleState.filter((person) => person.category === category);

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <NavigationEvents onWillFocus={fetchPeople}/>
             <FlatList 
                scrollEnabled
                data={filteredPeople}
                keyExtractor={item => item._id}
                renderItem = {({item}) => {
                    return <TouchableOpacity onPress={() => {
                        navigation.navigate('PersonProfile', {_id: item._id, firstname: item.firstname, lastname: item.lastname});
                    }}>
                        <ListItem chevron 
                            leftAvatar={{
                                source: {uri: item.imageUrl}
                            }}
                            title={item.firstname + " " + item.lastname}
                            subtitle={item.category}                                                                
                        />
                    </TouchableOpacity>
                }}
            >
            </FlatList>
        </View>
    )
}

CategoryScreen.navigationOptions = ({navigation}) => {
    return {
        title: navigation.getParam('category'),
        headerStyle: {
            backgroundColor: '#4eb2f5',
        },
        headerTintColor: "white"
    };
}

export default CategoryScreen;