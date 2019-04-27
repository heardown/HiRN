import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ListView,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

import { Navigator } from 'react-native-deprecated-custom-components';
import AsyncStorage from '@react-native-community/async-storage';
import { PullList } from 'react-native-pull';

import CommunalDetails from '../main/GDCommunalDetails';
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalHotCell from '../main/GDCommunalHotCell';
import NoDataView from '../main/GDNoDataView';

const { width, height } = Dimensions.get('window');

export default class GDHt extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            loaded: false,
        };
        this.fetchData = this.fetchData.bind(this);
    }

    static defaultProps = {
        removeModal: {}
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    popTop(data) {
        // this.props.navigator.pop();
        this.props.removeModal(data);
    }

    fetchData(resolve) {
        // setTimeout(() => {
        //     fetch('http://guangdiu.com/api/gethots.php')
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         this.setState({
        //             loaded:this.state.loaded=true,
        //             dataSource: this.state.dataSource.cloneWithRows(responseData.data),
        //         });

        //         if(resolve !== undefined) {
        //             setTimeout(() => {
        //                 resolve();
        //             }, 2000);
        //         }
        //     })
        //     .done();
        // });

        HttpBase.get('http://guangdiu.com/api/gethots.php')
            .then((responseData) => {
                this.setState({
                    loaded: this.state.loaded = true,
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                });

                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }
            });
    }

    
    pushToDetail(value) {
        this.props.navigator.push({
            component: CommunalDetails,
            params: {
                url: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
            }
        })
    }

    renderTitleItem() {
        return (
            <TouchableOpacity>
                <Text style={styles.navBarTitle}>近半小时热门</Text>
            </TouchableOpacity>
        );
    }

    renderRightItem() {
        return (
            <TouchableOpacity
                onPress={() => { this.popTop(false) }}
            >
                <Text style={styles.navBarRight}>关闭</Text>
            </TouchableOpacity>
        );
    }

    renderRow(rowData) {
        return (
            <TouchableOpacity
                onPress={() => this.pushToDetail(rowData)}
            >
                <CommunalHotCell
                    img={rowData.image}
                    title={rowData.title}
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
                renderHeader={this.renderHeader}
            />
        );
    }

    renderHeader() {
        return (
            <Text style={styles.header}>根据每条折扣的点击进行统计，每5分钟更新一次</Text>
        );
    }



    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
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

    navBarTitle: {
        fontSize: 15,
        color: 'black',
        marginLeft: 45,
    },

    navBarRight: {
        fontSize: 15,
        color: 'green',
        marginRight: 15,
    },

    header: {
        height: 40,

        width: width,
        fontSize: 14,

        textAlign: 'center',
        textAlignVertical: 'center',
    },
    list: {
        width: width,
    },
});