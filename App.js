
import React from "react";
import { ScrollView, View, SafeAreaView, Text, TouchableOpacity, Image, Linking } from "react-native";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-expo";
import JWT from 'expo-jwt';
import { AuthSession } from 'expo';
import { AsyncStorage } from 'react-native';

const REDIRECT_URL = AuthSession.getRedirectUrl();
const scopesArr = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state', 'user-library-modify',
  'user-library-read', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public',
  'playlist-modify-private', 'user-read-recently-played', 'user-top-read'];
const scopes = scopesArr.join(' ');
const credsB64 = btoa(`b7faffeb82e54c01bd8ff7626ff91a00:5d30aab12cbd4746aee1f173e3fbcac8`);
const creds = {}
const clientId = 'b7faffeb82e54c01bd8ff7626ff91a00';

async function setUserData(a, b) {
  try {
    await AsyncStorage.setItem(a, JSON.stringify(b));
  }
  catch (error) {
    console.log(error)
  }
}
async function getUserData(a) {
  try {
    const value = await AsyncStorage.getItem(a);
    if (value !== null) {
      console.log("Retrieved Successfully")
      console.log(value);
    }
    return JSON.parse(value)
  }
  catch (error) {
    console.log(error)
  }
}

const getAuthorizationCode = async () => {
  try {
    const result = await AuthSession.startAsync({
      authUrl:
        'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' +
        clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' +
        encodeURIComponent(REDIRECT_URL),
    })
    return result.params.code
  } catch (err) {
    console.error(err)
  }
}

import { encode as btoa } from 'base-64';

const getTokens = async () => {
  try {
    const authorizationCode = await getAuthorizationCode() //we wrote this function above
    const credsB64 = btoa(`b7faffeb82e54c01bd8ff7626ff91a00:5d30aab12cbd4746aee1f173e3fbcac8`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
        REDIRECT_URL
        }`,
    });
    const responseJson = await response.json();
    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    await setUserData('accessToken', accessToken);
    await setUserData('refreshToken', refreshToken);
    await setUserData('expirationTime', expirationTime);
  } catch (err) {
    console.error(err);
  }
}

export const refreshTokens = async () => {
  try {
    const refreshToken = await getUserData('refreshToken');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await setUserData('accessToken', newAccessToken);
      if (newRefreshToken) {
        await setUserData('refreshToken', newRefreshToken);
      }
      await setUserData('expirationTime', expirationTime);
    }
  } catch (err) {
    console.error(err)
  }
}

async function Login() {
  console.log(REDIRECT_URL);
  const tokenExpirationTime = await getUserData('expirationTime');
  console.log(tokenExpirationTime);
  if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
    await refreshTokens();
  } else {
    await setUserData('accessTokenAvailable', true);
  }
  res = await getUserData('accessTokenAvailable')
  res1 = await getUserData('accessToken');
  res3 = await getUserPlaylists();
  console.log(res);
  console.log(res1);
  console.log(res3);
}

import SpotifyWebAPI from 'spotify-web-api-js';

export const getValidSPObj = async () => {
  const tokenExpirationTime = await getUserData('expirationTime');
  if (new Date().getTime() > tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token
    await refreshTokens();
  }
  const accessToken = await getUserData('accessToken');
  var sp = new SpotifyWebAPI();
  await sp.setAccessToken(accessToken);
  return sp;
}

export const getUserPlaylists = async () => {
  const sp = await getValidSPObj();
  const { id: userId } = await sp.getMe();
  const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 });
  return playlists;
};

const token_stuff = 'ah9qw825keenrgbqndkxr45zg4aja2dkzqt3kvtdxk64wr4ewud3anauzaqzrje4';

const chatClient = new StreamChat('35q8ywpvzf4q', `{{ ${token_stuff} }}`);
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY3JpbXNvbi1raW5nLTcifQ.tN8QY6_PlF4mkeqXRhgMlbyBeGaVgLlQc4Jah9MA1ss';

const user = {
  id: 'crimson-king-7',
  name: 'Moses',
  image:
    'https://s.gravatar.com/avatar/80054b7e4277b1c1d56aea8714ae48c2?s=80',
};

//chatClient.setUser(user, userToken);

{/*
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoibW9ybmluZy1zZWEtOCJ9.9gqHEafvIUou2rzNkl6kuEqaxk-WnL-ELTJ0QF1nLZA';

const user = {
  id: 'morning-sea-8',
  name: 'Morning sea',
  image:
    'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
};

*/}

const token = JWT.encode({
  "user_id": "jon-snow"
}, token_stuff, { algorithm: 'HS256' });

chatClient.setUser({
  id: "jon-snow",
  name: "Jon Snow",
  image: "https://bit.ly/2u9Vc0r",
}, token); // token generated server side

// code for generating new users!
// we could do this with the spotify id ?!

const playlistId = '37i9dQZF1E4p6kkzq7jY43';
const albumId = '1Fp7KUob6eXag90SkbBbnU'
const bgColor = '00FF66';
const fgColor = 'black';

class ChannelScreen extends React.Component {
  render() {
    const channel = chatClient.channel("messaging", "crimson-king-7");
    channel.watch();

    return (
      <SafeAreaView>
        <View style={{
          alignItems: 'center',
        }}>
          <Text style={{
            paddingTop: 30,
            paddingBottom: 30,
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            Okay, So We're gonna have a Sync Music thingyy</Text>
          <Image
            style={{ width: 700, height: 60, resizeMode: 'contain', }}
            source={{ uri: `https://scannables.scdn.co/uri/plain/png/${bgColor}/${fgColor}/640/spotify:playlist:${playlistId}.png` }}
          />
          <TouchableOpacity onPress={() => { Linking.openURL(`spotify://playlist/${playlistId}`) }}>
            {/*
          `android-app://com.spotify.music/spotify/playlist/${playlistId}`
          `spotify://playlist/${playlistId}`
          `spotify://album/${albumId}`
          https://media.giphy.com/media/pNsBooBjruKnm/giphy.gif
          */}
            <Text style={{
              fontSize: 20,
              color: 'rgba(0,0,0, 1)',
              lineHeight: 24,
              textAlign: 'center',
              paddingTop: 15,
              paddingBottom: 15,
              fontWeight: 'bold',
            }}>
              Sync on Spotify
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Login()}>
            <Text style={{
              fontSize: 20,
              color: 'rgba(0,0,0, 1)',
              lineHeight: 24,
              textAlign: 'center',
              paddingTop: 15,
              fontWeight: 'bold',
            }}>
              Log on to Spotify
            </Text>
          </TouchableOpacity>
        </View>

        <Chat client={chatClient}>
          <Channel channel={channel}>
            <View style={{ display: "flex", height: "50%" }}>
              <MessageList />
              <MessageInput />
            </View>
          </Channel>
        </Chat>

      </SafeAreaView>
    );
  }
}

export default class App extends React.Component {
  render() {
    return <ChannelScreen />;
  }
}