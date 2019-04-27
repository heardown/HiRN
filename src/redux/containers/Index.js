import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Test from '../components/Test';
import { changeText } from '../redux/action/action';
import {connect } from 'react-redux';

class Index extends React.Component{
    render(){
        const {onChangeText} = this.props;
        return(
            <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Test {...this.props} />

                <TouchableOpacity
                    onPress={onChangeText}
                >
                    <Text>改变文字按钮</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

//获取state的变化
const mapStateToProps = (state) => {
    return{
        value1: state.text1,
        value2: state.text2,
    }
}

// 发送行为
const mapDispatchToProps = (dispatch) => {
    return{
        onChangeText:() => dispatch(changeText('外部传值', '外部传值2')),
    }
}

// 进行第二层包装,生成的新组件拥有 接收和发送 数据的能力
export default connect(mapStateToProps, mapDispatchToProps)(Index);