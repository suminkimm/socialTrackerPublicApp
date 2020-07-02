import createDataContext from './createDataContext';
import socialApi from '../api/socialApi';


const categoryReducer = (state, action) => {
    switch(action.type) {
        case 'view_categories':
            return action.payload;
        case 'update_categories':
            return action.payload;
        default:
            return state;
    }
}

const viewCategories = dispatch => async() => {
    const response = await socialApi.get('/categories');
    dispatch({ type: 'view_categories', payload: response.data });
}

const updateCategories = dispatch => async(categories) => {
    const response = await socialApi.put('/categories', {categories});
    dispatch({ type: 'update_categories', payload: response.data });
}

const movePeopleToNewCategory = dispatch => async(oldCategory, newCategory) => {
    if (newCategory == "Delete everyone") {
        await socialApi.delete(`/categories/${oldCategory}/${newCategory}`);
    }
    else {
        console.log("sending put request");
        await socialApi.put(`/categories/${oldCategory}/${newCategory}`);
        console.log("finished put request");
    }
}

export const {Context, Provider} = createDataContext(
    categoryReducer,
    { viewCategories, updateCategories, movePeopleToNewCategory },
    [],
    'categoryState'
); 