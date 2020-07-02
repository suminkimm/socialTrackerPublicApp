import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight, ScrollView, ActivityIndicator } from 'react-native';
import { Text, ListItem, Card, Button } from 'react-native-elements';
import {PieChart} from 'react-native-chart-kit';
import {navigate} from '../navigationRef';
import { Entypo } from '@expo/vector-icons';


var moment = require('moment');

const Data = ({peopleState, meetingState, categoryState, monthYear}) => {

    const [peopleWithTotalTimeList, setPeopleWithTotalTimeList] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDescending, setIsDescending] = useState("Most");

    const colorArray = ['#D6EAF8', '#85C1E9', '#3498DB', '#2874A6', '#21618C', '#1B4F72']

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

    async function getTotalMeetingTime(person) {

        if (meetingState.length > 0) {
            var personAllMeetings = meetingState.filter((m) => isPersonMeeting(m, person._id) && isCorrectMonthYear(m, monthYear));
            var personTotalTime = 0;
            for (let i = 0; i < personAllMeetings.length; i ++) {
                personTotalTime += personAllMeetings[i].totalTime;
            }
            return personTotalTime;
        }
        
    }

    async function orderPeopleByTime() {
    
        const promises = peopleState
            .map(async (person) => ({
                ...person,
                totalTime: await getTotalMeetingTime(person)
            }))

        const orderedPeople = await Promise.all(promises);
        return orderedPeople.sort((a, b) => b.totalTime - a.totalTime);;

    }

    async function getTotalCategoryMeetingTime(category, peopleWithTotalTimeList) {
        if (peopleWithTotalTimeList.length > 0) {
            var categoryAllTime = peopleWithTotalTimeList.filter((p) => p.category == category);
            var categoryTotalTime = 0;
            for (let i = 0; i < categoryAllTime.length; i ++) {
                categoryTotalTime += categoryAllTime[i].totalTime;
            }
            
            return categoryTotalTime;
        }
    }

    async function getCategoryData(peopleWithTotalTimeList) {
        if (peopleWithTotalTimeList.length > 0) {
            const promises = categoryState
                .map(async (category, index) => ({
                    name: category,
                    totalTime: await getTotalCategoryMeetingTime(category, peopleWithTotalTimeList),
                    color: `${colorArray[index]}`,
                    legendFontColor: "black",
                    legendFontSize: 14
                }))
            
            const orderedCategories = await Promise.all(promises);

            return orderedCategories;

        }
    }

    

    useEffect(() => {

        let isSubscribed = true;

        const fetchData = async () => {
            if (isSubscribed) {
                setIsLoading(true);
                

                const orderedPeople = await orderPeopleByTime();
                const orderedCategory = await getCategoryData(orderedPeople);

                if (isSubscribed) {
                    setPeopleWithTotalTimeList(orderedPeople);
                    setCategoryData(orderedCategory);
                    setIsLoading(false);
                }
                
            } else {
                console.log("no data");
            }
        };

        fetchData();

        return () => isSubscribed = false;

    }, []);


    function orderPeopleList() {
        if (isDescending == "Least") {
            peopleWithTotalTimeList.sort((a, b) => b.totalTime - a.totalTime);
        } else {
            peopleWithTotalTimeList.sort((a, b) => a.totalTime - b.totalTime);
        }
    }

    return (
        <View>
        {isLoading
        ? <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        : 
        <ScrollView>
            <Card 
                borderRadius={20} 
                containerStyle={{
                    padding: 25, 
                    marginTop: 25,
                    backgroundColor: "#4eb2f5"
                    }}
                >
                <Text style={{fontSize: 20, paddingBottom: 15, color: "white"}}>In {moment(moment(monthYear).month()+1, 'M').format('MMMM')}, you've had</Text>
                <Text style={styles.meetingText}>{meetingState.length} meetings</Text>
            </Card>
        {meetingState.length < 1 ? 
        <View style={{marginTop: 20, marginBottom: 30}}> 
            <Card 
                borderRadius={20} 
                containerStyle={{
                    padding: 25, 
                    backgroundColor: "white"
                }}
            >
                <Text style={{fontSize: 20}}>No meeting data to display yet.</Text>
            </Card> 
        </View>
            
        : 
            <View style={styles.pieChartContainer}>
                <PieChart
                    data={categoryData}
                    width={Dimensions.get('window').width}
                    height={220}
                    accessor="totalTime"
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity=255) => `rgba(0,0,0,${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    backgroundColor="transparent"
                    paddingLeft="15"
                />
            </View>
        }
            <View style={styles.peopleContainer}>
                <View style={styles.peopleHeader}> 
                    <Text style={styles.peopleText}>5 {isDescending} Visited</Text>
                    <View style={styles.buttonLayout}>
                        <Button
                            type="clear"
                            icon={<Entypo name="select-arrows" size={24} color="white" />}
                            onPress={() => {
                                if (isDescending == "Most") {
                                    setIsDescending("Least");
                                } else {
                                    setIsDescending("Most");
                                }
                                orderPeopleList();
                            }}
                        />
                    </View>
                </View>
                <View>
                    {peopleWithTotalTimeList.slice(0,5).map((item, index) => {
                        return (
                            <TouchableHighlight 
                            key={index}
                            onPress={() => {
                                navigate('PersonProfile', {_id: item._id, firstname: item.firstname, lastname: item.lastname});
                            }}
                            >
                            <ListItem chevron 
                                key={index}
                                leftAvatar={{
                                    source: {uri: item.imageUrl}
                                }}
                                title={item.firstname + " " + item.lastname}
                                subtitle={item.category}                                                                
                            />
                            </TouchableHighlight>
                        )
                    })
                    }
                </View>
            </View>
        </ScrollView>
        
        }   
        </View>
        
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonLayout: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    meetingText: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        paddingBottom: 5,
        color: "white"
    },
    pieChartContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        marginVertical: 10
    },
    peopleContainer: {
        backgroundColor: '#4eb2f5',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginHorizontal: 15
    },
    peopleText: {
        fontSize: 22,
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 20,
        color: "white"
    },
    peopleHeader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10
    }
});

export default Data;