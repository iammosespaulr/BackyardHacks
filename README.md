<p align="center">
  <a href="https://getstream.io/chat/react-native-chat/tutorial/"><img src="https://i.imgur.com/SRkDlFX.png" alt="react native chat" width="60%" /></a>
</p>

### Expo package

```bash
yarn global add expo-cli
# expo-cli supports following Node.js versions:
# * >=8.9.0 <9.0.0 (Maintenance LTS)
# * >=10.13.0 <11.0.0 (Active LTS)
# * >=12.0.0 (Current Release)
expo init StreamChatExpoExample
cd StreamChatExpoExample

# Add chat expo package
yarn add stream-chat-expo

# If you are using stream-chat-expo <= 0.4.0 and expo <= 34, then you don't need to add @react-native-community/netinfo as dependency, since previously we used NetInfo from react-native package.
expo install @react-native-community/netinfo expo-document-picker expo-image-picker expo-permissions
```

Please check the [example](https://github.com/GetStream/stream-chat-react-native/blob/master/examples/ExpoMessaging/App.js) to see usage of the components.

OR you can swap [this file](https://github.com/GetStream/stream-chat-react-native/blob/master/examples/ExpoMessaging/App.js) for your `App.js` in the root folder with by following these additional steps:

```bash
yarn add react-navigation@3.2.1 react-native-gesture-handler react-native-reanimated
```

and finally

```bash
yarn start
```
