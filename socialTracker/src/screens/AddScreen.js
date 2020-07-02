import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {Text, Button} from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

const AddScreen = ({navigation}) => {
    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
            <View style={styles.container}>
                <Button
                    buttonStyle={
                        {
                            borderRadius: 50,
                            padding: 30,
                            backgroundColor: "#4eb2f5",
                            borderWidth: 0
                        }
                    }
                    containerStyle={{
                        marginHorizontal: 15
                    }}
                    icon={
                        <Ionicons name="ios-people" size={30} color="white" />
                    }
                    title="New Meeting" 
                    titleStyle={{
                        marginLeft: 10,
                        fontSize: 20
                    }}
                    onPress={() => navigation.navigate('AddMeeting')}
                /> 

                <Button 
                    buttonStyle={
                        {
                            borderRadius: 50,
                            padding: 30,
                            backgroundColor: "#4eb2f5",
                            borderWidth: 0
                        }
                    }
                    containerStyle={{
                        marginHorizontal: 15
                    }}
                    icon={<Ionicons name="md-person" size={24} color="white" />}
                    title="New Person" 
                    titleStyle={{
                        marginLeft: 10,
                        fontSize: 20
                    }}
                    onPress={() => navigation.navigate('AddPerson')}
                />

                <Button 
                    buttonStyle={
                        {
                            borderRadius: 50,
                            padding: 30,
                            backgroundColor: "#63dbaf",
                            borderWidth: 0
                        }
                    }
                    containerStyle={{
                        marginHorizontal: 15
                    }}
                    title="Manage Categories" 
                    titleStyle={{
                        fontSize: 20
                    }}
                    onPress={() => navigation.navigate('ManageCategories')}
                />
            </View>
        </View>
            
    )
}

AddScreen.navigationOptions = () => {
    return {
        headerShown: false
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 100,
        justifyContent: 'space-evenly',
        flexDirection: "column",
        flex: 1
    }
});


export default AddScreen;