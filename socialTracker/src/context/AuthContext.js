import {AsyncStorage} from 'react-native';
import createDataContext from './createDataContext';
import socialApi from '../api/socialApi';
import {navigate} from '../navigationRef';

const authReducer = (state, action) => { // return new state value
    switch (action.type) {
        case 'add_error':
            return {...state, errorMessage: action.payload};
        case 'signin':
            return {errorMessage: '', token: action.payload};
        case 'clear_error_message':
            return {...state, errorMessage:''}
        case 'signout':
            return {token: null, errorMessage: ''}
        default:
            return state;
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' });
}

const tryLocalSignin = dispatch => async() => { 
    const token = await AsyncStorage.getItem('token');
    if (token) {
        dispatch({ type: 'signin', payload: token });
        navigate('Dashboard');
    } else {
        console.log("no token");
        navigate('loginFlow');
    }
}

const signup = (dispatch) => { // get access to dispatch from createDataContext
    return async ({email, password}) => {
        try {
            const response = await socialApi.post('/signup', {email, password});
            await AsyncStorage.setItem('token', response.data.token);
            dispatch({ type: 'signin', payload: response.data.token });
            navigate('Dashboard');
        } catch (err) {
            dispatch({ type: 'add_error', payload: 'Something went wrong with sign up' });
            console.log(err.message);
        }
    };
};

const signin = dispatch => async ({email, password}) => { // same thing as signup function above
    try {
        const response = await socialApi.post('/signin', {email, password});
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ type: 'signin', payload: response.data.token });
        navigate('Dashboard');
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign in' });
    }
};


const signout = (dispatch) => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'signout' });
    navigate('loginFlow');
};

export const { Provider, Context } = createDataContext( // make available to other screens
    authReducer,
    { signup, signin, signout, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage: '' },
    'state'
);