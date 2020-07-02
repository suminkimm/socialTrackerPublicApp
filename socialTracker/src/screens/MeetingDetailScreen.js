import React, {useContext, useEffect, useState} from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { Context as MeetingsContext } from '../context/MeetingsContext';
import { Context as PeopleContext } from '../context/PeopleContext';
import { LinearGradient } from 'expo-linear-gradient';


var moment = require('moment');

const MeetingDetailsScreen = ({navigation}) =>  {
    const {meetingState} = useContext(MeetingsContext);
    const {peopleState} = useContext(PeopleContext);

    const _id = navigation.getParam('_id');
    const meeting = meetingState.find(m => m._id === _id);

    const startTime = meeting.startTime;
    const endTime = meeting.endTime;
    var momentStart = moment(startTime, "h:mm a");
    var momentEnd = moment(endTime, "h:mm a");
    var duration = moment.duration(momentEnd.diff(momentStart));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;

    var imageUrls = [];
    for (let i = 0; i < meeting.personId.length; i ++) {
        var person = peopleState.find(p => p._id === meeting.personId[i]);
        imageUrls.push({_id: person._id, imageUrl: person.imageUrl, firstname: person.firstname, lastname: person.lastname});
    }

    return (
        <View style={{flex: 1}}>
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
        <ScrollView contentContainerStyle={{flex: 1}}>
            {meeting !== undefined ?
            <View>
                <View style={styles.imageContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item._id}
                    data={imageUrls}
                    renderItem={({item}) => {
                        return (
                            // <TouchableOpacity onPress={() => navigation.navigate('PersonProfile', {_id: item._id})}>
                            <View style={styles.avatarContainer}>
                                <Avatar
                                    size={80}
                                    rounded
                                    source={{ uri: item.imageUrl }}
                                />
                                <Text style={{paddingTop: 10, fontSize: 16}}>{item.firstname}</Text>
                            </View>
                            // </TouchableOpacity>
                            
                        )
                    }}
                />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentHeader}>{meeting.title}</Text>
                    <Text style={{fontSize: 16, paddingHorizontal: 20, paddingBottom: 30}}>{startTime} - {endTime}</Text>
                    <Text style={styles.subHeader}> You met for </Text>
                    {hours == 0 
                        ? <Text style={styles.timeText}>{minutes} minutes</Text>
                        : minutes == 0
                            ? hours == 1 
                                ? <Text style={styles.timeText}>{hours} hour </Text>
                                : <Text style={styles.timeText}>{hours} hours </Text>
                            : hours == 1
                                ? <Text style={styles.timeText}>{hours} hour {minutes} min.</Text>
                                : <Text style={styles.timeText}>{hours} hours {minutes} min.</Text>
                    }
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.contentHeader}>Additional Details</Text>
                    <Text style={styles.details}>{meeting.details}</Text>
                </View>
                </View>
                : null
            }
        </ScrollView>
        </View>
    )
};

MeetingDetailsScreen.navigationOptions = ({navigation}) => {
    var date = navigation.getParam('date');
    var formattedDate = moment(date).format("MMMM Do, YYYY");
    return {
        title: formattedDate
    };
};


const styles = StyleSheet.create({
    imageContainer: {
        paddingLeft: 15,
        paddingVertical: 35
    },
    avatarContainer: {
        marginRight: 15,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 25
    },
    contentContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 25
    },
    contentHeader: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 10,
        fontSize: 22,
        fontWeight: "bold"
    },
    timeText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        paddingBottom: 30
    },
    subHeader: {
        fontSize: 20,
        paddingBottom: 10, 
        paddingHorizontal: 15, 
        textAlign: "center"
    },
    details: {
        paddingHorizontal: 20,
        fontSize: 18,
        paddingBottom: 30
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderRadius: 30,
        marginTop: 15,
        marginHorizontal: 15,
    },
});

export default MeetingDetailsScreen;