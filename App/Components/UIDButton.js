'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');
var TrackedItemDetail = require('./TrackedItemDetail');

var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class UIDButton extends React.Component{
  
  constructor(props){
    super(props);
  }


  render(){

    if(!this.props.uid){
      return( <View /> )
    }

    return(
      <TouchableHighlight
        style={styles.button}
        onPress={this.props.onUidPress}
        underlayColor={GLOBAL.COLOR.ORANGE} > 
        
        <Text style={styles.buttonText}>
          {this.props.uid}
        </Text>
      
      </TouchableHighlight>
    )
  }

}

var styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
  },
  buttonText: {
    padding: 3,
    textDecorationLine: 'underline',
    color: '#00f',
  },
});



UIDButton.propTypes = {
  uid: React.PropTypes.string.isRequired,
  onUidPress: React.PropTypes.func.isRequired,
}

module.exports = UIDButton;
