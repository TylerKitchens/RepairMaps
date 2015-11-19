/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
console.yellowBoxEnabled = false;

var React = require('react-native');
var Auth = require('./App/Components/Auth');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} = React;

class RepairMaps extends React.Component{

  render() {
    return (
        <NavigatorIOS
          style={styles.container}
          ref="nav"
          initialRoute={{
            component: Auth,
            title: '',
            backButtonTitle: 'Back',
          }}
          barTintColor="#0F3274"
          tintColor="#fff"
          titleTextColor="#fff"
        />
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

AppRegistry.registerComponent('RepairMaps', () => RepairMaps);
