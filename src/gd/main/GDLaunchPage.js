import React from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

import Main from './GDMain';

const {width, height} = Dimensions.get('window');

export default class GDLaunchPage extends React.Component{

    componentDidMount(){
        
        setTimeout(() => {
            this.props.navigator.replace({
                component:Main,

            });
        }, 500);
    }
    
    render(){
        return(
            <Image
                source={{uri:'launchimage'}}
                style={styles.launch}
            ></Image>
        );
    }
}

const styles = StyleSheet.create({
    launch:{
        
        width:width,
        height:height,
    }
});