// صفحة بداية التطبيق 
import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';

//images.logo
const OnboardingLogo = ({imageStyle}) =>(
    <View style={{justifyContent: 'center', alignSelf:'center'}}>
        <View style={{marginBottom: 15}}>
            <Image style={imageStyle} source={require('../../assets/logo.jpg')} />
        </View>
    </View>
);

class Splash extends Component{
    checkAuth=()=>{
        setTimeout(()=>{
            this.props.navigation.navigate('Login');
        }, 100)
    }
    componentDidMount(){
        this.checkAuth()
    }
    render(){
        return (
            <View style={{flex: 1, alignSelf: "center", justifyContent: "center"}}>
                <OnboardingLogo imageStyle={{height:250,width:250}}/>
            </View>
        )
    }
}

export default Splash;
