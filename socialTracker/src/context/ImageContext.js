import createDataContext from './createDataContext';
import socialApi from '../api/socialApi';

const imageReducer = (state, action) => {
    switch (action.type) {
        case 'set_imageUrl':
            console.log("set_imageUrl: " + action.payload);
            return action.payload;
        default:
            return state;
    }
}

const uploadImage = dispatch => async(formData) => {
    console.log("uploadImage called: " + formData);
    const response = await socialApi.post('/upload', formData, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    });
    dispatch({ type: 'set_imageUrl', payload: response.data });
}

export const {Context, Provider} = createDataContext(
    imageReducer,
    { uploadImage },
    [],
    'imageState'
);