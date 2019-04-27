import React from 'react';
import { Provider } from 'react-redux';

import Index from './Index';
import configureStore from '../redux/store/store';

//调用store文件中mainReducer常量中保存的方法
const store = configureStore();

export default class Root extends React.Component {
    render() {
        return(
            //包装 让Index拿到store
            <Provider store={store}>
                <Index/>
            </Provider>
        );
    }
}