
import Reducer from '../reducer/reducer';
import { createStore } from 'redux';

export default () => {
    //根据reducer初始化store
    const store = createStore(Reducer);
    return store;
}