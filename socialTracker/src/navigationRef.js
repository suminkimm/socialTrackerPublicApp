import {NavigationActions} from 'react-navigation';

let navigator;

// make navigator available to other files
export const setNavigator = (nav) => { // nav comes from react-navigation
    navigator = nav;
};

export const navigate = (routeName, params) => {
    navigator.dispatch( // change state and show different screen to user
        NavigationActions.navigate({
            routeName,
            params
        })
    );
};