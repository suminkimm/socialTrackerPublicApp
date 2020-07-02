import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {Context as PeopleContext} from '../context/PeopleContext';
import {Context as MeetingsContext} from '../context/MeetingsContext';
import MeetingForm from '../components/MeetingForm';
import {NavigationEvents} from 'react-navigation';

const AddMeetingScreen = ({navigation}) => {
    
    const {peopleState, fetchPeople} = useContext(PeopleContext);
    const {createMeeting} = useContext(MeetingsContext);

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <NavigationEvents onWillFocus={fetchPeople}/>
            <View>
                <MeetingForm 
                    peopleState={peopleState}
                    onSubmit={async (title, details, personId, date, startTime, endTime, totalTime) => {
                        await createMeeting(title, details, personId, date, startTime, endTime, totalTime);
                        navigation.navigate('Add');
                    }}
                />
            </View>
            
        </ScrollView>
    )
}

AddMeetingScreen.navigationOptions = () => {
    return {
        title: "",
        headerStyle: {
            backgroundColor: '#4eb2f5',
        },
        headerTintColor: "white"
    };
};

const styles = StyleSheet.create({});

export default AddMeetingScreen;