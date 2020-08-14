import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {Text} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import database from './src/database/database';


database.initalize({success: ()=> console.log('Database Initialize successful')});




const BottomNav = createMaterialBottomTabNavigator(
  {
    MyRequests: { 
              getScreen: ()=> require('./src/screens/MyRequests').default,
              navigationOptions:{
                tabBarLabel: <Text style={{fontWeight: 'bold',}}>مقترحاتي</Text>,
                tabBarIcon: ({tintColor})=><FontAwesome5 name="sticky-note" size={20} color={tintColor} />,
                // tabBarColor: 'orange',
                activeColor: 'white',
                barStyle: { backgroundColor: '#a88724',},
              } },
    Requests: { 
              getScreen: ()=> require('./src/screens/Requests').default,
              navigationOptions:{
                tabBarLabel: <Text style={{fontWeight: 'bold',}}>إدارة الإقتراحات</Text>,
                tabBarIcon: ({tintColor})=> <FontAwesome5 name="newspaper" size={20} color={tintColor} />,
                // tabBarColor: 'red',
                activeColor: 'white',
                barStyle: { backgroundColor: '#a88724'},
              } },

  },
  {
    initialRouteName: 'MyRequests',
    activeColor: 'red',
    inactiveColor: 'black',
    barStyle: { backgroundColor: '#F5F5F5', },
    shifting: false,
    keyboardHidesNavigationBar: true,
    labeled: true,
  }
);

const LoginAndRegister = createStackNavigator({
  Login: {
    getScreen: ()=> require('./src/screens/Login').default,
    navigationOptions: { headerShown: false}
  },
  Register: {
    getScreen: ()=> require('./src/screens/Register').default,
  },
});


const AppNavigator = createSwitchNavigator(
  {
      Splash:{
          getScreen: ()=> require('./src/screens/Splash').default,
      },
      Login: LoginAndRegister,
      Main: BottomNav,
  },
  {
      initialRouteName: 'Splash',
  }
);

export default createAppContainer(AppNavigator);
