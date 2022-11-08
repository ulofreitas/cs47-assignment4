import { View, Text } from 'react-native';

export default function DetailedSongScreen({navigation, route}) {
    let url = route.params
    return (
        <View>
            <Text>
                This will be the song preview screen!
            </Text>
        </View>
    );
}