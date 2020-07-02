import React, {useReducer} from 'react';

export default (reducer, actions, defaultValue, name) => {
    const Context = React.createContext();

    const Provider = ({children}) => {
        const [state, dispatch] = useReducer(reducer, defaultValue);
        

        var providerValue = {};
        providerValue[name] = state;

        const boundActions = {}; // used to change our state
        for (let key in actions) {
            boundActions[key] = actions[key](dispatch);
            providerValue[key] = boundActions[key];
        }


        return (
            // <Context.Provider value={console.log({name:state, ...boundActions})}>
            <Context.Provider value={providerValue}>
                {children}
            </Context.Provider>
        );
    };

    return { Context, Provider };
};