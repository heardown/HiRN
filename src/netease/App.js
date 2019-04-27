import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import RankList from './page/RankList';
import MusicList from './page/MusicList';
import MusicPlayer from './page/MusicPlayer';


const StackNavigator = createStackNavigator({
    RankList,
    MusicList,
    MusicPlayer,
}, {
    initialRouteName:'RankList',
});

const AppContainer = createAppContainer(StackNavigator);

export default AppContainer;