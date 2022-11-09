import { StyleSheet, SafeAreaView, Text, Pressable, Image, FlatList, View } from "react-native";
import { useSpotifyAuth, millisToMinutesAndSeconds } from "./utils";
import { Themes } from "./assets/Themes";

import { Ionicons } from '@expo/vector-icons';
import { WebView } from "react-native-webview";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, StackActions, Navigation } from "@react-navigation/native";


const Stack = createStackNavigator();

const SpotifyAuthButton = (props) => {
  return (
    <Pressable 
      style={styles.authenticate_button}
      onPress={props.authFunction}>
      <Image
        style={styles.spotify_logo}
        source={require('./assets/spotify-logo.png')}>
      </Image>
      <Text
        style={{
          color: Themes.colors.white,
          fontWeight: 'bold',
          fontSize: 16,
        }}>
        CONNECT WITH SPOTIFY
      </Text>
    </Pressable>
  )
}

const DetailedSongScreen = ({navigation, route}) => {
  let item_object = route.params.song_item
  const song_details = item_object["item"]["external_urls"]["spotify"]
  return (
    <WebView
      source={{
        uri: song_details
      }}
    />
  )
}

const SongPreviewScreen = ({navigation, route}) => {
  const item_object = route.params.song_item
  const track_preview_url = item_object["item"]["preview_url"]
  return (
    <WebView
      source={{
        uri: track_preview_url
      }}
    />
  )
}

const renderSong = (item, navigation) => {
  let song_title = item["item"]["name"]
  let album_image = item["item"]["album"]["images"][0]["url"]
  let artists_array = item["item"]["artists"]
  let artists = ""
  for (let i = 0; i < artists_array.length; i++) {
    if (i == (artists_array.length - 1)) {
      artists += artists_array[i]["name"]
    } else {
      artists += artists_array[i]["name"] + ", "
    }
  }
  
  let album_name = item["item"]["album"]["name"]
  let duration_ms = item["item"]["duration_ms"]
  
  return (
    <View style={styles.track}>
      <Pressable 
        style={styles.play_button} 
        onPress = {() => { 
          navigation.navigate('SongPreviewScreen', {
            song_item: item,
          });
      }}>
          <Ionicons name="play-circle" size={24} color={Themes.colors.spotify} />
      </Pressable>
      <Pressable 
        style={styles.song_row}
        onPress = {() => { 
          navigation.navigate('DetailedSongScreen', {
            song_item: item,
          });
        }}>
        <Image
            style={styles.album_image}
            source={{uri: album_image }} 
        />
        <View style={styles.song_title_artist}>
            <Text numberOfLines={1} style={styles.song_title}>
              {song_title}
            </Text>
            <Text numberOfLines={1} style={styles.song_artist}>
                {artists}
            </Text>
        </View>
        <Text numberOfLines={1} style={styles.song_album}>
          {album_name}
        </Text>
        <Text style={styles.song_duration}>
          {millisToMinutesAndSeconds(duration_ms)}
        </Text>  
      </Pressable>
    </View>
  )
}

const SongsList = (props) => {
  return (
    <SafeAreaView style={styles.top_tracks_background}>
      <View style={styles.my_top_tracks_header}>
        <Image
          style={styles.spotify_logo}
          source={require('./assets/spotify-logo.png')}>
        </Image>
        <Text
          style={{
            color: Themes.colors.white,
            fontWeight: 'bold',
            fontSize: 24,
            paddingLeft: 10,
          }}> 
          My Top Tracks
        </Text>
      </View>

      <FlatList style={styles.songList}
        data={props.songs}
        renderItem={(item) => renderSong(item, props.navigation)}
        keyExtractor={(item, index) => index}
        />
    </SafeAreaView>
  )
}

const HomeScreen = ({navigation}) => {
  const { token, tracks, getSpotifyAuth } = useSpotifyAuth();

  let contentDisplayed = null;

  if (token) {
    contentDisplayed = <SongsList songs={tracks} navigation={navigation}/>
  } else {
    contentDisplayed = <SpotifyAuthButton authFunction={getSpotifyAuth} />
  }

  return (
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name = "HomeScreen" 
          component={HomeScreen} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="DetailedSongScreen" 
          component={DetailedSongScreen}
          options={{headerStyle: {backgroundColor: Themes.colors.background}, headerTitleStyle: {color: Themes.colors.white}}}
        />
        <Stack.Screen 
          name = "SongPreviewScreen" 
          component={SongPreviewScreen}
          options={{headerStyle: {backgroundColor: Themes.colors.background}, headerTitleStyle: {color: Themes.colors.white}}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  flatlist: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: "blue",
    borderRadius: "100%",
    borderRadius: 99999,
    width: '75%',
    aspectRatio: 733/133,
    flexDirection: 'row',
  },
  authenticate_button: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Themes.colors.spotify,
    borderRadius: "100%",
    borderRadius: 99999,
    width: '80%',
    aspectRatio: 733/133,
    flexDirection: 'row',
  },
  spotify_logo: {
    width: '10%',
    aspectRatio: 1/1,
  },
  top_tracks_background: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  my_top_tracks_header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '5%',
  },
  songList: {
    height: '85%',
    width: '100%',
  }, 
  track: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-evenly',
    height: 70, 
  },
  play_button: {
    textAlign: 'center',
    width: '8%',
  },
  song_row: {
    width: '92%',
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  album_image: {
    width: '15%',
    aspectRatio: 640/640,
  },
  song_title_artist: {
    width: '40%',
    color: Themes.colors.white,
    fontSize: 14
  },
  song_title: {
    color: Themes.colors.white,
    fontSize: 14
    
  },
  song_artist: {
    color: Themes.colors.gray,
    fontSize: 14
    
  },
  song_album: {
    width: '30%',
    color: Themes.colors.white,
    fontSize: 14
    
  },
  song_duration: {
    width: '12%',
    color: Themes.colors.white,
    fontSize: 14
  },
});
