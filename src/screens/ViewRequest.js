import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { wp, hp } from '../constants/functions';
import InputBox from '../components/InputBox';
import LoginButton from '../components/LoginButton';
import database from '../database/database';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import EditRequest from './EditRequest';

class ViewRequest extends Component {
    state = {
        files: [],
        editMode: false,
    }
    componentDidMount() {

        // database.printTable();
        if (this.props.requestid) {
            database.getFiles(this.props.requestid, {
                success: (result) => {
                    this.setState({
                        files: result,
                    });
                },
                error: () => {
                }
            });
        }
        console.log('testing user prop: ' + JSON.stringify(this.props.user))
    }
    componentWillUnmount() {
        this.setState({ editMode: false });
    }

    showFilesList = () => {
        const { files } = this.state;
        if (files.length > 0) {
            return files.map((item, index) => {
                console.log('trying to display: ' + JSON.stringify(item));
                return (
                    <View key={`view-${index}`} style={{ width: Dimensions.get('window').width / 2 - 10, }}>
                        <Image key={`img-${index}`} source={{ uri: item.path }} style={{ width: wp(35), height: hp(15), zIndex: -1 }} />
                    </View>
                );
            });
        } else {
            return <Text>لا يوجد مرفقات</Text>
        }
    }

    render() {
        const { title, msg, user } = this.props;
        if (this.state.editMode) {

            return (
                <EditRequest
                    user={user}
                    title={title}
                    msg={msg}
                    files={this.state.files}
                    requestid={this.props.requestid}
                    onDelete={this.props.onDelete}
                    onCancel={() => this.setState({ editMode: false })}
                    callback={(files) => {
                        this.setState({
                            files: files
                        });
                        this.props.callback();
                    }}
                />
            )
        } else {
            return (
                <ScrollView style={styles.container}>
                    <View style={[styles.regForm, { backgroundColor: 'lightgray', paddingVertical: 20, paddingHorizontal: 20, marginHorizontal: wp(6) }]}>
                        <Text style={{ textAlign: "center", fontWeight: "bold" }}>منشئ المقترح: {user.firstname + ' ' + user.lastname}</Text>
                        <Text style={{ textAlign: "center", fontWeight: "bold" }}>حساب المنشئ: {user.username}</Text>
                    </View>
                    <View style={[styles.regForm, { backgroundColor: 'lightgray', paddingVertical: 20, paddingHorizontal: 20, marginHorizontal: wp(6) }]}>
                        <Text style={{ textAlign: "center", fontWeight: "bold" }}>العنوان: {title}</Text>
                        <Text style={{ textAlign: "center", fontWeight: "bold" }}>الاقتراح: {msg}</Text>
                    </View>
                    <View style={styles.regForm}>
                        <Text>المرفقات</Text>
                        <View style={{ width: wp(100), flex: 1, flexDirection: 'row', flexWrap: "wrap" }}>
                            {
                                this.showFilesList()
                            }
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 15, }}>

                        <LoginButton backgroundColor={'#004d1a'} onPress={() => this.setState({ editMode: true })}><Text style={{ color: 'whitesmoke', fontWeight: 'bold' }}>تعديل</Text></LoginButton>
                        <LoginButton backgroundColor={'#004d1a'} onPress={this.props.onCancel}><Text style={{ color: 'whitesmoke', fontWeight: 'bold' }}>الخلف</Text></LoginButton>
                    </View>
                    <LoginButton backgroundColor={'red'} onPress={() => this.props.onDelete()}><Text style={{ color: 'whitesmoke', fontWeight: 'bold' }}>حذف الاقتراح</Text></LoginButton>
                </ScrollView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "space-between",
        backgroundColor: 'white',
        paddingHorizontal: wp(10),
        marginTop: hp(5)
    },
    regForm: {
        alignSelf: 'stretch',
        marginTop: hp(1),
    },
    header: {
        fontSize: 24,
        color: 'whitesmoke',
    },
    textInput: {
        alignSelf: 'stretch',
        height: 40,
        marginBottom: 30,
        color: 'black',
        borderBottomColor: "#004d1a",
        borderBottomWidth: 1,
    }
});

export default ViewRequest;