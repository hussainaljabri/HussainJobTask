import {Dimensions} from 'react-native';
import * as FileSystem from 'expo-file-system';

export function onBackButtonPressAndroid (){
    /*
    *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
    *   and react-navigation's lister will not get called, thus not popping the screen.
    *
    *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
    * */
   
    // do something
    this.handleAudioPlayer();
    this.props.navigation.goBack();
    return true;
};

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

export function hp (percentage){
    const value = (percentage * viewportHeight) / 100;
    return Math.round(value);
}



export function moveFile (from, callback){
    let to = FileSystem.documentDirectory + "hussaintask/" + from.split('ImagePicker/').pop();
    console.log('trying to transfer ' + from + ' to ' + to);
    FileSystem.copyAsync({
        from: from,
        to: to
    }).then(() =>{
        console.log('Finished Copying to '+ to);
        callback.success(to);
    }).catch(error=>{
        console.log('at moveFile: '+error);
        callback.error(error);
    });
}

export function createDirectory (){
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "hussaintask/")
    .then(()=>{
        console.log('make directory success')
    }).catch(error =>{
        //console.log(error);
    })
}


