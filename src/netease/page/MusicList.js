import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { back, play } from '../common/ImageDispatcher';
import SideBar from '../components/SideBar';


export default class MusicList extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            bgColor: 'red',
            playList: undefined,
        }
    }

    componentWillMount() {
        const id = this.props.navigation.getParam('id');
        this.getMusicList(id);
    }

    getMusicList(id) {
        HttpManager.getMusicDetailList(id)
            .then(responseData => {
                this.setState({
                    loaded: true,
                    playList: responseData.playlist,
                })
            })
            .catch(error => {
                console.log('error ' + error);
            });
    }

    renderItem(item, index) {
        var author = item.ar.map((v) => v.name).join('/');
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('MusicPlayer', {id: item.id, name: item.name, picUrl: item.al.picUrl});
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    height: 60,
                    flex: 1,
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 18, color: index > 2 ? 'black' : 'red', }}>{index >= 9 ? index + 1 : '0' + (index + 1)}</Text>
                    <View style={{ flex: 1, height: 60, justifyContent: 'center', marginLeft: 15, marginRight: 6, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                        <Text numberOfLines={1} style={{ color: 'black', fontSize: 16 }}>{item.name}</Text>
                        <Text numberOfLines={1} style={{ color: 'gray', fontSize: 14, marginTop: 5 }}>{`${author} - ${item.name}`}</Text>
                    </View>

                    <Image source={play} style={{ width: 30, height: 30 }} />

                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <SideBar
                    backgroundColor={this.state.bgColor}
                    title={this.state.playList != undefined ? this.state.playList.name : '加载中'}
                    leftImg={back}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />

                {this.state.loaded ?
                    <FlatList
                        data={this.state.playList.tracks}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        keyExtractor={(item) => item.id.toString()}
                    /> :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator />
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});