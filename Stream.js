import React from "react";
import { ScrollView, View, SafeAreaView, Text, TouchableOpacity, Image, Linking } from "react-native";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-expo";

import {} from './App.js';

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

chatClient.setUser(user, userToken);

{/*
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoibW9ybmluZy1zZWEtOCJ9.9gqHEafvIUou2rzNkl6kuEqaxk-WnL-ELTJ0QF1nLZA';
const user = {
  id: 'morning-sea-8',
  name: 'Morning sea',
  image:
    'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
};
import JWT from 'expo-jwt';
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
*/}

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