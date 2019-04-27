import React from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Slider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import { back } from '../common/ImageDispatcher';
import SideBar from '../components/SideBar';
import { Api } from '../service/Api';
import Video from 'react-native-video';


const { width, height } = Dimensions.get('window');

export default class MusicPlayer extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            picUrl: '',
            mp3: '',
            bgColor: '#c60d0d',
            pause: false,
            startTime: '00:00',
            currentTime: 0,
            sliderValue: 0,
            rotateValue: new Animated.Value(0),
            minimumTrackTintColor: '#c60d0d',
            maximumTrackTintColor: '#CCCCCC',
            thumbTintColor: '#FFFFFF',
        }
    }

    componentWillMount() {
        const id = this.props.navigation.getParam('id');
        const name = this.props.navigation.getParam('name');
        const picUrl = this.props.navigation.getParam('picUrl');
        const url = Api.Music_Mp3_Url.replace('{id}', id);  //mp3地址


        this.setState({
            title: name,
            picUrl: picUrl,
            mp3: url,
        });

        console.log('url ' + this.state.mp3);
        this.startAnimation();
    }

    startAnimation() {
        this.state.rotateValue.setValue(0);
        Animated.parallel([
            Animated.timing(this.state.rotateValue, {
                toValue: 1,
                duration: 15000,
                easing: Easing.out(Easing.linear),
            })
        ]).start(() => this.startAnimation());
    }

    onProgress(data) {
        let val = parseInt(data.currentTime);
        this.setState({
            sliderValue: val,
            currentTime: data.currentTime,
        });

        if (val == this.state.file_duration) {

        }
    }

    formatTime(time) {
        if (!time) {
            return this.state.startTime;
        }
        let min = Math.floor(time / 60);
        let second = time - min * 60;
        min = min >= 10 ? min : '0' + min;
        second = second >= 10 ? second : '0' + second;
        return min + ':' + second;
    }

    onLoad(data) {
        this.setState({
            duration: data.duration,
        });
    }

    renderPlay() {
        return (
            <View style={[styles.container, { width: width }]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 20,
                    marginHorizontal: 5
                }}>
                    <Text style={{ fontSize: 12, color: '#fff' }}>{this.formatTime(Math.floor(this.state.currentTime))}</Text>

                    <View style={{ flex: 1, marginHorizontal: 5 }}>
                        <Slider
                            value={this.state.sliderValue}
                            maximumValue={this.state.duration}
                            step={1}
                            minimumTrackTintColor={this.state.minimumTrackTintColor}
                            maximumTrackTintColor={this.state.maximumTrackTintColor}
                            thumbTintColor={this.state.thumbTintColor}
                            onValueChange={(value) => {
                                this.setState({
                                    currentTime: value,
                                })
                            }}
                            onSlidingComplete={(value) => this.refs.video.seek(value)}
                        />
                    </View>
                    <View>{this.formatTime(Math.floor(this.state.duration)) === this.state.startTime ?
                        <ActivityIndicator size='small' color='white' /> :
                        <Text style={{
                            fontSize: 12,
                            color: '#fff'
                        }}>{this.formatTime(Math.floor(this.state.duration))}</Text>
                    }</View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                pause: !this.state.pause,
                            })
                        }}
                        style={{
                            width: 45,
                            height: 45,
                            borderWidth: 1,
                            borderColor: '#fff',
                            borderRadius: 22.5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {this.state.pause ? <Icon name="ios-play" size={30} color={this.state.thumbTintColor} />
                            : <Icon name="ios-pause" size={25} color={this.state.thumbTintColor} />}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Video
                    ref='video'
                    source={{ uri: this.state.mp3 }}
                    volume={1.0}
                    paused={this.state.pause}
                    onProgress={(e) => this.onProgress(e)}
                    onLoad={(e) => this.onLoad(e)}
                    playInBackground={true}
                />

                <SideBar
                    backgroundColor={this.state.bgColor}
                    title={this.state.title}
                    leftImg={back}
                    onLeftPress={() => this.props.navigation.goBack()}
                />

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 280,
                        height: 280,
                        borderRadius: 140,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#C60D0D'
                    }}>
                        <Animated.Image
                            source={{ uri: this.state.picUrl }}
                            style={{
                                width: 240,
                                height: 240,
                                borderRadius: 120,
                                transform: [{
                                    rotateZ: this.state.rotateValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                    })
                                }]
                            }}
                        />

                    </View>
                </View>
                <View style={{ height: 100 }}>
                    {this.renderPlay()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#363636',
    }
});