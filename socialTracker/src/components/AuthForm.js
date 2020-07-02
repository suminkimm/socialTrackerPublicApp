import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Spacer from './Spacer';

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText, buttonColor }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Spacer>
                <Text h3 style={{fontWeight: "bold"}}>{headerText}</Text>
            </Spacer>
            <Spacer/>
            <Input 
                autoCapitalize="none"
                autoCorrect={false}
                label="Email" 
                value={email} 
                onChangeText={setEmail}
            />
            <Spacer />
            <Input 
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                label="Password" 
                value={password} 
                onChangeText={setPassword}
            />
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            <Spacer/>
            <Spacer>
                <Button 
                    buttonStyle={
                        {
                            borderRadius: 50,
                            padding: 20,
                            backgroundColor: buttonColor
                        }
                    }
                    titleStyle={{
                        fontSize: 20
                    }}
                    title={submitButtonText} 
                    onPress={() => onSubmit({email, password})}
                />
            </Spacer>
        </View>
    );
};

const styles = StyleSheet.create({
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15
    },
    container: {
        marginHorizontal: 15
    }
});

export default AuthForm;