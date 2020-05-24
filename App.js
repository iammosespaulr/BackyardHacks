import React, { Component } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Initial from './Initial.js';
import Stream from './Stream.js';

import { AuthSession } from 'expo';
import { AsyncStorage } from 'react-native';

const REDIRECT_URL = AuthSession.getRedirectUrl();
const scopesArr = [
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-library-modify',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-recently-played',
    'user-top-read'
];
const scopes = scopesArr.join(' ');

const credsB64 = btoa(`b7faffeb82e54c01bd8ff7626ff91a00:5d30aab12cbd4746aee1f173e3fbcac8`);
const clientId = 'b7faffeb82e54c01bd8ff7626ff91a00'; // DQ's

// const credsB64 = btoa(`466c291864774341a1780bc086782d47:f036d03b0e0b4904861d0fcfab0578be`);
// const clientId = '466c291864774341a1780bc086782d47'; //( Mine )

export async function setUserData(a, b) {
    try {
        await AsyncStorage.setItem(a, JSON.stringify(b));
    } catch (error) {
        console.log(error);
    }
}
export async function getUserData(a) {
    try {
        const value = await AsyncStorage.getItem(a);
        if (value !== null) {
            console.log('Retrieved Successfully');
            console.log(value);
        }
        return JSON.parse(value);
    } catch (error) {
        console.log(error);
    }
}

export const getAuthorizationCode = async() => {
    try {
        const result = await AuthSession.startAsync({
            authUrl: 'https://accounts.spotify.com/authorize' +
                '?response_type=code' +
                '&client_id=' +
                clientId +
                (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
                '&redirect_uri=' +
                encodeURIComponent(REDIRECT_URL)
        });
        return result.params.code;
    } catch (err) {
        console.error(err);
    }
};

import { encode as btoa } from 'base-64';

export const getTokens = async() => {
    try {
        const authorizationCode = await getAuthorizationCode(); //we wrote this function above
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credsB64}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${REDIRECT_URL}`
        });
        const responseJson = await response.json();
        // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
        const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = responseJson;

        const expirationTime = new Date().getTime() + expiresIn * 1000;
        await setUserData('accessToken', accessToken);
        await setUserData('refreshToken', refreshToken);
        await setUserData('expirationTime', expirationTime);
    } catch (err) {
        console.error(err);
    }
};

export const refreshTokens = async() => {
    try {
        const refreshToken = await getUserData('refreshToken');
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credsB64}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`
        });
        const responseJson = await response.json();
        if (responseJson.error) {
            await getTokens();
        } else {
            const {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                expires_in: expiresIn
            } = responseJson;

            const expirationTime = new Date().getTime() + expiresIn * 1000;
            await setUserData('accessToken', newAccessToken);
            if (newRefreshToken) {
                await setUserData('refreshToken', newRefreshToken);
            }
            await setUserData('expirationTime', expirationTime);
        }
    } catch (err) {
        console.error(err);
    }
};

export async function Login() {
    console.log(REDIRECT_URL);
    const tokenExpirationTime = await getUserData('expirationTime');
    console.log(tokenExpirationTime);

    if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
        await refreshTokens();
    } else {
        await setUserData('accessTokenAvailable', true);
    }
    return true
}

import SpotifyWebAPI from 'spotify-web-api-js';

export const getValidSPObj = async() => {
    const tokenExpirationTime = await getUserData('expirationTime');
    if (new Date().getTime() > tokenExpirationTime) {
        // access token has expired, so we need to use the refresh token
        await refreshTokens();
    }
    const accessToken = await getUserData('accessToken');
    var sp = new SpotifyWebAPI();
    await sp.setAccessToken(accessToken);
    return sp;
};

export const getUserPlaylists = async() => {
    const sp = await getValidSPObj();
    const { id: userId } = await sp.getMe();
    const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 });
    return playlists;
};

export const getUserCurrentPlayBack = async() => {
    const sp = await getValidSPObj();
    const playback = await sp.getMyCurrentPlaybackState();
    return playback;
};

export const getUserDeviceId = async() => {
  const sp = await getValidSPObj();
  const playback = await sp.getMyDevices();
  console.log(playback);
  return playback;
};

export const Play = async() => {
  const sp = await getValidSPObj();
  sp.play({
    "context_uri": "spotify:playlist:37i9dQZF1E4p6kkzq7jY43",
    "offset": {
      "position": 5
    },
    "position_ms": 0
  });
};

export const playPlayList = async() => {
    const sp = await getValidSPObj();
    const { device: playback } = await sp.getMyCurrentPlaybackState();
    sp.play(playback.id);
};

export const pausePlayList = async() => {
    const sp = await getValidSPObj();
    const { device: playback } = await sp.getMyCurrentPlaybackState();
    sp.pause(playback.id);
};

export const seekPlayList = async() => {
    const sp = await getValidSPObj();
    const playback = await sp.getMyCurrentPlaybackState();
    sp.seek(playback.progress_ms, playback.device.id);
};

const App = createSwitchNavigator({
    initial: { screen: Initial },
    stream: { screen: Stream }
});

const AppContainer = createAppContainer(App);

export default AppContainer;