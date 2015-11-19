'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');
var Separator = require('./Separator');
var TrackedItemDetail = require('./TrackedItemDetail');

var {
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class TrackedItemByATA extends React.Component{

  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: this.ds.cloneWithRows( Object.keys(this.props.ata_items) ),
    }
  }

  _renderHeader() {
    return(
      <View style={styles.rowContainer}>
        <Text style={styles.header}> 
          TIs on {this.props.ata_title}
        </Text>
      </View>
    )
  }

  _renderRow( tracked_item ){
    var item = this.props.ata_items[tracked_item]; // Kludge?

    return(
      <TouchableHighlight
        underlayColor='white'
        onPress={() => { this._getTrackedItemDetail( item.unique_identifier ) }}>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.uid}> 
              {item.unique_identifier} </Text>
            <Text style={styles.description}> 
              {item.short_description} </Text>
          </View>
          <Separator />
        </View>
      </TouchableHighlight>
    )
  }

  _getTrackedItemDetail( uid ){
    this.props.navigator.push({
      title: 'TI Detail',
      component: TrackedItemDetail,
      passProps: {
        uid: uid,
        ti: this.props.uid_items[uid],
        aircraft_object: this.props.aircraft_object,
      }
    });
  }

  render(){
    var items_count = this.props.ata_items.length;
    

    if(!items_count) { 
      return(
        <View style={styles.noresults}>
          <Text> {this.props.ata_title} </Text>
          <Text> has no tracked items </Text>
        </View> 
      )
    }

    return(
      <View style={styles.container}>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderHeader={this._renderHeader.bind(this)} />
      </View>
    )
  }

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  header: {
    color: GLOBAL.COLOR.ORANGE,
    fontSize: 28,
  },
  uid: {
    width: 50,
    color: GLOBAL.COLOR.DARKBLUE,
  },
  description: {
    flex: 1,
    marginLeft: 5,
  },
  noresults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

TrackedItemByATA.propTypes = {
  ata_title: React.PropTypes.string.isRequired,
  ata_items: React.PropTypes.array.isRequired,
  uid_items: React.PropTypes.object.isRequired,
  aircraft_object: React.PropTypes.object.isRequired,
}


module.exports = TrackedItemByATA;

