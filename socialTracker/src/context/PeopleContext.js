import createDataContext from './createDataContext';
import socialApi from '../api/socialApi';

const peopleReducer = (state, action) => {
    switch(action.type) {
        case 'fetch_people':
            return action.payload;
        case 'view_person':
            return action.payload;
        case 'view_categories':
            return action.payload;
        case 'view_category_people':
            return action.payload;
        case 'update_person':
            var newstate = state.map((person) => {
                if (person._id === action.payload._id) {
                    return action.payload;
                } else {
                    return person;
                }
            });
            return newstate;
        case 'delete_person':
            return state.filter(p => p._id !== action.payload._id);
        default:
            return state;
    }
}

const fetchPeople = dispatch => async() => {
    try {
        const response = await socialApi.get('/people');
        dispatch({ type: 'fetch_people', payload: response.data });
    } catch (err) {
        console.error(err);
    }
    
} 

const createPerson = dispatch => async(firstname, lastname, imageUrl, category) => {
    await socialApi.post('/people', {firstname, lastname, imageUrl, category});
}

const updatePerson = dispatch => async(personId, firstname, lastname, imageUrl, category, callback) => {
    const response = await socialApi.put(`/people/${personId}`, {firstname, lastname, imageUrl, category});
    dispatch({ type: 'update_person', payload: response.data });
    if (callback) {
        callback();
    }
}

const viewPerson = dispatch => async(personId) => {
    const response = await socialApi.get(`/people/${personId}`);
    dispatch({ type: 'view_person', payload: response.data });
}

const viewCategoryPeople = dispatch => async(categoryName) => {
    const response = await socialApi.get(`/people/category/${categoryName}`);
    dispatch({ type: 'view_category_people', payload: response.data });
}

const deletePerson = dispatch => async(personId, callback) => {
    const response = await socialApi.delete(`/people/${personId}`);
    dispatch({ type: 'delete_person', payload: response.data });
    if (callback) {
        callback();
    }
}

export const {Context, Provider} = createDataContext(
    peopleReducer,
    { fetchPeople, createPerson, updatePerson, viewPerson, viewCategoryPeople, deletePerson },
    [],
    'peopleState'
); 