import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import CommunalNavBar from './GDCommunalNavBar';

export default class GDCommunalDeatils extends React.Component {

    static propTypes = {
        url: PropTypes.string,
    }


    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    pop() {
        this.props.navigator.pop();
    }

    renderLeftTitle() {
        return (
            <TouchableOpacity onPress={() => { this.pop() }}>
                <Text style={{marginLeft:10}}>返回</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏 */}

                <CommunalNavBar
                    leftItem={() => this.renderLeftTitle()}
                />
                {/* WebView */}
                <WebView
                    style={styles.web}
                    source={{ uri: this.props.url, method: 'GET' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                ></WebView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    web: {
        flex: 1
    }
});