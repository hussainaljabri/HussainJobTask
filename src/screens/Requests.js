// صفحة الاقتراحات للإدارة
import React, { Component } from 'react';
import { View, Text, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { hp, wp } from '../constants/functions';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import database from '../database/database';
import RequestCard from '../components/RequestCard';
import ViewRequest from '../screens/ViewRequest';
class Requests extends Component {
    state = {
        isLoading: true,
        requestsReady: false,
        requests: [],
        viewMode: false,
    }

    componentDidMount() {
        // to start both animations at same time

        // get all users
        // get all their requests
        database.getAllUsersWithRequests({
            success: (result) => {
                this.setState({
                    isLoading: false,
                    requests: result,
                    requestsReady: true
                });
            }
        });
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {// This hook returns `true` if the screen is focused, `false` otherwise
            // The screen is focused
            // Call any action
            this.refresh();
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    refresh = () => {
        // database.destroyDatabase({
        //     success: ()=> database.initalize({
        //         success: () => console.log('initialized again')
        //     })
        // });

        this.setState({
            isLoading: true,
        });
        database.getAllUsersWithRequests({
            success: (result) => {
                this.setState({
                    isLoading: false,
                    requests: result,
                    requestsReady: true
                });
            }
        });
    }
    onDelete = () => {
        const { clickedRequest } = this.state;
        database.DeleteRequest(clickedRequest.id, {
            success: () => { this.setState({ viewMode: false }, () => { this.refresh() }) },
            error: () => alert('something happened during delete')
        })
    }
    viewRequest = (clickedRequest) => {
        this.setState({
            viewMode: true,
            clickedRequest: clickedRequest,
        });
    }
    createRequestCards = () => {
        const { requests, requestsReady } = this.state;
        if (requestsReady) {
            return requests.map((item, index) => {
                return <RequestCard
                    key={`reqCard-${index}`}
                    onPress={() => this.viewRequest(item)}
                    enableEdit={true}
                    title={item.title}
                    msg={item.message}
                    name={`${item.firstname} ${item.lastname}`}
                />
            });
        }
    }




    render() {

        if (this.state.viewMode) {
            const { requests, clickedRequest } = this.state;
            let user = {
                id: clickedRequest.user_id,
                firstname: clickedRequest.firstname,
                lastname:clickedRequest.lastname,
                username: clickedRequest.username,
            }
            return (
                <ViewRequest user={user} onDelete={() => this.onDelete()} callback={() => {
                    this.refresh();
                    this.setState({viewMode: false});
                }} onCancel={()=> this.setState({viewMode: false})} requestid={clickedRequest.id} title={clickedRequest.title} msg={clickedRequest.message}/>
            )
        } else {
            return (
                <View style={{ flex: 1, backgroundColor: "lightgray", }}>
                    <View style={{ borderBottomColor: 'darkgreen', borderBottomWidth: 1, justifyContent: "space-between", flexDirection: 'row-reverse' }}>
                        <View style={{ paddingHorizontal: wp(5), alignSelf: 'flex-end', paddingTop: hp(7), paddingBottom: hp(2), flexDirection: 'row-reverse' }}>
                            <Text style={{ paddingRight: wp(3), paddingTop: hp(0.3) }}>
                                جميع الإقتراحات
                    </Text>
                        </View>
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
            )
        }
    }
}

export default Requests;