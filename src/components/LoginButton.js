import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';



const LoginButton = ({children, onPress, backgroundColor}) =>(
    <TouchableOpacity onPress={onPress}>
        <View 
        style={{
            marginBottom: 5,
            flexDirection: 'row',
            backgroundColor: backgroundColor,
            marginHorizontal: '10%',
            justifyContent:"center",
            alignItems: 'center',
            padding: 15,
            borderRadius: 5
        }}>
            
            <View >
                <Text style={{fontWeight:"800",fontSize: 14, color: 'white', fontWeight: '600', letterSpacing:2}}>
                    {children}
                </Text>
            </View>
            
        </View>
    </TouchableOpacity>
);

export default LoginButton;