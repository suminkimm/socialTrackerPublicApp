import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, ListItem, Card } from 'react-native-elements';
import {navigate} from '../navigationRef';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Context as MeetingsContext} from '../context/MeetingsContext';
import {Context as PeopleContext} from '../context/PeopleContext';

var moment = require('moment');

const AgendaData = ({peopleState, meetingState}) => {
    // const {peopleState} = useContext(PeopleContext);
    // const {meetingState} = useContext(MeetingsContext);
    const [agendaList, setAgendaList] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const getAgenda = async () => {
        const uniqueDates = [...new Set(meetingState.map(meeting => meeting.date))]
        const newAgenda = {};

        var startDate = moment(uniqueDates[uniqueDates.length-1]);

        for (var m = moment(startDate); m.diff(moment(new Date()).endOf('month'), 'days') <= 0; m.add(1, 'days')) {
            newAgenda[moment(m).format('YYYY-MM-DD')] = meetingState.filter(meeting => moment(meeting.date).format('YYYY-MM-DD') == moment(m).format('YYYY-MM-DD'));
        }

        return newAgenda;
    }

    useEffect(() => {
        let isSubscribed = true;

        const fetchData = async () => {
            if (isSubscribed) {
                setIsLoading(true);
                
                const newAgenda = await getAgenda();

                if (isSubscribed) {
                    setAgendaList(newAgenda);
                    setIsLoading(false);
                }
                
            } else {
                console.log("no data");
            }
        };

        fetchData();
        return () => isSubscribed = false;
    }, []);

    return (
        <View style={{height: Math.round(Dimensions.get('window').height)}}>
            {isLoading ? 
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            : 
            <Agenda 
                items={agendaList}
                minDate={meetingState[meetingState.length-1].date}
                maxDate={new Date()}
                selected={new Date()}
                renderItem={(item, firstItemInDay) => {
                    var totalAttendees = item.personId.length;
                    var firstPerson = peopleState.find(p => p._id === item.personId[0]);
                    var subtitle = firstPerson.firstname;
                    for (let i = 1; i < totalAttendees; i ++) { // total attendees = 4; 1st(i=0) 2nd(i=1) 3rd(i=2) 4th(i=3)
                        if (i > 2) {
                            if (totalAttendees == 4) {
                                subtitle += `, +1 other`;
                                break;
                            } else {
                                subtitle += ` +${totalAttendees - i} others`;
                                break;
                            } 
                        } 
                        var firstname = peopleState.find(p => p._id === item.personId[i]).firstname;
                        subtitle += ", " + firstname;
                    }
                    
                    return (
                        <TouchableOpacity style={styles.item} onPress={() => {
                            navigate('MeetingDetail', {_id: item._id, date: item.date});
                        }}>
                            <ListItem chevron 
                                leftAvatar={{
                                    source: {uri: firstPerson.imageUrl}
                                }}
                                title={item.title}
                                subtitle={subtitle}
                            />
                        </TouchableOpacity>
                    )
                }}
                renderEmptyDate={() => {
                    return (
                        <View style={styles.emptyDate}>
                        </View>
                    );
                }}
            />
            }
        </View>
        
    )
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 20,
      flex:1,
      paddingTop: 30,
      alignItems: 'center'
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default AgendaData;