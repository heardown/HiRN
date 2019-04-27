import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    Modal,
    Alert,
    TouchableHighlight,
    DeviceEventEmitter,
    InteractionManager,
    Animated,
} from 'react-native';

import { Navigator } from 'react-native-deprecated-custom-components';
import AsyncStorage from '@react-native-community/async-storage';
import { PullList } from 'react-native-pull';


import CommunalCell from '../main/GDCommunalCell';
import CommunalDetails from '../main/GDCommunalDetails';
import NoDataView from '../main/GDNoDataView';
import CommunalNavBar from '../main/GDCommunalNavBar';

import Hot from '../home/GDHalfHour'
import Search from '../main/GDSearch'
import CommunalSiftMenu from '../main/CommunalSiftMenu';

//引入数据
import HomeSiftData from '../data/HomeSiftData.json';


export default class GDHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            loaded: false,
            isHalfHourHotModal: false,
            isSiftModal: false,
        };
        this.data = [];
        this.fetchData = this.fetchData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    static defaultProps = {
        loadDataNumber: {},  //回调
    }

    componentDidMount() {
        this.fetchData();
        this.subscription = DeviceEventEmitter.addListener('homeEvent', () => {
            this.scrollToTop();
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    scrollToTop() {
       let list = this.refs.pullList;
       if(list.scroll.scrollProperties.offset > 0) { 
           //不在顶部
            list.scrollTo({y:0});
       }else { //在顶部  刷新
            // list.renderTopIndicator();
            // list.state.pullPan = new Animated.ValueXY({x: 0, y: this.topIndicatorHeight * -1});
            // this.fetchData();
            // //关闭动画
            // setTimeout(() => {
            //     list.resetDefaultXYHandler();
            // }, 1000);
        }
    }

    onRequestClose() {
        this.setState({
            isHalfHourHotModal: false,
            isSiftModal: false,
        });
    }

    loadDataNumber() {
        this.props.loadDataNumber();
    }

    goToHot() {
        this.setState({
            isHalfHourHotModal: true,
        })
    }

    onClickTitle() {
        this.setState({
            isSiftModal: true,
        });
    }

    pushToDetail(value) {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: CommunalDetails,
                params: {
                    url: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
                }
            })
        });
    }

    closeModal(data) {
        this.setState({
            isHalfHourHotModal: data,
            isSiftModal: data,
        })
    }

    fetchData(resolve) {
        let params = { 'count': 10 };
        HttpBase.post('http://guangdiu.com/api/getlist.php', params, {})
            .then((responseData) => {
                this.data = [];
                this.data = this.data.concat(responseData.data);
                this.setState({
                    loaded: this.state.loaded = true,
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                });

                AsyncStorage.setItem('homeLastId', responseData.data[responseData.data.length - 1].id.toString());
                AsyncStorage.setItem('homeFirstId', responseData.data[0].id.toString());
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }

                // 获取最新数据个数
                this.loadDataNumber();
            })
    }

    /**
     * 加载筛选数据
     * @param {*} mall 
     * @param {*} cate 
     */
    loadSiftData(mall, cate) {
        let params = [];
        if (mall === '' && cate === '') {
            this.fetchData();
            return;
        }

        if (mall === '') {
            params = {
                'cate': cate,
            }
        } else {
            params = {
                'mall': mall,
            }
        }

        HttpBase.get('https://guangdiu.com/api/getlist.php', params)
            .then((responseData) => {
                this.data = [];
                this.data = this.data.concat(responseData.data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded: true,
                });

                // 存储数组中最后一个元素的id
                let homeLastID = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('homeLastID', homeLastID.toString());
            })
    }

    loadMore() {
        AsyncStorage.getItem('hometLastId')
            .then((value) => {
                if (value !== '') {
                    this.loadMoreData(value);
                }
            })
    }

    loadMoreData(value) {
        let params = { 'count': 10, 'since': value };
        HttpBase.post('http://guangdiu.com/api/getlist.php', params, {})
            .then((responseData) => {
                this.data = this.data.concat(responseData.data);
                this.setState({
                    loaded: this.state.loaded = true,
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                });
                AsyncStorage.setItem('homeFirstId', responseData.data[0].id.toString());
                AsyncStorage.setItem('homeLastId', responseData.data[responseData.data.length - 1].id.toString());
            })
    }


    renderFooter() {
        return (
            <View style={{ height: 50, flexDirection: 'row', backgroundColor: '#eeeeee', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
                <Text style={{ marginLeft: 15, fontWeight: 'bold' }}>Loading</Text>
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
                    mall={rowData.mall}
                    pubTime={rowData.pubtime}
                    fromSite={rowData.fromsite}
                />
            </TouchableHighlight>

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
                ref='pullList'
                onPullRelease={(resolve) => this.fetchData(resolve)}
                style={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                initialListSize={6}
                showHorizontalScrollIndicator={false}
                onEndReached={this.loadMore}
                onEndReachedThreshold={60}
                renderFooter={this.renderFooter}
            />
        );
    }


    renderLeftItem() {
        return (
            <TouchableOpacity
                onPress={() => this.goToHot()}
            >
                <Image source={{ uri: 'hot_icon_20x20' }} style={styles.navBarLeft} />
            </TouchableOpacity>
        );
    }



    renderTitleItem() {
        return (
            <TouchableOpacity
                onPress={() => this.onClickTitle()}
            >
                <Image source={{ uri: 'navtitle_home_down_66x20' }} style={styles.navBarTitle} />
            </TouchableOpacity>
        );
    }

    renderRightItem() {
        return (
            <TouchableOpacity
                onPress={() => {
                    InteractionManager.runAfterInteractions(() => {
                        this.props.navigator.push({
                            component: Search,
                        })
                    });
                }}
            >
                <Image source={{ uri: 'search_icon_20x20' }} style={styles.navBarRight} />
            </TouchableOpacity>
        );
    }



    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={this.state.isHalfHourHotModal}
                    onRequestClose={() => this.onRequestClose()}
                >
                    <Navigator
                        initialRoute={{
                            name: 'Hot',
                            component: Hot,
                        }}
                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            return <Component
                                removeModal={(data) => this.closeModal(data)}
                                {...route.params}
                                navigator={navigator} />
                        }}
                    >
                    </Navigator>
                </Modal>
                {/* 初始化筛选菜单 */}
                <Modal
                    pointerEvents={'box-none'}
                    animationType='none'
                    transparent={true}
                    visible={this.state.isSiftModal}
                    onRequestClose={() => this.onRequestClose()}
                >
                    <CommunalSiftMenu
                        removeModal={(data) => this.closeModal(data)}
                        data={HomeSiftData}
                        loadSiftData={(mall, cate) => this.loadSiftData(mall, cate)}
                    />
                </Modal>
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                />

                {this.renderListView()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    navBarLeft: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },

    navBarTitle: {
        width: 60,
        height: 20,
    },

    navBarRight: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
});