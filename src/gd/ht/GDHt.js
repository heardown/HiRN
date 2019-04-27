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
    InteractionManager,
} from 'react-native';

import { Navigator } from 'react-native-deprecated-custom-components';
import AsyncStorage from '@react-native-community/async-storage';
import { PullList } from 'react-native-pull';


import CommunalCell from '../main/GDCommunalCell';
import CommunalDetails from '../main/GDCommunalDetails';
import NoDataView from '../main/GDNoDataView';
import CommunalNavBar from '../main/GDCommunalNavBar';

import Hot from '../ht/GDHtHalfHour'
import Search from '../main/GDSearch'


export default class GDHt extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            loaded: false,
            isModel: false,
        };
        this.data = [];
        this.fetchData = this.fetchData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    onRequestClose() {
        this.setState({
            isModel: false,
        });
    }

    fetchData(resolve) {
        let params = { 'count': 10, 'c': 'us', 'country': 'us' };
        HttpBase.post('http://guangdiu.com/api/getlist.php', params)
            .then((responseData) => {
                this.data = [];
                this.data = this.data.concat(responseData.data);
                this.setState({
                    loaded: this.state.loaded = true,
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                });

                AsyncStorage.setItem('htLastId', responseData.data[responseData.data.length - 1].id.toString());
                AsyncStorage.setItem('htFirstId', responseData.data[0].id.toString());
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }
            })

    }

    goToHot() {
        this.setState({
            isModel: true,
        })
    }

    closeModel(data) {
        this.setState({
            isModel: data,
        })
    }

    loadMore() {
        AsyncStorage.getItem('htLastId')
            .then((value) => {
                if (value !== '') {
                    this.loadMoreData(value);
                }
            })
    }

    loadMoreData(value) {
        let params = { 'count': 10, 'since': value, 'c': 'us', 'country': 'us' };
        HttpBase.post('http://guangdiu.com/api/getlist.php', params, {})
            .then((responseData) => {
                this.data = this.data.concat(responseData.data);
                this.setState({
                    loaded: this.state.loaded = true,
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                });
                AsyncStorage.setItem('htFirstId', responseData.data[0].id.toString());
                AsyncStorage.setItem('htLastId', responseData.data[responseData.data.length - 1].id.toString());
            })
    }

    onClickTitle() {
        AsyncStorage.getItem('htLastId')
            .then((value) => {
                if (value !== '') {
                    Alert.alert("htLastId => " + value);
                }
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
            <TouchableOpacity
                onPress={() => this.pushToDetail(rowData.id)}
            >
                <CommunalCell
                    img={rowData.image}
                    title={rowData.title}
                    mall={rowData.mall}
                    pubTime={rowData.pubtime}
                    fromSite={rowData.fromsite}
                />
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
                onPullRelease={(resolve) => this.fetchData(resolve)}
                style={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
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
                    visible={this.state.isModel}
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
                                removeModel={(data) => this.closeModel(data)}
                                {...route.params}
                                navigator={navigator} />
                        }}
                    >
                    </Navigator>
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