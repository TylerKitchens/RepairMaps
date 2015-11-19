'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');
var Header = require('./Header');
var Api = require('../Utils/Api');
var AircraftList = require('./AircraftList');
// var ActivityIndicator = require('./ActivityIndicator');
var deviceWidth = require('Dimensions').get('window').width;

var {
  ActivityIndicatorIOS,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class Auth extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      showingCache: false,
      user_id: '0',
    }
  }



  _handleLogin() {
    this.setState({
      isLoading: true,
      user_id: '1',
    },
    () => 
      Api.getAircraftList( this.state.user_id )
        .then( aircraft_list => this._handleResponse( aircraft_list ))
    );
  }

  _handleResponse( aircraft_list ){
    this.setState({
      isLoading: false,
    })

    this.props.navigator.push({
      title: 'Aircraft List',
      component: AircraftList,
      passProps: {
        aircraft_list,
        user_id: this.state.user_id,
      }
    });
  }

  render(){
    return(
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage} 
          source={require('../Images/background.jpg')} />
        <Header />
        <View style={styles.loginContainer}>
          <ActivityIndicatorIOS
            animating={this.state.isLoading} 
            color="#fff"
            size="large" />
          <TouchableHighlight
            style={styles.loginButton}
            underlayColor="white"
            onPress={this._handleLogin.bind(this)} >
            <Text style={styles.loginText}> Login </Text>
          </TouchableHighlight>
          
        </View>
      </View>
    )
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3274',
  },
  loginButton: {
    alignSelf: 'center',
    backgroundColor: '#ddd',
  },
  loginText: {
    fontSize: 28,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  loginContainer: {
    backgroundColor: 'transparent',
    marginTop: 100,
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    // top: 0,
    // right: 0,
    width: deviceWidth + 20, height: 414, // the +20 moves the center of the picture to the right 20px
  }
});

Auth.propTypes = {}

module.exports = Auth;