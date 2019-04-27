import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    Platform,
    Animated,
    Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

export default class CommunalSiftMenu extends React.Component {

    //用于回传值
    static defaultProps = {
        removeModal: {}, //销毁模态回调
        loadSiftData: {},
    }

    static propTypes = {
        data: PropTypes.array,
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }
    }

    componentDidMount() {
        this.loadData();
    }

    /**
     * 返回
     * @param {*} data 
     */
    popTop(data) {
        this.props.removeModal(data);
    }

    //点击事件
    siftData(mall, cate) {
        this.props.loadSiftData(mall, cate);
        this.popTop(false);
    }

    //handle data
    loadData() {
        //init data folder
        let data = [];
        //load data
        for (let i = 0; i < this.props.data.length; i++) {
            data.push(this.props.data[i]);
        }

        //notify list refresh
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
        });
    }

    renderRow(rowData) {
        return (
            <View style={styles.child}>
                <TouchableOpacity
                    onPress={() => this.siftData(rowData.mall, rowData.cate)}
                >
                    <View style={styles.child}>
                        <Image source={{ uri: rowData.image }} style={styles.image}></Image>
                        <Text style={{
                            fontSize: 13,
                            marginTop: 5,
                        }}>{rowData.title}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.popTop(false)}
                activeOpacity={1}
            >
                <View style={styles.container}>
                    <ListView
                        contentContainerStyle={styles.content}
                        scrollEnabled={false}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        initialListSize={16}
                    />
                </View>
            </TouchableOpacity>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },

    content: {
        flexDirection: 'row',
        flexWrap:'wrap',
        alignItems: 'flex-start',
        width: width,
        top: Platform.OS === 'ios' ? 64 : 50,
    },

    child: {
        width: width * 0.25,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(249,249,249,1.0)',
    },

    image: {
        width: 40,
        height: 40,
    },

});