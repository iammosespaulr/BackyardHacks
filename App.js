import React, { Component } from 'react';
import {
    Alert,
    Linking,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    createSwitchNavigator,
    createAppContainer
} from 'react-navigation';

import Initial from './Initial.js';
import Stream from './Stream.js';

const App = createSwitchNavigator({
    initial: { screen: Initial },
    stream: { screen: Stream },
});

const AppContainer = createAppContainer(App);

export default AppContainer;