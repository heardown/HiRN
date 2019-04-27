import React from 'react';
import { DeviceEventEmitter, Dimensions, Image, ListView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import {PullList} from 'react-native-pull';
import CommunalNavBar from '../main/GDCommunalNavBar';
import NoDataView from '../main/GDNoDataView';

import AsyncStorage from '@react-native-community/async-storage';
import CommunalDetails from '../main/GDCommunalDetails';
import CommunalCell from '../main/GDCommunalCell';

const { width, height } = Dimensions.get('window');   // 获取屏幕尺寸
const dismissKeyboard = require('dismissKeyboard');  // 获取键盘回收方法

export default class GDSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false,
        };
        this.data = [];
        this.changeText = ''; //改变后的文本
        this.loadData = this.loadData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    load() {
        if (!this.changeText) {
            return;
        }

        let params = {
            'q': this.changeText,
        }
        HttpBase.get('http://guangdiu.com/api/getresult.php', params)
            .then((responseData) => {
                //清空数组
                this.data = [];
                this.data = this.data.concat(responseData.data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded: true,
                });
                //存储数组中最后一个元素的id
                let searchLastId = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('searchLastId', searchLastId.toString());

            })
            .catch((error) => {

            })
    }
    /**
     * 加载最新数据
     */
    loadData(resolve) {
        if (!this.changeText) {
            return;
        }

        let params = {
            'q': this.changeText,
        }

        HttpBase.get('http://guangdiu.com/api/getresult.php', params)
            .then((responseData) => {
                //清空数组
                this.data = [];
                this.data = this.data.concat(responseData.data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded: true,
                });

                //关闭刷新动画
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }

                //存储数组中最后一个元素的id
                let searchLastId = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('searchLastId', searchLastId.toString());

            })
            .catch((error) => {
                console.log(error)
            })
    }

    loadMore() {
        //取最后id
        AsyncStorage.getItem('searchLastId')
            .then((value) => {
                //加载更多
                this.loadMoreData(value);
            });
    }

    loadMoreData(value) {
     
        if (!this.changeText) {
            return;
        }

        let params = {
            'q': this.changeText,
            'since': value,
        }
        HttpBase.get('http://guangdiu.com/api/getresult.php', params)
            .then((responseData) => {
                //清空数组
                this.data = this.data.concat(responseData.data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded: true,
                });

                //存储数组中最后一个元素的id
                let searchLastId = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('searchLastId', searchLastId.toString());

            })
            .catch((error) => {

            })
    }

    /**
     * 返回
     */
    popTop() {
        dismissKeyboard(); //关闭键盘
        this.props.navigator.pop();
    }

    /**
     * 跳转详情页
     * @param {id} value 
     */
    popToDetail(value) {
        this.props.navigator.push({
            component: CommunalDetails,
            params: {
                url: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value,
            }
        });
    }

    renderTitleItem() {
        return (
            <TouchableOpacity>
                <Text style={styles.navBarTitle}>搜索全网折扣</Text>
            </TouchableOpacity>
        );
    }

    renderRightItem() {
        return (
            <TouchableOpacity
                onPress={() => { this.popTop() }}
            >
                <Text style={styles.navBarRight}>返回</Text>
            </TouchableOpacity>
        );
    }



    renderListView() {
        if (this.state.loaded === false) {
            return (
                <NoDataView />
            );
        }
        return (
            <PullList
                onPullRelease={(resolve) => this.loadData(resolve)}
                style={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                initialListSize={6}
                showHorizontalScrollIndicator={false}
                renderFooter={this.renderFooter}
                onEndReached={this.loadMore}
                onEndReachedThreshold={60}
            />
        );
    }

    renderListFooter() {
        return (
            <View
                style={{ height: 50, width: width, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
            >
                <ActivityIndicator />
                <Text>{'  ' + 'Loading' + '  '}</Text>
            </View>
        );
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight
                onPress={() => this.pushToDetail(rowData.id)}
            >
                <CommunalCell
                    img={rowData.image}
                    title={rowData.title}
                    pubTime={rowData.pubtime}
                    mall={rowData.mall}
                    fromSite={rowData.fromsite}
                />
            </TouchableHighlight>

        );
    }



    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
                    titleItem={() => this.renderTitleItem()}
                    leftItem={() => this.renderRightItem()}
                />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 55,
                    width: width,
                    alignItems: 'center',
                    borderBottomColor: '#eeeeee',
                    borderTopColor: '#eeeeee',
                    borderTopWidth: 0.5,
                    borderBottomWidth: 0.5,
                    backgroundColor: 'white',
                }}>
                    <View
                        style={{
                            width: width * 0.8,
                            height: 36,
                            marginLeft: 10,
                            alignItems: 'center',
                            backgroundColor: '#eeeeee',
                            flexDirection: 'row',
                        }}>
                        <Image source={{ uri: 'search_icon_20x20' }} style={{ width: 15, height: 15, marginLeft: 8, }} />
                        <TextInput
                            style={{
                                flex: 1,
                                height: 36,
                                paddingLeft: 8,
                                borderRadius: 5,
                                color: 'black',
                                fontSize: 16,
                            }}
                            keyboardType="default"
                            placeholder='请输入搜索商品关键字'
                            placeholderTextColor='gray'
                            autoFocus={true}
                            clearButtonMode="while-editing"
                            onChangeText={(text) => this.changeText = text}
                            onEndEditing={() => this.loadData()}
                            underlineColorAndroid={'transparent'}
                        ></TextInput>
                    </View>
                    <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        onPress={() => this.popTop()}
                    >
                        <Text style={{
                            fontSize: 18,
                            color: 'black',
                        }}>取消</Text>
                    </TouchableOpacity>
                </View>

                {this.renderListView()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },

    navBarTitle: {
        fontSize: 18,
        color: 'black',
        marginRight: 45,
    },

    navBarRight: {
        fontSize: 16,
        color: 'green',
        marginLeft: 15,
    },

    header: {
        height: 40,
        width: width,
        fontSize: 14,

        textAlign: 'center',
        textAlignVertical: 'center',
    },
    list: {
        flex: 1,
        width: width,
    },
});