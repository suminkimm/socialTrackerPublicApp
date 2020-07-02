import React, {useContext, useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, SearchBar, ListItem, Card, Button } from 'react-native-elements';
import {Context as PeopleContext} from '../context/PeopleContext';
import {Context as CategoryContext} from '../context/CategoryContext';
import {Context as MeetingsContext} from '../context/MeetingsContext';
import { LinearGradient } from 'expo-linear-gradient';


const SearchScreen = ({navigation}) =>  {

    const [query, setQuery] = useState('');
    const [filteredPeopleList, setFilteredPeopleList] = useState(peopleState);

    const {peopleState, fetchPeople} = useContext(PeopleContext);
    const {categoryState, viewCategories} = useContext(CategoryContext);
    const {meetingState, fetchMeetings} = useContext(MeetingsContext);

    const colorsArray = ['#71C1F7', '#3dabf5', '#35a0e6', '#3E8EC4', '#32729D', '#285B7E']


    useEffect(() => {
        fetchPeople(); // 1st time we show screen
        viewCategories();
        fetchMeetings();

        const listener = navigation.addListener('didFocus', () => { // refresh every time we return to the screen
            fetchPeople();
            viewCategories();
            fetchMeetings();
        });

        setFilteredPeopleList(peopleState);

        return () => { // clean up to prevent memory leak
            listener.remove();
        }
    }, []);


    useEffect(() => {
        const lowerCaseQuery = query.toLowerCase();
        const newPeople = peopleState
            .filter((person) => (person.firstname.toLowerCase().includes(lowerCaseQuery) || person.lastname.toLowerCase().includes(lowerCaseQuery)))
            .map((person) => ({
                ...person,
                rank: person.firstname.toLowerCase().indexOf(lowerCaseQuery)
            }))
            .sort((a, b) => a.rank - b.rank);

        setFilteredPeopleList(newPeople);
      }, [query]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
            <SearchBar
                placeholder="Search for people"
                onChangeText={setQuery}
                value={query}
                lightTheme
                round
                containerStyle={{
                    backgroundColor: 'transparent',
                    borderBottomColor: 'transparent',
                    borderTopColor: 'transparent',
                    paddingHorizontal: 15,
                    paddingBottom: 15
                }}
            />
            { query == '' 
                ? <View>
                    <FlatList 
                        scrollEnabled
                        keyExtractor={item => item}
                        data={categoryState}
                        renderItem={({ item, index }) => {
                            return <View style={{paddingHorizontal: 15, paddingVertical: 13}}>
                                <Button
                                    buttonStyle={
                                        {
                                            borderRadius: 50,
                                            padding: 17, 
                                            backgroundColor: colorsArray[index]
                                        }
                                    }
                                    textStyle={{
                                        color: "white"
                                    }}
                                    title={item}
                                    onPress={() => {
                                        navigation.navigate('Category', {category: item});
                                    }}
                                />
                            </View>
                        }}
                    />
                </View>
                : <FlatList
                    scrollEnabled
                    keyExtractor={item => item._id}
                    data={filteredPeopleList}
                    renderItem={({ item }) => {
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
                />
            }
            
        </SafeAreaView>
    )
}

SearchScreen.navigationOptions = () => {
    return {
        headerShown: false
    };
}

export default SearchScreen;