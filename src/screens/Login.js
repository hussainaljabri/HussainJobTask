// صفحة تسجيل الدخول
import React, { Component } from 'react';
import { Animated, View, ActivityIndicator, Image, Text, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import InputBox from '../components/InputBox';
import LoginButton from '../components/LoginButton';
import { wp, hp, createDirectory } from '../constants/functions';
import database from '../database/database';
import { getDataFromStorage, USER_KEY, storeDataToStorage } from '../userDefault';


const OnboardingLogo = ({ imageStyle }) => (
    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
        <View style={{ marginBottom: 15 }}>
            <Image style={imageStyle} source={require('../../assets/logo.jpg')} resizeMode={"contain"} />
        </View>
    </View>
);

class Login extends Component {
    state = {
        opacity: new Animated.Value(0),
        position: new Animated.Value(0),
        btnposition: new Animated.Value(0),
        username: '',
        password: '',
        isLoading: false,
    }

    componentDidMount() {
        // to start both animations at same time
        Animated.parallel([this.positionAnim(), this.opacityAnim(), this.btnpositionAnim()]).start();

    }

    btnpositionAnim = () => {
        Animated.timing(this.state.btnposition, {
            toValue: 1, //TO
            duration: 600,
            delay: 400,
            useNativeDriver: true,
        }).start()
    }
    opacityAnim = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1, //TO
            duration: 700,
            delay: 900,
            useNativeDriver: true,
        }).start()
    }

    positionAnim = () => {
        Animated.timing(this.state.position, {
            toValue: 1, //TO
            duration: 600,
            delay: 400,
            useNativeDriver: true,
        }).start()
    }

    onLoginPress = () => {
        const { username, password } = this.state;
        if (!(username === '') && !(password === '')) {
            try {
                //turn on the Login ActivityIndicator
                this.setState({ isLoading: true });
                //Authenticates user with hard coded credentials
                console.log('Loginning in......');
                database.getUser(
                    username, password,
                    {
                        success: (result) => {
                            console.log(`Successful login: ${JSON.stringify(result)}`);
                            // this.props.navigation.navigate("Main", { 'user': result });
                            this.storeDataToLocalAndGoToMainScreen(result);
                        },
                        error: (msg) => {
                            Alert.alert(
                                'خطأ',
                                `${msg}`,
                                [{
                                    text: 'موافق',
                                    style: "cancel"
                                }]);
                        }
                    }
                );

            } catch (err) {
                console.log('error: ', err);
            }
        } else {
            Alert.alert(
                'تنبيه',
                'الرجاء تعبئة البيانات!',
                [{
                    text: 'موافق',
                    style: "cancel"
                }]);
        }
        this.setState({ isLoading: false });
    }
    async storeDataToLocalAndGoToMainScreen(result) {
        await storeDataToStorage(JSON.stringify(result), USER_KEY)
            .then(result => {
                console.log(`Is Success: ${result}`);
                if (result) {
                    this.props.navigation.navigate("Main");
                }
            })
            .catch(e => {
                //Change your error message with your language
                alert('Something went wrong!');
            })
    }
    test = () => {
        // database.printTable({success: ()=> console.log("callback from printTable")});
        // database.destroyDatabase({
        //     success: ()=> database.initalize({success: ()=> {
        //         console.log('Database Initialize successful');
        //         database.printTable({success: ()=> console.log("callback from printTable")});
        //     }})
        // });

    }
    render() {
        const { opacity, position, btnposition, username, password, isLoading } = this.state;
        const logoTransition = position.interpolate({
            inputRange: [0, 1], // 0 to 1 
            outputRange: [200, 0], // at 0 => position 50, and at 1 => position 0
        });
        const btnTransition = btnposition.interpolate({
            inputRange: [0, 1], // 0 to 1 
            outputRange: [200, -100],
        });
        return (
            <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
                <KeyboardAvoidingView >
                    <Animated.View style={{
                        paddingTop: hp(15), flex: 1, transform: [{
                            translateY: logoTransition,
                        }]
                    }}>
                        <View style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}>
                            <OnboardingLogo imageStyle={{ height: hp(30), width: wp(100) }} />
                        </View>
                    </Animated.View>
                    <Animated.View style={{
                        paddingTop: hp(15), flex: 0.9, alignSelf: "center", justifyContent: 'center', width: wp(100), opacity, transform: [{
                            translateY: btnTransition,
                        }]
                    }}>
                        <InputBox type="user" onChange={(txt) => this.setState({ username: txt })} value={username}>اسم المستخدم</InputBox>
                        <InputBox type="pass" onChange={(txt) => this.setState({ password: txt })} value={password}>كلمة المرور</InputBox>
                        {isLoading ? <ActivityIndicator size="large" color="#004d1a" /> : <LoginButton backgroundColor={"#806000"} onPress={this.onLoginPress}>تسجيل دخول</LoginButton>}
                        <LoginButton backgroundColor={"#004d1a"} onPress={() => this.props.navigation.navigate("Register")}>تسجيل جديد</LoginButton>
                        {/* <LoginButton backgroundColor={"#004d1a"} onPress={() => this.test()}>test</LoginButton> */}
                    </Animated.View>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

export default Login;