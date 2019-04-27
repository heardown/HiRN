import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

export default class GDCommunalNavBar extends Component {

    static propTypes = {
        leftItem: PropTypes.func,
        titleItem: PropTypes.func,
        rightItem: PropTypes.func,
    };

    renderLeftItem() {
        if (this.props.leftItem === undefined) {
            return;
        }
        return this.props.leftItem();
    }

    rendrTitleItem() {
        if (this.props.titleItem === undefined) {
            return;
        }
        return this.props.titleItem();
    }

    renderRightItem() {
        if (this.props.rightItem === undefined) {
            return;
        }
        return this.props.rightItem();
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 左侧 */}
                <View>
                    {this.renderLeftItem()}
                </View>
                {/* 中间 */}
                <View>
                    {this.rendrTitleItem()}
                </View>
                {/* 右侧 */}
                <View>
                    {this.renderRightItem()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: Platform.OS === 'android' ? 50 : 64,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eeeeee',
        paddingTop:Platform.OS === 'ios' ? 14 : 0,
    }
});