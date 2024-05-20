import {Platform, ToastAndroid} from 'react-native';
import Toast from 'react-native-toast-message';

const showToast = (message:string, isLong:boolean = false)=> {
  if (message && message != undefined && message != null) {
    if (Platform.OS == 'android') {
      ToastAndroid.show(
        message,
        isLong == true ? ToastAndroid.LONG : ToastAndroid.SHORT,
      );
    } else {
      Toast.show({type: 'text', text1: message, position: 'top'});
    }
  }
};
export default showToast;
