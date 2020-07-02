import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import {Context as PeopleContext} from '../context/PeopleContext';
import {Context as MeetingsContext} from '../context/MeetingsContext';
import {Context as CategoryContext} from '../context/CategoryContext';
import Data from '../components/DashboardData';

var moment = require('moment');


const DashboardScreen = ({navigation}) =>  {

    const {peopleState, fetchPeople} = useContext(PeopleContext);
    const {meetingState, fetchMeetings} = useContext(MeetingsContext);
    const {categoryState, viewCategories} = useContext(CategoryContext);

    const [isLoading, setIsLoading] = useState(false);
    const [monthYear, setMonthYear] = useState(new Date());

    function isCorrectMonthYear(meeting, monthYear) {
        if(moment(meeting.date).month() === moment(monthYear).month() && moment(meeting.date).year() === moment(monthYear).year()) {
            return true;
        }
        return false;
    }
    
    useEffect(() => {

        const fetchData = async() => {
            setIsLoading(true);
            await fetchPeople();
            await viewCategories();
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
        <View style={{flex: 1, backgroundColor: "white"}}>
            {isLoading ? 
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
            : 
            <View>
                {peopleState.length == 0 || meetingState.length == 0 || categoryState == 0
                ? <View style={styles.initialContainer}>
                    <Text style={styles.initialMessage}> Add meetings and people to track your social circle! </Text>
                </View>
                : <Data
                    peopleState={peopleState}
                    meetingState={meetingState.filter(meeting => isCorrectMonthYear(meeting, monthYear))}
                    categoryState={categoryState}
                    monthYear={monthYear}
                />
                }    
            </View>
            }
        </View>
    )
}

DashboardScreen.navigationOptions = {
    headerStyle: {
        backgroundColor: '#4eb2f5',
    },
    headerTitleStyle: {
        color: "white"
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    initialContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0.35*Dimensions.get('screen').height
    },
    initialMessage: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "bold",
        color: '#4eb2f5',
        marginHorizontal: 15
    }
})

export default DashboardScreen;