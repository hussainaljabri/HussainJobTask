// صفحة التسجيل للموظف الجديد
import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import { wp, hp } from '../constants/functions';
import InputBox from '../components/InputBox';
import LoginButton from '../components/LoginButton';
import database from '../database/database';

class Register extends Component{
    state = {
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        isLoading: false,
    }
    static navigationOptions = ({navigation})=> ({
        // headerLeft: navigation.state.params.headerLeft,
        headerTitle:()=> (
        <Text style={styles.header}>
            تسجيل موظف جديد
        </Text>),
        headerTintColor: "whitesmoke", // COLOR
        headerStyle: {backgroundColor: '#004d1a'}
        
    })

    onRegisterPress = () =>{
        const {firstname, lastname, username, password} = this.state;
        if(!(username==='') && !(password==='') && !(firstname==='') && !(lastname==='')){
            try{
                //turn on the Login ActivityIndicator
                this.setState({isLoading: true});
                //Authenticates user with hard coded credentials
                 database.addUser(
                     firstname, lastname, username, password,
                     {
                         success: ()=> {
                            this.props.navigation.goBack();
                            database.printTable();

                         },
                         error: ()=> Alert.alert(
                                            'تنبيه',
                                            'حدث خطأ ولم يتم التسجيل',
                                        [{
                                            text: 'موافق',
                                            style: "cancel"
                                        }])
                     }
                 );

                
            }catch (err){
                console.log('error: ', err);
                Alert.alert(
                    'تنبيه',
                    'حدث خطأ ولم يتم التسجيل',
                    [{
                        text: 'موافق',
                        style: "cancel"
                    }]);
            }
        }else{
            Alert.alert(
                'تنبيه',
                'الرجاء تعبئة البيانات!',
                [{
                    text: 'موافق',
                    style: "cancel"
                }]);
        }
    }
    render(){
        const {firstname, lastname, username, password, isLoading} = this.state;
        return (
            <View style={styles.container}>    
                <View style={styles.regForm}>
                        <InputBox type="" onChange={(txt)=>this.setState({firstname: txt})} value={firstname}>الاسم الاول</InputBox>
                        <InputBox type="" onChange={(txt)=>this.setState({lastname: txt})} value={lastname}>الاسم الاخير</InputBox>
                        <InputBox type="" onChange={(txt)=>this.setState({username: txt})} value={username}>اسم المستخدم</InputBox>
                        <InputBox type="" onChange={(txt)=>this.setState({password: txt})} value={password}>كلمة المرور</InputBox>
                </View>
                {isLoading? <ActivityIndicator size="large" color="#004d1a"/>:<LoginButton backgroundColor={'#004d1a'} onPress={this.onRegisterPress}><Text style={{color: 'whitesmoke',fontWeight:'bold'}}>تـسـجـيـل</Text></LoginButton>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: 'white',
        paddingHorizontal: wp(10),
    },
    regForm: {
        alignSelf: 'stretch',
        marginTop: hp(10),
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

export default Register;