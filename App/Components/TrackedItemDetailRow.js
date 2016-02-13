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

    this.state = {
      containerWidth: 0,
      labelWidth: 0,
    }
  }

  render(){
    return(
      <View style={styles.itemContainer} onLayout={(ev)=>this.setState({containerWidth: ev.nativeEvent.layout.width})}>
        <Text style={styles.label} onLayout={(ev)=>this.setState({labelWidth: ev.nativeEvent.layout.width})}>
          {this.props.label}:&nbsp; 
        </Text>
        <Text style={[styles.value, {width: this.state.containerWidth - this.state.labelWidth}]}> 
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