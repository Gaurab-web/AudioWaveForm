import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {FC, useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import normalize from '../../utils/helpers/dimen';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {CenterStyle} from '../../Component/CenterStyle';
import {requestPermission} from '../../Component/RequestPermission';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {audioSet} from '../../utils/helpers/audioMeta';
import RecordComponent from '../../Component/RecordComponent';
import {RecodingItemTypes} from '../../utils/helpers/types';
import {
  encryptedString,
  getAvg,
  getDurationFromUrl,
} from '../../utils/helpers/helper';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecorderScreen: FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordList, setRecordList] = useState<RecodingItemTypes[]>([]);
  const [meteringList, setMeteringList] = useState<number[]>([]);
  const metering: SharedValue<number> = useSharedValue(-100);

  console.log('--recordList--',recordList)

  const AninatedBtnStyle = useAnimatedStyle(() => ({
    width: withTiming(recording ? 30 : 50),
    height: withTiming(recording ? 30 : 50),
    borderRadius: withTiming(recording ? 5 : 100),
  }));

  const AnimatedWaveStyle = useAnimatedStyle(() => {
    const size = withSpring(
      interpolate(metering.value, [-160, -60, 0], [0, 0, -25]),
      {duration: 100},
    );
    if (recording) {
      return {
        top: size,
        left: size,
        bottom: size,
        right: size,
      };
    } else {
      return {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
    }
  });

  const startRecord = async (): Promise<void> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.warn('Permission denied');
      return;
    }
    setRecording(true);
    await audioRecorderPlayer.startRecorder(undefined, audioSet, true);
    audioRecorderPlayer.addRecordBackListener(e => {
      if (e.currentMetering) {
        metering.value = e.currentMetering || -100;
        setMeteringList(exist => [...exist, e.currentMetering || -100]);
      }
      return;
    });
  };

  const stopRecord = async (): Promise<void> => {
    setRecording(false);
    const result = await audioRecorderPlayer.stopRecorder();
    console.log('Recording End', result);
    const _d = await getDurationFromUrl(result);
    setRecordList(exist => [
      {
        id: encryptedString(Math.random()),
        uri: result,
        metering: getAvg(meteringList),
        durarion: _d,
      },
      ...exist,
    ]);
    audioRecorderPlayer.removeRecordBackListener();
  };

  return (
    <>
      <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.listContainer}>
          <FlatList
            data={recordList}
            renderItem={({item, index}) => (
              <RecordComponent
                index={index}
                item={item}
                key={index}
                audioPlayer={audioRecorderPlayer}
              />
            )}
          />
        </View>
        <View style={styles.bottomContainer}>
          <View>
            <Animated.View style={[styles.ecoContainer, AnimatedWaveStyle]} />
            <TouchableOpacity
              style={styles.btnContainer}
              activeOpacity={0.5}
              onPress={() => (recording ? stopRecord() : startRecord())}>
              <Animated.View
                style={[styles.btnStyle, AninatedBtnStyle]}></Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default RecorderScreen;
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: normalize(120),
    backgroundColor: '#FFF7F7',
    ...CenterStyle,
  },
  btnContainer: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(100),
    borderWidth: 2,
    borderColor: '#ddd',
    ...CenterStyle,
  },
  btnStyle: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  ecoContainer: {
    backgroundColor: '#FFAAAA',
    position: 'absolute',
    zIndex: -1,
    borderRadius: normalize(100),
  },
});
