import React from "react";
import { StyleSheet, View, Text} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { hp } from "../constants/functions";

export default class RequestCard extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={[styles.container, this.props.style]}>
                    <View style={{flex: 1, flexDirection:'column', justifyContent: "center"}}>
                        <View style={{flex: 1, flexDirection: 'row-reverse', justifyContent: "space-between"}}>
                            <Text style={styles.title}>{this.props.title}</Text>
                            <Text>{'  <'}</Text>
                        </View>
                        <Text style={styles.msg}>المنشئ: {this.props.name}</Text>
                        <Text style={styles.msg}>الإقتراح: {this.props.msg} </Text>
                    </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 0.3,
        backgroundColor: '#F8F8F8',
        height: hp(10),

    },
    title:{
        paddingHorizontal: 10,
        textAlignVertical: 'center',
        textAlign: 'right',
        fontSize: 16,
    },
    msg:{
        textAlignVertical: 'center',
        textAlign: "right",
        paddingHorizontal: 15,
        opacity: 0.8,
        
    }
});