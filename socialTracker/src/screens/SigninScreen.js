import React, {useContext} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Context as AuthContext} from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const SigninScreen = () =>  {

    const {state, signin, clearErrorMessage} = useContext(AuthContext);

    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
            <View style={styles.container}>
                <NavigationEvents 
                    onWillFocus={clearErrorMessage}
                />
                <AuthForm
                    headerText="Sign In"
                    errorMessage={state.errorMessage}
                    submitButtonText="Sign In"
                    onSubmit={signin} // pass in {email, password}
                    buttonColor="#4eb2f5"
                />
            </View>
        </View>
    )
}

SigninScreen.navigationOptions = () => {
    return {
        title: '',
        headerBackTitle: "Back"
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 170 // shift content up
    }
});

export default SigninScreen;