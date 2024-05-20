import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RecordListType, RecordObjTypes} from '../utils/helpers/types';
import {Icons} from '../themes/iconpath';
import normalize from '../utils/helpers/dimen';
import {Extrapolation, interpolate} from 'react-native-reanimated';
import {_diffTime} from '../utils/helpers/helper';

const RecordComponent = ({
  item,
  index,
  audioPlayer,
}: RecordListType): JSX.Element => {
  const [soundObj, setSoundObj] = useState<RecordObjTypes>();
  console.log('--soundObj---', soundObj);

  const playSound = async (): Promise<void> => {
    if (item) {
      console.log('Starting Track');
      await audioPlayer?.startPlayer(item?.uri, undefined);
      await onplayBackStatusUpdate();
    } else return;
  };

  const onplayBackStatusUpdate = async (): Promise<void> => {
    let _duration = '';
    let _playtime = '';
    audioPlayer?.addPlayBackListener(async e => {
      console.log('Details', {e});
      _playtime = audioPlayer?.mmssss(Math.floor(e.currentPosition));
      _duration = audioPlayer?.mmssss(Math.floor(e.duration));
      setSoundObj({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: _playtime,
        duration: _duration,
      });
      if (_playtime === _duration) {
        await stopSound();
      } else {
        _diffTime(_playtime, _duration, async res => {
          if (res) {
            await stopSound();
          }
        });
      }
      return;
    });
  };

  const stopSound = async (): Promise<void> => {
    console.log('onStopPlay');
    await audioPlayer?.stopPlayer();
    audioPlayer?.removePlayBackListener();
  };

  const pauseSound = async (): Promise<void> => {
    console.log('Pause Track');
    await audioPlayer?.pausePlayer();
  };

  return (
    <View style={Styles.recorderContainer}>
      <TouchableOpacity
        style={Styles.plyOrPauContainer}
        onPress={() => playSound()}>
        <Image
          source={Icons.play_icon}
          resizeMode="contain"
          tintColor={'#bbb'}
          style={Styles.plyOrPauStyle}
        />
      </TouchableOpacity>
      <View style={Styles.waveFormContainer}>
        <View style={Styles.waves}>
          {item?.metering?.map((i, _in) => (
            <View
              style={[
                Styles.waveLine,
                {
                  height: interpolate(
                    i,
                    [-60, -30, -20, 0],
                    [2, 5, 10, 30],
                    Extrapolation.CLAMP,
                  ),
                },
              ]}
              key={_in}></View>
          ))}
        </View>
        <View style={Styles.durationContainer}>
          <Text style={Styles.durationTextStyle}>{`${
            soundObj?.playTime || '0:00'
          }/${soundObj?.duration || item?.durarion}`}</Text>
        </View>
      </View>
      <View style={Styles.profileContainer}>
        <Image
          source={Icons.user_icon}
          resizeMode="contain"
          style={Styles.profileStyle}
        />
      </View>
    </View>
  );
};

export default RecordComponent;

const Styles = StyleSheet.create({
  recorderContainer: {
    width: '75%',
    height: normalize(60),
    backgroundColor: '#fff',
    marginLeft: normalize(15),
    marginVertical: normalize(5),
    borderRadius: normalize(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(8),
  },
  plyOrPauContainer: {
    width: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plyOrPauStyle: {
    width: normalize(15),
    height: normalize(15),
  },
  waveFormContainer: {
    width: '70%',
    height: '100%',
    justifyContent: 'center',
  },
  profileContainer: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileStyle: {
    width: normalize(40),
    height: normalize(40),
  },
  waves: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '50%',
    gap: 3,
  },
  waveLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ccc',
    borderRadius: normalize(50),
  },
  durationContainer: {
    width: '100%',
    height: normalize(20),
    position: 'absolute',
    bottom: -3,
    alignItems: 'flex-end',
  },
  durationTextStyle: {
    color: '#aaa',
    fontSize: normalize(8),
  },
});
