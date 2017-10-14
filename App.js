import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { Router, Scene, Actions } from 'react-native-router-flux'

class Auth extends React.Component {
    state = {
        username: undefined,
        password: undefined,
        metabaseUrl: undefined
    }
    login = () => {
        const { username, password, metabaseUrl } = this.state
        fetch(`https://${metabaseUrl}/api/session`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            this.storeMetabaseSessionToken(response.id)
            Actions.Home()
        })
    }
    async storeMetabaseSessionToken (token) {
        try {
            await AsyncStorage.setItem('metabaseSessionToken', token)
        } catch (error) {
            console.error(error)
        }
    }
    render () {
        return (
            <View>
                <Text>You are logged out</Text>
                <TextInput
                    autoCapitalize='none'
                    autoCorrect={false}
                    editable={true}
                    placeholder='MB Url'                    
                    onChangeText={metabaseUrl => this.setState({metabaseUrl})}
                    value={this.state.metabaseUrl}
                />
                <TextInput
                    autoCapitalize='none'
                    editable={true}
                    placeholder='Username'                    
                    onChangeText={username => this.setState({username})}
                    value={this.state.username}
                />
                <TextInput
                    autoCapitalize='none'
                    editable={true}
                    placeholder='Password'                    
                    onChangeText={password => this.setState({password})}
                    secureTextEntry={true}
                    value={this.state.password}
                />
                <TouchableOpacity onPress={this.login}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

function metabaseRequest (url) {
    
}

const fetchSessionTokenFromStorage = async () => {
    const token = await AsyncStorage.getItem('metabaseSessionToken').then(token => {
        return token
    })
    return token
}


class Home extends React.Component {
    async logout () {
        try {
            await AsyncStorage.removeItem('metabaseSessionToken')
            Actions.Auth()
        } catch (error) {
            console.error(error)
        }
    }
    componentDidMount () {
    }
    render () {
        return (
            <View>
                <Text>You are logged in</Text>
                <TouchableOpacity onPress={this.logout}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class App extends React.Component {
  state = {
      hasSession: false,
      isLoaded: false
  }
  async componentDidMount () {
      const token = await fetchSessionTokenFromStorage()
      this.setState({
          hasSession: token !== null,
          isLoaded: true
      })
  }
  render() {
      if(!this.state.isLoaded) {
        return <ActivityIndicator />
      } else {
        return (
            <Router>
                <Scene key='root'>
                    <Scene
                        component={Auth}
                        initial={!this.state.hasSession}
                        name='Auth'
                        key='Auth'
                    />
                    <Scene
                        component={Home}
                        initial={this.state.hasSession}
                        name='Home'
                        key='Home'
                    />
                </Scene>
            </Router>
        );
      }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
