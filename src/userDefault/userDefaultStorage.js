import AsyncStorage from '@react-native-community/async-storage';


const storeDataToStorage = async (value, key) => {
    try {
        await AsyncStorage.setItem(key, value)
        return true;
    } catch (e) {
        return false;
    }
}


const getDataFromStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }
        else {
            return null
        }
    } catch (e) {
        return null
    }
}

const removeValueFromStorage = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
        return true;
    } catch (e) {
        return false;
    }
}

const removeAll = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error('Error clearing app data.');
    }
}


export {
    storeDataToStorage,
    getDataFromStorage,
    removeValueFromStorage,
    removeAll
}