import {StatusBarStyle} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export interface MyStatusBarTypes {
  backgroundColor: string;
  barStyle: StatusBarStyle;
  force?: boolean;
}

export type RecordListType={
  item: RecodingItemTypes;
  index: number;
  audioPlayer: AudioRecorderPlayer;
};

export interface RecordObjTypes {
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

export type RecodingItemTypes={
  id: string,
  uri : string,
  metering : number[];
  durarion : string
}