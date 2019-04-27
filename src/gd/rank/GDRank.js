import React from 'react';
import {
    Dimensions,
    Image, ListView,
    StyleSheet, Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
    InteractionManager,
} from 'react-native';
import { PullList } from 'react-native-pull';
import CommunalDetails from '../main/GDCommunalDetails';
import CommunalCell from '../main/GDCommunalCell';
import CommunalNavBar from '../main/GDCommunalNavBar';
import NoDataView from '../main/GDNoDataView';
import Settings from './GDSettings';



const { width, height } = Dimensions.get('window');

export default class GDRank extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            loaded: false,  //是否已加载数据
            prompt: '',      //标题栏状态
            isNextTouch: false,  //下一小时按钮状态
        };
        this.nextHour = '';
        this.nextHourDate = '';
        this.lastHour = '';
        this.lastHourDate = '';
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
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

    /**
     * 首次加载数据
     */
    fetchData() {
        this.loadData(undefined);
    }

    /**
     * 加载下一小时数据
     * @param {*} resolve 
     */
    fetchNextData() {
        this.loadData(undefined, this.nextHourDate, this.nextHour);
    }

    /*
     *加载上一小时数据 
     */
    fetchLastData() {
        this.loadData(undefined, this.lastHourDate, this.lastHour);
    }

    /**
     * 加载数据
     * @param {*} resolve 
     * @param {*} date 
     * @param {*} hour 
     */
    loadData(resolve, date, hour) {
        var params = {};
        if (date) {
            params = {
                'date': date,
                'hour': hour,
            }
        }
        HttpBase.get('http://guangdiu.com/api/getranklist.php', params)
            .then((responseData) => {
                //判断是否能继续点击下一小时按钮
                let nextTouch = false;
                if (responseData.hasnexthour != 0) {
                    nextTouch = true;
                }

                //通知状态变化 
                this.setState({
                    loaded: true,
                    isNextTouch: nextTouch,
                    prompt: responseData.displaydate + responseData.rankhour + '点档' + '  ( ' + responseData.rankduring + ' )',
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                });

                //关闭刷新动画
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }

                // 需要缓存的数据
                this.nextHour = responseData.nexthourhour;
                this.nextHourDate = responseData.nexthourdate;
                this.lastHour = responseData.lasthourhour;
                this.lastHourDate = responseData.lasthourdate;
            })
            .catch((error) => {
                console.log(error);
            })
    }


    renderLeftItem() {
        return (
            <Image style={styles.navBarLeft} />
        );
    }

    renderTitleItem() {
        return (
            <Image source={{ uri: 'navtitle_rank_107x20' }} style={styles.navBarTitle} />
        );
    }

    renderRightItem() {
        return (
            <TouchableOpacity onPress={() => this.pushToSettings()}>
                <Text style={styles.navBarRight}>设置</Text>
            </TouchableOpacity>
        );
    }

    pushToSettings() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                name: 'Settings',
                component: Settings,
            })
        });
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
                initialListSize={6}
                showHorizontalScrollIndicator={false}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                />
                <Text style={{
                    backgroundColor: '#f5f5f5', textAlign: 'center',
                    textAlignVertical: 'center', width: width, height: 30, fontSize: 14
                }}
                >{this.state.prompt}</Text>
                {this.renderListView()}
                <View style={{ backgroundColor: '#f5f5f5', width: width, height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {/* 上一小时按钮 */}
                    <TouchableOpacity
                        onPress={() => this.fetchLastData()}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'green' }}>{' < ' + '上1小时 '}</Text>
                    </TouchableOpacity>
                    {/* 下一小时按钮 */}
                    <TouchableOpacity
                        disabled={!this.state.isNextTouch}
                        onPress={() => this.fetchNextData()}>
                        <Text style={{ marginLeft: 5, fontSize: 16, color: this.state.isNextTouch == true ? 'green' : 'gray' }}>{' 下1小时' + ' > '}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },

    navBarLeft: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },

    navBarTitle: {
        width: 106,
        height: 20,
    },

    navBarRight: {
        fontSize: 17,
        color: 'rgba(123,178,114,1.0)',
        marginRight: 15,
    },
});