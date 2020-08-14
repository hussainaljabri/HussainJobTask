import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert, Image, Dimensions} from 'react-native';
import { wp, hp, moveFile } from '../constants/functions';
import InputBox from '../components/InputBox';
import LoginButton from '../components/LoginButton';
import database from '../database/database';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

class AddRequest extends Component{
    state = {
        title: '',
        name: '',
        files: [],
        userid: null,
        isLoading: false,
    }

    componentDidMount(){

        // database.printTable();
    }
    onAddPress = () =>{
        const {title, msg, files} = this.state;
        const {userid} = this.props;
        if(!(title==='') && !(msg==='')){
            try{
                //turn on the Login ActivityIndicator
                this.setState({isLoading: true});
                //Authenticates user with hard coded credentials
                 database.addRequest(
                     title, msg, userid,
                     {
                         success: (requestid)=> {
                            if(files.length == 0){
                                this.props.callback();
                            }else{
                                files.map((item, index)=>{
                                    moveFile(item, {
                                        success: (path) => {
                                            database.addFiles(requestid, path, {
                                                success: ()=> {
                                                    console.log(`added file ${item}`)
                                                    // database.printTable();
                                                }
                                            });
                                            this.props.callback();
                                        },
                                        error: (msg)=>{
                                            console.log(msg)
                                        }
                                    })
                                });
                            }
                            

                         },
                         error: ()=> {
                            this.props.callback();
                            Alert.alert(
                                            'تنبيه',
                                            'حدث خطأ ولم نتمكن من الإضافة',
                                        [{
                                            text: 'موافق',
                                            style: "cancel"
                                        }]);}
                     }
                 );

                
            }catch (err){
                console.log('error: ', err);
                Alert.alert(
                    'تنبيه',
                    'حدث خطأ ولم يتم من الإضافة',
                    [{
                        text: 'موافق',
                        style: "cancel"
                    }]);
                this.props.callback();
            }
        }else{
            Alert.alert(
                'تنبيه',
                'الرجاء تعبئة البيانات!',
                [{
                    text: 'موافق',
                    style: "cancel"
                }]);
            this.props.callback();
        }


    }
    _pickImage = async () => {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.cancelled) {
            var temp = this.state.files;
            temp.push(result.uri);
            this.setState({ files: temp });
            
          }
    
          console.log(result);
        } catch (E) {
          console.log(E);
        }
      };
    showFilesList=()=>{
        const {files} = this.state;
        if(files.length > 0){
            return files.map((item, index)=>{
                return (
                        <View key={`view-${index}`} style={{width: Dimensions.get('window').width/2 -10,}}>
                            <TouchableOpacity key={`btn-${index}`} onPress={()=> this.removeFile(index)} >
                                <Image key={`cancel-${index}`} source={require('../../assets/close.png')} style={{width: 35, height: 35,zIndex: 1}}/>
                            </TouchableOpacity>
                            <Image key={`img-${index}`} source={{uri: item}} style={{width: wp(35), height: hp(15), zIndex:-1}}/>

                        </View>
                );
            });
        }else{
            return <Text>لا يوجد مرفقات</Text>
        }
    }
    removeFile=(index)=>{
        const {files} = this.state;
        console.log('index: '+index);
        console.log('files.splice(index, 1): '+ files.splice(index, 1));
        files.splice(index, 1);
        this.setState({files: files});
    }
    render(){
        const {title, msg, isLoading} = this.state;
        const {user} = this.props;
        return (
            <ScrollView style={styles.container}>
                <View style={[styles.regForm, {backgroundColor: 'lightgray', paddingVertical: 20, paddingHorizontal: 20, marginHorizontal: wp(6)}]}>
                    <Text style={{textAlign: "center", fontWeight:"bold"}}>منشئ الإقتراح: {user.firstname + ' ' + user.lastname}</Text>
                    <Text style={{textAlign: "center", fontWeight:"bold"}}>حساب المنشئ: {user.username}</Text>
                </View>
                <View style={styles.regForm}>
                        <InputBox type="" onChange={(txt)=>this.setState({title: txt})} value={title}>عنوان الاقتراح</InputBox>
                        <InputBox height={hp(15)} type="" onChange={(txt)=>this.setState({msg: txt})} value={msg}>نص الاقتراح</InputBox>
                </View>
                <View style={styles.regForm}>
                    <LoginButton backgroundColor={'#004d1a'} onPress={()=> this._pickImage()}><Text style={{color: 'whitesmoke',fontWeight:'bold'}}>اضافة مرفق</Text></LoginButton>

                    <View style={{width: wp(100), flex:1, flexDirection: 'row', flexWrap: "wrap"}}>
                    {
                        this.showFilesList()
                    }
                    </View>


                    
                </View>
                <View style={{flexDirection: 'row-reverse', justifyContent:'space-between', marginTop: 15}}>
                    {isLoading? <ActivityIndicator size="large" color="#004d1a"/>:<LoginButton backgroundColor={'#004d1a'} onPress={()=> this.onAddPress()}><Text style={{color: 'whitesmoke',fontWeight:'bold'}}>إضافة</Text></LoginButton>}
                    <LoginButton backgroundColor={'#004d1a'} onPress={this.props.onCancel}><Text style={{color: 'whitesmoke',fontWeight:'bold'}}>إلغاء</Text></LoginButton>
                </View>
            </ScrollView> 
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // justifyContent: "space-between",
        backgroundColor: 'white',
        paddingHorizontal: wp(10),
    },
    regForm: {
        alignSelf: 'stretch',
        marginTop: hp(5),
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

export default AddRequest;