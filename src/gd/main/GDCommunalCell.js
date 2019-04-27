import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

export default class GDCommunalCell extends React.Component {

    static propTypes = {
        img: PropTypes.string,
        title: PropTypes.string,
        mall: PropTypes.string,
        pubTime: PropTypes.string,
        fromSite: PropTypes.string,
    };

    processDate(pubTime, fromSite) {
        let minute = 1000 * 60;
        let hour = 60 * minute;
        let day = 24 * hour;
        let month = 30 * day;
        let week = 7 * day;
        let year = 365 * day;

        let now = new Date().getTime(); //获取当前时间戳
        let old = Date.parse(pubTime.replace(/-/, "/")); //转化成时间戳
        let diff = now - old;

        if (diff < 0) {
            return '刚刚';
        }

        let diffYear = diff / year;
        let diffMonth = diff / month;
        let diffWeek = diff / week;
        let diffDay = diff / day;
        let diffHour = diff / hour;
        let diffMinute = diff / minute;

        let result;

        if (diffYear >= 1) {
            result = parseInt(diffYear) + "年前";
        } else if (diffMonth >= 1) {
            result = parseInt(diffMonth) + "月前";
        } else if (diffWeek >= 1) {
            result = parseInt(diffWeek) + "周前";
        } else if (diffDay >= 1) {
            result = parseInt(diffDay) + "天前";
        } else if (diffHour >= 1) {
            result = parseInt(diffHour) + "小时前";
        } else if (diffMinute >= 1) {
            result = parseInt(diffMinute) + "分钟前";
        } else {
             result = "刚刚";
        }

        return result + ' · ' + fromSite;       // 拼接

    }

    render() {
        return (
            <View style={styles.container}>
                {/* 左侧图片 */}
                <Image source={{ uri: this.props.img === '' ? 'defaullt_thumb_250x250' : this.props.img }} style={styles.image} />
                {/* 中间文字 */}

                <View style={styles.center}>
                    <Text numberOfLines={3} style={styles.text}>{this.props.title}</Text>
                    <View style={styles.child}>
                        <Text style={styles.mall}>{this.props.mall}</Text>
                        <Text style={styles.date}>{this.processDate(this.props.pubTime, this.props.fromSite)}</Text>
                    </View>
                </View>

                {/* 左侧箭头 */}
                <Image source={{ uri: 'icon_cell_rightarrow' }} style={styles.arrow} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 110,
        width: width,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eeeeee',
        backgroundColor: 'white',
    },
    image: {
        width: 85,
        height: 85,
        marginLeft: 8,
    },

    center: {
        width: width * 0.65,
        justifyContent: 'space-around',
    },
    text: {
        width: width * 0.65,
        fontSize: 14,
        height: 60,
        textAlignVertical: 'center',
    },
    child: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mall: {
        fontSize: 12,
        color: 'green',
    },
    date: {
        fontSize: 12,
        color: 'gray',
    },
    arrow: {
        width: 10,
        height: 10,
        marginRight: 8,
    },
});