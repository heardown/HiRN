import React from 'react';
import { Text, View, Image, } from "react-native";
import { Navigator } from 'react-native-deprecated-custom-components';


let NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        if (index > 0) {
            return (
                <TouchableOpacity
                    onPress={() => navigator.pop()}
                >
                    <Text>返回</Text>
                </TouchableOpacity>
            )
        }
    },

    RightButton(route, navigator, index, navState) {

    },

    Title(route, navigator, index, navState) {
        return (
            <Text>{route.name}</Text>
        )
    },
};
export default class NavBar extends React.Component{

    render() {
        return (
            <Navigator.NavigatorNavigationBar
                style={{ backgroundColor: 'pink' }}
                routeMapper={NavigationBarRouteMapper}

            />
        );
    }


}