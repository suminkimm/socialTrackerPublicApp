import React, {useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';
import {Context as MeetingsContext} from '../context/MeetingsContext';
import {Context as PeopleContext} from '../context/PeopleContext';
import AgendaData from '../components/agenda';
var moment = require('moment');

const MeetingsScreen = ({navigation}) =>  {

    const {peopleState, fetchPeople} = useContext(PeopleContext);
    const {meetingState, fetchMeetings} = useContext(MeetingsContext);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await fetchPeople(); // 1st time we show screen
            await fetchMeetings();
            setIsLoading(false);
        }
        
        fetchData();

        const listener = navigation.addListener('willFocus', () => { // refresh every time we return to the screen
            fetchData();
        });
        
        return () => { // clean up to prevent memory leak
            listener.remove();
        }
    }, []);


    return (
        <View style={{flex: 1}}>
            {isLoading ? 
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
            : 
            <View>
            {meetingState.length == 0 || peopleState.length == 0 
                ? <View style={styles.initialContainer}>
                    <Text style={styles.initialMessage}>Add meetings and people to track your social circle!</Text>
                    </View>
                : <AgendaData
                    peopleState={peopleState}
                    meetingState={meetingState}
                    />
                }
            </View>
            }
        </View>
    )
}

MeetingsScreen.navigationOptions = () => {
    return {
        headerStyle: {
            backgroundColor: '#4eb2f5',
        },
        headerTitleStyle: {
            color: "white"
        }
    };
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
        height: 15,
        flex:1,
        paddingTop: 30
    },
    initialContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: Dimensions.get('screen').height,
    },
    initialMessage: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "bold",
        color: '#4eb2f5',
        marginHorizontal: 15,
        marginBottom: 0.20*Dimensions.get('screen').height
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default MeetingsScreen;