import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Context as AuthContext} from '../context/AuthContext';
import {NavigationEvents} from 'react-navigation';
import AuthForm from '../components/AuthForm';
import { LinearGradient } from 'expo-linear-gradient';


const SignupScreen = () => {

    const {state, signup, clearErrorMessage, tryLocalSignin} = useContext(AuthContext);

    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
            <View style={styles.container}>
                <NavigationEvents 
                    onWillFocus={clearErrorMessage}
                />
                <AuthForm
                    headerText="Sign Up"
                    errorMessage={state.errorMessage}
                    submitButtonText="Sign Up"
                    onSubmit={signup} // pass in {email, password}
                    buttonColor="#63dbaf"
                />
            </View>
        </View>
        
    );
}

SignupScreen.navigationOptions = () => {
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

export default SignupScreen;