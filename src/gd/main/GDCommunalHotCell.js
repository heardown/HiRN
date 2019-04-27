import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');

export default class GDCommunalHotCell extends React.Component {

    static propTypes = {
        img:PropTypes.string,
        title:PropTypes.string,
    };

    render() {
        return (
            <View style={styles.container}>
                {/* 左侧图片 */}
                <Image source={{uri:this.props.img === '' ? 'defaullt_thumb_250x250' : this.props.img}} style={styles.image}/>
                {/* 中间文字 */}
             
                 <Text numberOfLines={3} style={styles.text}>{this.props.title}</Text>
                
                {/* 左侧箭头 */}
                <Image source={{uri:'icon_cell_rightarrow'}} style={styles.arrow}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height:120,
        width:width,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eeeeee',
        backgroundColor: 'white',
    },
    image:{
        width:90,
        height:90,
        marginLeft:8,
    },
    text:{
        width:width * 0.65,
        fontSize:14,
    },
    arrow:{
        width:10,
        height:10,
        marginRight:8,
    },
});