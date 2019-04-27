import React from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import SideBar from '../components/SideBar';
import Manager from "../service/HttpService";

export default class RankList extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '排行榜',
            bgColor: '#c60d0d',
            loaded: false,
            rankList: [],
        }
    }

    componentWillMount() {
        // this.manager = new MusicManager();
        this.getRankList();
    }

    getRankList() {
        HttpManager.getMusicRankingList()
            .then(responseData => {
                this.setState({
                    rankList: responseData.list,
                    loaded: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    singleMusic({ item }) {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('MusicList', { id: item.id })}
            >
                <View style={styles.content}>
                    <View>
                        <Image
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 3
                            }}
                            source={{ uri: item.coverImgUrl }} />
                        <Text
                            style={{
                                position: 'absolute',
                                bottom: 5,
                                left: 5,
                                color: 'white',
                                fontSize: 10,
                            }}
                        >{item.updateFrequency}</Text>
                    </View>
                    {this.singleList(item.tracks)}
                </View>
            </TouchableOpacity>
        );
    }


    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('MusicList', { id: item.id })}
            >
                <View style={styles.content}>
                    <View>
                        <Image
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 3
                            }}
                            source={{ uri: item.coverImgUrl }} />
                        <Text
                            style={{
                                position: 'absolute',
                                bottom: 5,
                                left: 5,
                                color: 'white',
                                fontSize: 10,
                            }}
                        >{item.updateFrequency}</Text>
                    </View>
                    {this.singleList(item.tracks)}
                </View>
            </TouchableOpacity>
        );
    }

    singleList(list) {
        let widget = [];
        let length = list.length > 3 ? 3 : list.length;
        for (var i = 0; i < length; i++) {
            widget.push(<Text key={i} numberOfLines={1} style={{ color: 'black', fontSize: 16 }}>{`${i + 1}.${list[i].first} - ${list[i].second}`}</Text>);
        }

        return (
            <View style={styles.item} >
                {widget}
            </View>
        );

    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={this.state.bgColor} />
                <SideBar
                    backgroundColor={this.state.bgColor}
                    title={this.state.title}
                />

                {this.state.loaded ?
                    <FlatList
                        data={this.state.rankList}
                        renderItem={({ item }) => this.renderItem(item)}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    : <View style={{flex:1, flexDirection:'row', justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /><Text>{'  Loading'}</Text></View>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        marginHorizontal: 10,
        marginTop: 5,
        flexDirection: 'row'
    },

    item: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 5
    }

});