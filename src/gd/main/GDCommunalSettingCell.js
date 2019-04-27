import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    Switch,
    Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';
//获取窗口宽高
const {width, height} = Dimensions.get('window');

export default class GDSettingCell extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            isSwitchOn:false,
        }
    }

    static propTypes = {
        leftTitle:PropTypes.string,
        isShowSwitch:PropTypes.bool,
    }

    renderRight() {
        let component;
        if(this.props.isShowSwitch) {
            component = <Switch value={this.state.isSwitchOn} 
            onValueChange={() => {
                this.setState({
                    isSwitchOn: !this.state.isSwitchOn,
                })
            }}
            ></Switch>
        }else {
            component = <Image style={styles.img} source={{uri:'icon_cell_rightArrow'}}></Image>
        }
        return component;
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.txt}>{this.props.leftTitle}</Text>
                 {this.renderRight()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        height: Platform.OS === 'ios' ? 45 : 45,
        width:width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15,
        borderBottomWidth:0.5,
        borderBottomColor:'#eeeeee',
        backgroundColor:'white',
    },
    txt:{
        fontSize:16,
        color:'black',
    },
    img:{
        height:10,
        width:10,
    },
    switch:{

    },
});