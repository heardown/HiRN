
import React, { Component } from 'react';
import { Platform } from 'react-native';

import Main from './main/GDMain';
import Launch from '..main/GDLaunchPage';
import { Navigator } from 'react-native-deprecated-custom-components';

/* 
 * 逛丢程序入口
 */
export default class App extends Component {

    render() {
        return (
            Platform.OS === 'ios' ? <Main /> : <Navigator
                initialRoute={{
                    name: 'launch',
                    component: Launch,
                }}
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    return <Component {...route.params} navigator={navigator} />;
                }}
            />
        );
    }
}

