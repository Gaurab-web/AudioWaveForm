import { Dimensions, PixelRatio } from "react-native"

const normalize = (size:number):number => {
    const width = Dimensions.get('window').width;
    let scale = width / 320;
    let _newSize = size * scale;

    return Math.round(PixelRatio.roundToNearestPixel(_newSize))
}
export default normalize;