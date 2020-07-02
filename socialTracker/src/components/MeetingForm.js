import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert} from 'react-native';
import {Text, Button, Input, SearchBar, ListItem} from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spacer from './Spacer';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

var moment = require('moment');


const MeetingForm = ({onSubmit, initialValues, peopleState}) => {

    const [filteredPeopleList, setFilteredPeopleList] = useState(initialValues.personId);
    const [currSearchList, setCurrSearchList] = useState(peopleState);

    const [title, setTitle] = useState(initialValues.title);
    const [details, setDetails] = useState(initialValues.details);

    const [date, setDate] = useState(initialValues.date);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [startTime, setStartTime] = useState(initialValues.startTime);
    const [endTime, setEndTime] = useState(initialValues.endTime);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

    const [dateButtonTitle, setDateButtonTitle] = useState("Date: " + moment(date).format("MMMM Do, YYYY"));
    const [startButtonTitle, setStartButtonTitle] = useState("Start: " + moment(startTime).format("h:mm a"));
    const [endButtonTitle, setEndButtonTitle] = useState("End: " + moment(endTime).format("h:mm a"));

    const [query, setQuery] = useState('');

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        setDate(date);
        setDateButtonTitle(moment(date).format("MMMM Do, YYYY"));
        hideDatePicker();
    };

    const showStartTimePicker = () => {
        setStartTimePickerVisibility(true);
    };

    const showEndTimePicker = () => {
        setEndTimePickerVisibility(true);
    };

    const hideStartTimePicker = () => {
        setStartTimePickerVisibility(false);
    };

    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false);
    };

    const handleStartTimeConfirm = (time) => {
        setStartTime(time);
        setStartButtonTitle("Start: " + moment(time).format("h:mm a"));
        hideStartTimePicker();
    };

    const handleEndTimeConfirm = (time) => {
        setEndTime(time);
        setEndButtonTitle("End: " + moment(time).format("h:mm a"));
        hideEndTimePicker();
    };


    useEffect(() => {
        const lowerCaseQuery = query.toLowerCase();
        const newPeople = peopleState
            .filter((person) => (person.firstname.toLowerCase().includes(lowerCaseQuery) || person.lastname.toLowerCase().includes(lowerCaseQuery)))
            .map((person) => ({
                ...person,
                rank: person.firstname.toLowerCase().indexOf(lowerCaseQuery)
            }))
            .sort((a, b) => a.rank - b.rank);

        setCurrSearchList(newPeople);
    }, [query]);


    return (
        <>
                <SearchBar
                    placeholder="Who did you meet?"
                    onChangeText={setQuery}
                    value={query}
                    lightTheme
                    round
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderBottomColor: 'transparent',
                        borderTopColor: 'transparent',
                        paddingHorizontal: 15,
                        paddingTop: 30
                    }}
                />
                    {query != '' ?
                        currSearchList.map((item, index) => {
                            return <TouchableOpacity 
                                key={index}
                                onPress={() => {
                                    if(filteredPeopleList.find(p => p === item._id)) {
                                        setFilteredPeopleList(filteredPeopleList.filter(p => p !== item._id));
                                    } else {    
                                        setFilteredPeopleList([...filteredPeopleList, item._id]);
                                    }
                                }}>
                                <ListItem
                                    key={index}
                                    scrollEnabled
                                    leftAvatar={{
                                        source: {uri: item.imageUrl}
                                    }}
                                    title={item.firstname + " " + item.lastname}
                                    subtitle={item.category}
                                    rightIcon={filteredPeopleList.find(p => p === item._id) ? <AntDesign name="checkcircle" size={24} color="black" /> : null}                                                                
                                />
                            </TouchableOpacity>
                        })
                    : null
                    }

                    <View style={{ paddingLeft: 15, paddingVertical: 5 }}>
                        <FlatList
                            scrollEnabled
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            contentContainerStyle={styles.container}
                            keyExtractor={item => item}
                            data={filteredPeopleList}
                            renderItem={({item}) => {
                                var foundItem = peopleState.find(p => p._id === item);
                                return (
                                    <View style={styles.tag}>
                                        <View style={styles.innerTag}>
                                            <Text style={{fontSize: 15}}>{foundItem.firstname} </Text>
                                            <TouchableOpacity onPress={() => {
                                                setFilteredPeopleList(filteredPeopleList.filter(p => p !== item));
                                            }}>
                                                <FontAwesome name="close" size={16} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>

                <View style={styles.dateContainer}>
                    <Button
                        type="clear"
                        title={dateButtonTitle}
                        onPress={showDatePicker}
                        buttonStyle={{
                            fontSize: 15
                        }}
                    />
                </View>
                
                <View style={styles.timeContainer}>
                    <Button
                        type="clear"
                        title={startButtonTitle}
                        onPress={showStartTimePicker}
                        buttonStyle={{
                            fontSize: 15
                        }}
                    />
                    <Button
                        type="clear"
                        title={endButtonTitle}
                        onPress={showEndTimePicker}
                        buttonStyle={{
                            fontSize: 15
                        }}
                    />
                </View>

                <Input
                    containerStyle={{paddingHorizontal: 15}}
                    autoCorrect={false}
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={(title) => setTitle(title)}
                    inputStyle={{
                        textAlign: "center"
                    }}
                />

                <TextInput 
                    style={styles.textInput}
                    placeholder="Additional details about your meeting..."
                    value={details}
                    onChangeText={(details) => setDetails(details)}
                    multiline
                    numberOfLines={10}
                />

                <Button 
                    title="Save" 
                    onPress={() => {
                            var duration = moment.duration(moment(endTime, "h:mm a").diff(moment(startTime, "h:mm a")));
                            if (title=="" || filteredPeopleList.length < 1) {
                                Alert.alert('Incomplete', 
                                'Please fill in all given fields!',
                                [ {text: 'OK'}]
                                )
                            } else if (duration <= 0) {
                                Alert.alert('Wrong duration',
                                'Please double check your start and end time!',
                                [ {text: 'OK'} ]
                                )
                            } else {
                                onSubmit(title, details, filteredPeopleList, date, moment(startTime).format('h:mm a'), moment(endTime).format('h:mm a'), parseInt(duration.asMinutes()));
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
                        paddingTop: 30
                    }}
                />
                

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                />

                <DateTimePickerModal
                    isVisible={isStartTimePickerVisible}
                    mode="time"
                    onConfirm={handleStartTimeConfirm}
                    onCancel={hideStartTimePicker}
                />

                <DateTimePickerModal
                    isVisible={isEndTimePickerVisible}
                    mode="time"
                    onConfirm={handleEndTimeConfirm}
                    onCancel={hideEndTimePicker}
                />
        </>
    )
    
}

MeetingForm.defaultProps = { // prevent initialValues from giving undefined error
    initialValues: {
        title: '',
        details: '',
        personId: [],
        date: new Date(),
        startTime: new Date(),
        endTime: new Date()
    }
};


const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginHorizontal: 10,
        paddingTop: 10
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        paddingBottom: 10
    },
    textInput: {
        height: 250, 
        borderColor: 'gray', 
        borderWidth: 1, 
        textAlignVertical: "top",
        fontSize: 16,
        padding: 10,
        paddingTop: 10,
        backgroundColor: 'white',
        marginHorizontal: 15
    },
    tag: {
        flexDirection: "row",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 20,
        marginRight: 5
    },
    innerTag: {
        padding: 10,
        flexDirection: "row"
    },
    container: {
        paddingTop: 5
    }
});

export default MeetingForm;