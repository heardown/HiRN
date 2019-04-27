import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Modal,
    Dimensions,
    Button,
    TouchableHighlight,
} from 'react-native';

import GdModal from '../gd/main/GDMain';
import ReduxModal from '../redux/containers/wrapper';

const { width, height } = Dimensions.get('window');

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isGdModal: false,
            isReduxModal: false,
        }
    }

    onRequestClose() {
        this.setMoadl(undefined);
    }

    setMoadl(component) {
        this.setState({
            isGdModal: component == 'isGdModal',
            isReduxModal: component == 'isReduxModal',
        })
    }

    renderModal(component, componentModalFlag) {
        let Component = component;
        return (
            <Modal
                animationType='slide'
                transparent={false}
                visible={componentModalFlag}
                onRequestClose={() => this.onRequestClose()}
            >
                <Component />
            </Modal>
        );
    }

    renderItem(title, flag) {
        return (
            <TouchableHighlight
                style={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    this.setMoadl(flag);
                }}
            >
                <Text style={styles.item}>{title}</Text>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderItem('逛丢项目', 'isGdModal')}
                {this.renderItem('Redux使用', 'isReduxModal')}

                {this.renderModal(GdModal, this.state.isGdModal)}
                {this.renderModal(ReduxModal, this.state.isReduxModal)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    item: {
        color: 'white',
        fontSize: 16,
        height: 50,
        width: width,
        backgroundColor: 'red',
        textAlignVertical: 'center',
        textAlign: 'center',
    }


});