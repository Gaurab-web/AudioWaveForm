import Sound from 'react-native-sound';

export const getAvg = (_arr: number[]): number[] => {
  const newLength: number = 40;
  const originalLength: number = _arr.length;
  return Array.from({length: newLength}, (_, i) => {
    const index = (i * (originalLength - 1)) / (newLength - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    if (lowerIndex === upperIndex) {
      return _arr[lowerIndex];
    } else {
      const weightUpper = index - lowerIndex;
      const weightLower = 1 - weightUpper;

      return _arr[lowerIndex] * weightLower + _arr[upperIndex] * weightUpper;
    }
  });
};

export const getDurationFromUrl = async (audioUrl: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const sound: Sound = new Sound(audioUrl, '', error => {
      if (error) {
        console.log('Failed to load the sound', error);
        reject(error);
        return;
      }
      const durarion: number = sound.getDuration();
      resolve(formatDuration(durarion.toString()));
    });
  });
};

const formatDuration = (durationInSeconds: string): string => {
  const totalSeconds: number = parseFloat(durationInSeconds||'');
  const minutes: number = Math.floor(totalSeconds / 60);
  const seconds: number = Math.floor(totalSeconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const encryptedString = (_: number): string => {
  const numberAsString = (_||0).toString();
  const secretKey = 'kjfsdapoiqwenpsajdop';
  let value = '';
  for (let i = 0; i < numberAsString.length; i++) {
    value += String.fromCharCode(
      numberAsString.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length),
    );
  }
  return value;
};

export const _diffTime = (
  _d: string,
  _c: string,
  callback: (arg0: boolean) => void,
): void => {
  if (_d && _c) {
    const durationParts = (_d || '')?.split(':');
    const playTimeParts = (_c || '')?.split(':');

    const durationDate = new Date();
    durationDate.setHours(
      parseInt(durationParts[0]||''),
      parseInt(durationParts[1]||''),
      parseInt(durationParts[2]||''),
    );

    const playTimeDate = new Date();
    playTimeDate.setHours(
      parseInt(playTimeParts[0]||''),
      parseInt(playTimeParts[1]||''),
      parseInt(playTimeParts[2]||''),
    );

    const timeDifference = durationDate.getTime() - playTimeDate.getTime();
    if (Math.abs(timeDifference) === 1000) {
      callback(true);
    } else {
      callback(false);
    }
  }
};
