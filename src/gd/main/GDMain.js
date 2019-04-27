import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { DeviceEventEmitter, Image, Platform, StyleSheet } from 'react-native';
//引入外部文件
import { Navigator } from 'react-native-deprecated-custom-components';
import TabNavigator from 'react-native-tab-navigator';
import Home from '../home/GDHome';
import GT from '../ht/GDHt';
import RANK from '../rank/GDRank';
import Loader from '../http/HttpBase';
export default class GDMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'home',    //选中页面
            isHiddenTabBar: false,  //是否隐藏导航栏
            homeBadgeText:0,        //首页角标
            htBadgeText:0,          //海淘角标
        };
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar', (data) => {
            this.notifyChanged(data)
        });
        
        /**
         * 定时获取未刷新条目
         */
        setInterval(() => {
           this.loadDataNumber();
        }, 60000);
    }


    loadDataNumber() {
        AsyncStorage.multiGet(['homeFirstId', 'htFirstId'], (error, stores) => {
            let params = {
                "cnmaxid" : stores[0][1],
                "usmaxid" : stores[1][1],
            }

            HttpBase.get('http://guangdiu.com/api/getnewitemcount.php', params, {})
            .then((responseData) => {
                this.setState({
                    homeBadgeText:responseData.cn,
                    htBadgeText:responseData.us,
                });
            }).catch((error) => {

            });
        });

    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    /**
     * 通知导航栏事件
     */
    notifyChanged(data) {
        this.setState({
            isHiddenTabBar: data,
        });
    }
    /**
     * 设置转场动画
     * @param {*} route 
     */
    setNavAnimationType(route) {
        if (route.animationType) {
            let conf = route.animationType;
            conf.gestures = null;
            return conf;
        } else {
            return Navigator.SceneConfigs.PushFromRight;
        }
    }

    /**
     * 渲染Tab
     * @param {*} title 
     * @param {*} selectedTab 
     * @param {*} image 
     * @param {*} selectedImage 
     * @param {*} component 
     */
    renderTabBarItem(title, selectedTab, image, selectedImage, component, badgeText, subscription) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={{ color: 'black' }}
                renderIcon={() => <Image style={styles.tabIcon} source={{ uri: image }} />}
                renderSelectedIcon={() => <Image style={styles.tabIcon} source={{ uri: selectedImage }} />}
                badgeText={badgeText > 0 ? badgeText : ''}
                onPress={() => this.clickTab(selectedTab, subscription)}
            >
                <Navigator
                    initialRoute={{
                        name: selectedTab,  
                        component: component
                    }}
                    
                    configureScene={(route) => this.setNavAnimationType(route)}

                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} 
                            loadDataNumber = {() => this.loadDataNumber()}
                        />
                    }}
        
                >
                </Navigator>
            </TabNavigator.Item>
        );
    }

    clickTab(selectedTab, subscription) {
        //仅当当前已选中页面 再进行刷新
        if(this.state.selectedTab == selectedTab){
            // 发送tab点击事件 通知子页面
            if(subscription !== undefined) {
                 DeviceEventEmitter.emit(subscription);
            }
        }else {
            this.setState({ selectedTab: selectedTab })
         }
    }


    render() {
        return (
            <TabNavigator
                tabBarStyle={this.state.isHiddenTabBar !== true ? {} : { height: 0, overflow: 'hidden' }}
                sceneStyle={this.state.isHiddenTabBar !== true ? {} : { paddingBottom: 0 }}
            >
                {/* 首页 */}
                {this.renderTabBarItem('首页', 'home', 'tabbar_home_30x30', 'tabbar_home_selected_30x30', Home, this.state.homeBadgeText, 'homeEvent')}
                {/* 海淘 */}
                {this.renderTabBarItem('海淘', 'ht', 'tabbar_abroad_30x30', 'tabbar_abroad_selected_30x30', GT,  this.state.htBadgeText, 'htEvent')}
                {/* 排行榜 */}
                {this.renderTabBarItem('排行榜', 'rank', 'tabbar_rank_30x30', 'tabbar_rank_selected_30x30', RANK)}
                
            </TabNavigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    tabIcon: {
        width: Platform.OS === 'android' ? 25 : 30,
        height: Platform.OS === 'android' ? 25 : 30,
    },
});