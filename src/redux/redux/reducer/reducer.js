import { CHANGE_TEXT, changeText } from '../action/action';


const mainReducer = (state = changeText('Hello, Wrold!', 'Welcome to React Native'), action) => {
    const newState = state;
    const text1 = action.text1;
    const text2 = action.text2;

    switch (action.type) {
        case CHANGE_TEXT:
            return {
                ...newState,
                text1: '改变了' + text1,
                text2: '改变了' + text2,
            };

        default:
            return {
                ...newState,
                text1: newState.text1,
                text2: newState.text2,
            };
    }
}

export default mainReducer;
