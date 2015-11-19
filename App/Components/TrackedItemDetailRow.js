'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');

var {
  StyleSheet,
  Text,
  View,
} = React;

class TrackedItemDetailRow extends React.Component{
  
  constructor(props){
    super(props);

  }

  render(){
    return(
      <View style={styles.itemContainer}>
        <Text style={styles.label}>
          {this.props.label}:&nbsp; 
        </Text>
        <Text style={styles.value}> 
          {this.props.value}
        </Text>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    color: GLOBAL.COLOR.DARKGRAY,
  },
  value: {},
  button: {
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  buttonText: {
    padding: 3,
  },
});

TrackedItemDetailRow.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
}

module.exports = TrackedItemDetailRow;