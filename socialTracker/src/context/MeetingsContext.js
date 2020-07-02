import createDataContext from './createDataContext';
import socialApi from '../api/socialApi';

const meetingsReducer = (state, action) => {
    switch (action.type) {
        case'fetch_meetings':
            return action.payload;
        case 'view_meeting':
            return action.payload;
        case 'view_person_meetings':
            return action.payload;
        case 'update_meetings_after_person_delete':
            return action.payload;
        default:
            return state;
    }
}

const fetchMeetings = dispatch => async() => {
    try {
        const response = await socialApi.get('/meetings');
        dispatch({ type: 'fetch_meetings', payload: response.data });
    } catch (err) {
        console.error(err);
    }
}

const createMeeting = dispatch => async(title, details, personId, date, startTime, endTime, totalTime) => {
    await socialApi.post('/meetings', {title, details, personId, date, startTime, endTime, totalTime});
}

const viewMeeting = dispatch => async(meetingId) => {
    const response = await socialApi.get(`/meetings/${meetingId}`);
    dispatch({ type: 'view_meeting', payload: response.data });
}

const viewPersonMeetings = dispatch => async(personId) => {
    const response = await socialApi.get(`/people/${personId}/meetings`);
    dispatch({ type: 'view_person_meetings', payload: response.data });
}

const updateMeetingsAfterPersonDelete = dispatch => async(personId) => {
    const response = await socialApi.delete(`/people/${personId}/meetings`);
    dispatch({ type: 'update_meetings_after_person_delete', payload: response.data });
}

export const {Context, Provider} = createDataContext(
    meetingsReducer,
    { fetchMeetings, createMeeting, viewMeeting, viewPersonMeetings, updateMeetingsAfterPersonDelete },
    [],
    'meetingState'
);