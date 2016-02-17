'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');
var Separator = require('./Separator');
var TISearchField = require('./TISearchField');
var TrackedItemByATA = require('./TrackedItemByATA');
var TrackedItemDetail = require('./TrackedItemDetail');

var {
  AlertIOS,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;


class AircraftDetails extends React.Component{

  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: this.ds.cloneWithRows( Object.keys(this.props.aircraft_object.tracked_item.by_ata) ),
    };
  }

  _renderRow( group ){
    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={() => { this._getATAItems(group) }}>
        <View>
          <View style={styles.rowContainer}>
            <Text> {group} </Text>
            <Text style={styles.subtitle}>({this.props.aircraft_object.tracked_item.by_ata[group].length} TIs) </Text>
          </View>
          <Separator />
        </View>
      </TouchableHighlight>
    )
  }

  _renderHeader(){
    return(
      <Text style={styles.browseByHeader}>
        Browse by ATA</Text>
    )
  }

  _getATAItems( group ) {
    var ata_title = group.split(' - ', 2)[1];

    this.props.navigator.push({
      title: ata_title,
      component: TrackedItemByATA,
      passProps: {
        ata_title: ata_title,
        ata_items: this.props.aircraft_object.tracked_item.by_ata[group],
        uid_items: this.props.aircraft_object.tracked_item.by_unique_identifier,
        aircraft_object: this.props.aircraft_object,
      }
    });
  }

  handleSearch(uid){
    console.log('[user-action] searches for UID [%s] on TrackedItemIndex', uid);

    let item = this.props.aircraft_object.tracked_item.by_unique_identifier[uid];

    if(item === undefined){
      console.log('[status] search fails');

      AlertIOS.alert(
        uid +' Not Found',
        'Just as Geraldo Rivera came up empty searching Al Capone\'s vault, we couldn\'t find a tracked item matching the code you entered.',
        [
          {text: 'Ok, I\'ll Try Harder', onPress: () => console.log('[user-action] dismiss error modal')},
        ]
      )
    }else{
      console.log('[status] search succeeds');
      this.setState({ showError: false });

        this.props.navigator.push({
          title: uid,
          component: TrackedItemDetail,
          passProps: {
            uid: uid,
            ti: item,
            aircraft_object: this.props.aircraft_object,
          }
        })      
    }


  }

  render(){

    return(
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.header}> 
            {this.props.aircraft_object.aircraft.reg_number} 
          </Text>
        </View>

        <TISearchField onSearchSubmit={this.handleSearch.bind(this)} />

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
    marginTop: 60,
  },
  browseByHeader: {
    paddingLeft: 10,
  },
  rowContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  header: {
    color: GLOBAL.COLOR.ORANGE,
    fontSize: 28,
  },
  subtitle: {
    color: GLOBAL.COLOR.DARKGRAY,
    fontSize: 10,
  },
});

AircraftDetails.propTypes = {
  aircraft_object: React.PropTypes.object.isRequired,
}

module.exports = AircraftDetails;