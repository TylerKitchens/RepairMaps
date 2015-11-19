'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');
var UIDButton = require('./UIDButton');

var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class TrackedItemDetailRowTouchable extends React.Component{
  
  constructor(props){
    super(props);
  }



  render(){
    let buttons = this.props.uids.map(uid => 
        <UIDButton 
          key={uid} 
          uid={uid}  
          onUidPress={() => this.props.onUidPress(uid)}
        />
    );

    return(
      <View style={styles.itemContainer}>
        <Text style={styles.label}>
          {this.props.label}:&nbsp; 
        </Text>
        {buttons}
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
});

TrackedItemDetailRowTouchable.propTypes = {
  label: React.PropTypes.string.isRequired,
  uids: React.PropTypes.array.isRequired,
  onUidPress: React.PropTypes.func.isRequired,
}

module.exports = TrackedItemDetailRowTouchable;