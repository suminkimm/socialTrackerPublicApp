import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Spacer from '../components/Spacer';
import {Context as AuthContext} from '../context/AuthContext';
import {SafeAreaView} from 'react-navigation';
import {FontAwesome} from '@expo/vector-icons';

const AccountScreen = () => {
    const {signout} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Button 
                title="Sign Out" 
                onPress={signout}
                buttonStyle={
                    {
                        borderRadius: 50,
                        padding: 30,
                        backgroundColor: "#4eb2f5"
                    }
                }
                containerStyle={{
                    marginHorizontal: 15
                }}
                
            />
        </View>
    )
}

AccountScreen.navigationOptions = {
    title: 'Account',
    tabBarIcon: <FontAwesome name="gear" size={20} />,
    cardStyle: {
        backgroundColor: 'white'
    },
    headerStyle: {
        backgroundColor: '#4eb2f5',
    },
    headerTitleStyle: {
        color: "white"
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        flex: 1
    }
});

export default AccountScreen;