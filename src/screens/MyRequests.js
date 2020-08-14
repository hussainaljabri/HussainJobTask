
import React, { Component } from 'react';
import { View, Text, Alert, ScrollView, ActivityIndicator } from 'react-native';
import database from '../database/database';
import { hp, wp, createDirectory } from '../constants/functions';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RequestCard from '../components/RequestCard';
import AddRequest from '../screens/AddRequest';
import ViewRequest from '../screens/ViewRequest';
import Login from './Login';
import { getDataFromStorage, USER_KEY, storeDataToStorage } from '../userDefault';


//const user = {"id":1,"firstname":"test","lastname":"test","username":"tt","password":"22"}
class MyRequests extends Component {

    state = {
        user: null,
        userRequests: [],
        requestsReady: false,
        addShown: false,
        isLoading: false,
        viewMode: false,
        editMode: false,
        clickedRequest: {},
    }

    componentDidMount() {
        // fetch Requests made by this user.
        // database.destroyDatabase({
        //     success: ()=> database.initalize({success: ()=> {
        //         console.log('Database Initialize successful');
        //         database.printTable({success: ()=> console.log("callback from printTable")});
        //     }})
        // });
        createDirectory();
        // let temp = this.props.navigation.getParam("user", {});
        // console.log('---------- TEMP: '+ JSON.stringify(temp));
        
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {// This hook returns `true` if the screen is focused, `false` otherwise
            // The screen is focused
            // Call any action
            this.initializeData();
        });
    }
    
    componentWillUnmount() {
        this.focusListener.remove();
    }
    async initializeData() {
        // getting data from user default
        await getDataFromStorage(USER_KEY)
            .then(result => {
                // get the result here 
                console.log('----------> Loggedin User Data ----------> ' + result);
                // null validation for result
                if (result !== null) {
                    this.setState({
                        user: JSON.parse(result)
                    }, () => {
                        this.refresh();
                    });
                }
                else {
                    //Change your error message with your language
                    alert('Unable to find recorde')
                }
            }).catch(e => {
                // error handling
                //Change your error message with your language
                alert('Something went wrong!')
            })
    }
    viewRequest = (clickedRequest) => {
        this.setState({
            viewMode: true,
            clickedRequest: clickedRequest,
        });
    }
    createRequestCards = () => {
        if (this.state.requestsReady) {
            const { userRequests, user } = this.state;
            console.log('-------------USER: ' + user);
            return userRequests.map((item, index) => {
                return <RequestCard
                    key={`reqCard-${index}`}
                    onPress={() => this.viewRequest(item)}
                    enableEdit={true}
                    title={item.title}
                    msg={item.message}
                    name={`${user.firstname} ${user.lastname}`}
                />
            });
        }
    }

    refresh = () => {
        this.setState({
            isLoading: true,
            requestsReady: false,
            viewMode: false,
        });
        // database.printTable();
        const { user } = this.state;
        database.getRequest(user.id, { // user.id
            success: (result) => {

                this.setState({
                    userRequests: result,
                    requestsReady: true,
                    isLoading: false
                });
            },
            error: (msg) => {
                Alert.alert(
                    'خطأ',
                    `${msg}`,
                    [{
                        text: 'موافق',
                        style: "cancel"
                    }]);
                this.setState({
                    isLoading: false
                });
            }
        });
    }
    onDelete = () => {
        const { clickedRequest } = this.state;
        database.DeleteRequest(clickedRequest.id, {
            success: () => this.refresh(),
            error: () => alert('something happened during delete')
        })
    }

    render() {
        // const user =  this.props.navigation.getParam('user', {});    // IMPORTANT
        if (this.state.addShown) {

            return (
                <AddRequest user={this.state.user} userid={this.state.user.id} onCancel={() => this.setState({ addShown: false })} callback={() => {
                    this.refresh();
                    this.setState({ addShown: false });
                }} />
            );

        } else if (this.state.viewMode) {
            return (
                <ViewRequest user={this.state.user} onDelete={() => this.onDelete()} callback={() => {
                    this.refresh();
                    this.setState({ viewMode: false });
                }} onCancel={() => this.setState({ viewMode: false })} requestid={this.state.clickedRequest.id} title={this.state.clickedRequest.title} msg={this.state.clickedRequest.message} />
            );
        } else {

            return (
                <View style={{ flex: 1, backgroundColor: "lightgray", }}>
                    <View style={{ borderBottomColor: 'darkgreen', borderBottomWidth: 1, flexDirection: 'row-reverse', justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => this.setState({ addShown: true })} style={{ paddingHorizontal: wp(5), alignSelf: 'flex-end', paddingTop: hp(7), paddingBottom: hp(2), flexDirection: 'row-reverse' }}>
                            <FontAwesome5 name="plus" size={20} color={'green'} />
                            <Text style={{ paddingRight: wp(3), paddingTop: hp(0.3) }}>
                                إضافة اقتراح
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.refresh()} style={{ paddingHorizontal: wp(5), alignSelf: 'flex-end', paddingTop: hp(7), paddingBottom: hp(2), flexDirection: 'row-reverse' }}>
                            <FontAwesome5 name="sync" size={20} color={'green'} />
                            <Text style={{ paddingRight: wp(3), paddingTop: hp(0.3) }}>
                                تحديث
                    </Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.isLoading ?
                        <View style={{ marginTop: hp(10) }}>
                            <ActivityIndicator size="large" color="orange" />
                        </View>
                        :
                        <ScrollView>
                            {/* HERE REQUESTS CARDS */}
                            {this.state.requestsReady ?
                                this.createRequestCards()
                                :
                                <Text style={{ justifyContent: "center", textAlign: "center", marginTop: hp(10) }}>لا يوجد اقتراحات</Text>}
                        </ScrollView>
                    }
                </View>
            );

        }
    }
}

export default MyRequests;