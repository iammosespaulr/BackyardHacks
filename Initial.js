import React, { PureComponent } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

import {Login} from './App.js';

export default class InitialScreen extends PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            spotifyInitialized: false
        };
        this.spotifyLoginButtonWasPressed = this.spotifyLoginButtonWasPressed.bind(this);
    }

    goToPlayer() {
        this.props.navigation.navigate('stream');
    }

    async spotifyLoginButtonWasPressed() {
        res = await Login()
        if (res == true)
        {
            this.goToPlayer()
        }
    }

    render() {
        if (this.state.spotifyInitialized) {
            return (
            <View style={styles.container}>
                <ActivityIndicator animating={true}
                    style={styles.loadIndicator}>
                </ActivityIndicator>
                <Text style={styles.loadMessage}>
                    Loading... 
                </Text> 
            </View >
            );
        } else {
            return (<View style={styles.container}>
                <Text style={styles.greeting}>
                    Fireside Partay! </Text>
                <TouchableHighlight onPress={this.spotifyLoginButtonWasPressed} style={styles.spotifyLoginButton}>
                     <Text style={styles.spotifyLoginButtonText}> Log into Spotify </Text>
                </TouchableHighlight>
            </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    loadIndicator: {
        //
    },
    loadMessage: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    spotifyLoginButton: {
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: '#00FF66',
        overflow: 'hidden',
        width: 250,
        height: 60,
        margin: 20,
    },
    spotifyLoginButtonText: {
        fontSize: 25,
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold'
    },

    greeting: {
        fontSize: 45,
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold'
    },
});