import React from 'react';
import {View, TextInput} from 'react-native';

const InputBox = ({children, onChange, value, type, containerStyle, height}) =>(
    <View 
    style={[containerStyle, {
        marginBottom: 5,
        flexDirection: 'row',
        backgroundColor: `lightgray`,
        marginHorizontal: '10%',
        justifyContent:"center",
        alignItems: 'center',
        padding: 2,
        borderRadius: 5
    }]}>
        <View style={{width:'100%'}}>
            <TextInput
                style={{ height: height? height:40, borderColor: 'gray', color:"black", borderWidth: 1, paddingHorizontal: 5, textAlign: "right"}}
                onChangeText={text => onChange(text)}
                value={value}
                placeholder={children}
                placeholderTextColor='black'
                underlineColorAndroid="transparent"
                multiline={true}
                secureTextEntry={type==='pass'? true: false}
            />
        </View>       
    </View>
);

export default InputBox;