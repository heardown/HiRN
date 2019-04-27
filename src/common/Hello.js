import React from 'react';
import {
    View,
    Text,
} from 'react-native';

export default class Hello extends React.Component{
    render(){
        return(
            <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:30, color:'black'}}>Hello, World!</Text>
                <Text style={{fontSize:32, color:'green', marginTop:10}}>Welcome to React Native!</Text>
            </View>
        );
    }
}