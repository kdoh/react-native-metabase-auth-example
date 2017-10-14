import React from 'react';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { Router, Scene, Actions } from 'react-native-router-flux'

import Metabase from './metabase'

class Auth extends React.Component {
    state = {
        username: undefined,
        password: undefined,
        metabaseUrl: undefined
    }
    login = async () => {
        const login = await Metabase.login(this.state)
        if(login) {
          console.log('Metabase Session Token:', login)
            Actions.Home()
        } else {
            console.error('Login failure')
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


class Home extends React.Component {
    async logout () {
        try {
            await Metabase.logout()
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
      const token = await Metabase.fetchSessionTokenFromStorage()
      console.log('Metabase Session Token:', token)
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

