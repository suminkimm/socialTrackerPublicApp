import React, {useContext, useState, useRef} from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Text, Avatar, ListItem, Button, Card } from 'react-native-elements';
import { useScrollToTop } from 'react-navigation';
import {Context as PeopleContext} from '../context/PeopleContext';
import {Context as MeetingsContext} from '../context/MeetingsContext';
import {EvilIcons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

var moment = require('moment');

function isPersonMeeting(meeting, _id) {
    if(meeting.personId.includes(_id)) {
        return true;
    }
    return false;
}

function isCorrectMonthYear(meeting, monthYear) {
    if(moment(meeting.date).month() === moment(monthYear).month() && moment(meeting.date).year() === moment(monthYear).year()) {
        return true;
    }
    return false;
}

const PersonProfileScreen = ({navigation}) =>  {
    const {peopleState, deletePerson} = useContext(PeopleContext);
    const {meetingState} = useContext(MeetingsContext);
    const [numItemsToShow, setNumItemsToShow] = useState(5);
    const [showToTopButton, setShowToTopButton] = useState(false);
    const scrollRef = useRef(null);

    const _id = navigation.getParam('_id');


    const [monthYear, setMonthYear] = useState(new Date());
    const [show, setShow] = useState(false);
    const showPicker = (value) => setShow(value);

    const person =  peopleState.find((person) => (person._id === _id));
    
    const totalMonthMeetings = meetingState.filter((meeting) => isCorrectMonthYear(meeting, monthYear));
    const filteredMeetings = meetingState.filter((meeting) => isPersonMeeting(meeting, _id));
    const dateFilteredMeetings = filteredMeetings.filter((meeting) => isCorrectMonthYear(meeting, monthYear));

    
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
        <ScrollView 
            ref={scrollRef}
            contentContainerStyle={{flex: 1}}
        >
            { filteredMeetings.length !== undefined && person !== undefined
            ?
                <View>
                    <View style={styles.topContainer}>
                        <View style={styles.avatarContainer}>
                            <Avatar 
                                rounded
                                size={125}
                                source={{ uri: person.imageUrl }}
                            />
                        </View>
                        <Text style={styles.nameText}>{person.firstname} {person.lastname}</Text>
                        <Text style={styles.categoryText}>{person.category}</Text>
                    </View>

                    <Card borderRadius={20} containerStyle={{padding: 25, marginTop: 10, marginBottom: 30}}>
                        <Text style={{fontSize: 16, paddingBottom: 15}}>You've met with {person.firstname}</Text>
                        <Text style={styles.numberText}>{dateFilteredMeetings.length == 1 ? <Text>{dateFilteredMeetings.length} time</Text> : <Text>{dateFilteredMeetings.length} times</Text>}</Text> 
                        <Text style={{fontSize: 16, paddingTop: 15}}>out of {totalMonthMeetings.length} meetings in {moment(moment(monthYear).month()+1, 'M').format('MMMM')}</Text>
                    </Card>
                    
                    <View style={styles.meetingsContainer}>
                        <Text style={styles.meetingsText}>Recent meetings</Text>
                        {filteredMeetings.length < 1 
                        ? <View>
                            <ListItem
                                title="No meetings to show"
                            />
                        </View> 
                        : <View>
                            {filteredMeetings.splice(0, numItemsToShow).map((item, index) => {
                                var date = item.date;
                                var formattedDate = moment(date).format('MMMM Do, YYYY');
                                return (
                                    <TouchableOpacity 
                                        key={index}
                                        onPress={() => {
                                            navigation.navigate('MeetingDetail', {_id: item._id, date: date});
                                            }}
                                    >
                                        <ListItem chevron
                                            key={index} 
                                            leftAvatar={{
                                                source: {uri: person.imageUrl}
                                            }}
                                            title={item.title}
                                            subtitle={formattedDate}                                                                
                                        />
                                    </TouchableOpacity>
                                );
                            })
                            }
                            
                            {filteredMeetings.length > 0 ?
                                <Button 
                                    type="clear"
                                    title="View more"
                                    onPress={() => {
                                        setNumItemsToShow(numItemsToShow + 5);
                                        setShowToTopButton(true);
                                    }}
                                />
                            : null}
                            
                            </View>
                        }
                    </View>
                </View>
            :
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
            }
        </ScrollView>
        <View>
            {showToTopButton ?
            <Button
                type="clear"
                icon={
                    <AntDesign name="upcircle" size={30} color="#4eb2f5" />
                }
                containerStyle={{
                    position: 'absolute',
                    bottom: 0,
                    alignSelf: 'flex-end',
                    paddingRight: 15,
                    paddingBottom: 15
                }}
                onPress={() => scrollRef.current.scrollTo({x: 0, y: 0, animated: true})}
            />
        : null}
        </View>
        </View>
    )
}

PersonProfileScreen.navigationOptions = ({navigation}) => {

    return {
        headerTitle: "",
        headerRight: () =>
            <TouchableOpacity 
                onPress={() => 
                    navigation.navigate('Edit', {_id: navigation.getParam('_id')})
                }
            >
                <EvilIcons name="pencil" size={35}/>
            </TouchableOpacity>
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    topContainer: {
        paddingTop: 20,
        paddingBottom: 20
    },
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15
    },
    meetingsContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        paddingBottom: 25,
        marginHorizontal: 15
    },
    meetingsText: {
        padding: 20,
        fontSize: 22,
        fontWeight: "bold"
    },
    categoryText: {
        textAlign: "center",
        fontSize: 20,
        color: "white"
    },
    nameText: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "bold",
        paddingBottom: 5,
        color: "white"
    },
    numberText: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        paddingBottom: 5
    }
});

export default PersonProfileScreen;