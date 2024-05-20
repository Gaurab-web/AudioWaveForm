import {Platform, StatusBar, View} from 'react-native';
import {MyStatusBarTypes} from './types';

const STATUSBAR_HEIGHT: number | undefined = StatusBar.currentHeight;

const MyStatusBar = ({
  backgroundColor,
  barStyle,
  force=false,
}: MyStatusBarTypes): JSX.Element => {
  return (
    <View
      style={[
        {backgroundColor: force == true ? backgroundColor : '#fff'},
        Platform.OS == 'android'
          ? {height: STATUSBAR_HEIGHT && STATUSBAR_HEIGHT + 12}
          : null,
      ]}>
      <StatusBar
        translucent={true}
        backgroundColor={force == true ? backgroundColor : '#fff'}
        barStyle={barStyle}
        hidden={false}
      />
    </View>
  );
};

export default MyStatusBar;
