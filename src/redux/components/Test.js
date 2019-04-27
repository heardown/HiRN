import React from 'react';
import { Text, View } from 'react-native';

export default class Test extends React.Component{
    render(){
        //获取props中的value
        const {value1, value2} = this.props;
        return(
            <View>
                <Text style={{fontSize:30, color:'black'}}>{value1}</Text>
                <Text style={{fontSize:32, color:'green', marginTop:10}}>{value2}</Text>
            </View>
        );
    }
}