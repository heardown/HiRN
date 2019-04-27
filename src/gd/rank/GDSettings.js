import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import CommunalNavBar from '../main/GDCommunalNavBar';
import SettingCell from '../main/GDCommunalSettingCell';

export default class GDSettings extends React.Component{

    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    renderLeftItem() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigator.pop();
                }}
            >
                <Text style={{color:'black', fontSize:16, marginLeft:10}}>关闭</Text>
            </TouchableOpacity>
        );
    }

    renderTitleItem() {
        return (
            <Text style={{color:'black', fontSize:18}}>设置</Text>
        );
    }

    render() {
        return(
            <View style={styles.container}>
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}
                />
                <SettingCell 
                    leftTitle={'快捷下单'}
                    isShowSwitch={true}
                />
                <SettingCell
                     leftTitle={'清除缓存'}
                     isShowSwitch={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f5f5f5',
    },
})