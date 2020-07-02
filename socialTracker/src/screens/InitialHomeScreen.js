import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Spacer from '../components/Spacer';

const InitialHomeScreen = ({navigation}) =>  {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.textContainer}>
                <Text h1 style={styles.text}>SocialTracker</Text>
                <Text style={{fontSize: 18}}>Manage your social time</Text>
            </View>
            
            <View style={styles.container}>
                <Spacer>
                    <Button 
                        buttonStyle={
                            {
                                borderRadius: 50,
                                padding: 20,
                                backgroundColor: "#4eb2f5"
                            }
                        }
                        containerStyle={{
                            marginHorizontal: 15
                        }}
                        titleStyle={{
                            fontSize: 20
                        }}
                        title="Sign In" 
                        onPress={() => navigation.navigate('Signin')}
                    />
                </Spacer>
                <Spacer>
                    <Button 
                        buttonStyle={
                            {
                                borderRadius: 50,
                                padding: 20,
                                backgroundColor: '#63dbaf'
                            }
                        }
                        containerStyle={{
                            marginHorizontal: 15
                        }}
                        titleStyle={{
                            fontSize: 20
                        }}
                        title="Sign Up" 
                        onPress={() => navigation.navigate('Signup')}
                    />
                </Spacer>
            </View>
        </View>
    )
};

InitialHomeScreen.navigationOptions = () => {
    return {
        headerShown: false,
        headerBackTitle: "Back"
    };
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white"
    },
    text: {
        textAlign: "center",
        fontWeight: "bold"
    },
    textContainer: {
        marginTop: 250,
        alignItems: 'center'
    },
    container: {
        justifyContent: "flex-end",
        flex: 1,
        marginBottom: 60,
        
    }
});

export default InitialHomeScreen;