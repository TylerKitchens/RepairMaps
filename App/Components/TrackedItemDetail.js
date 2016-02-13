'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');
var TIDR = require('./TrackedItemDetailRow');
var TIDRT = require('./TrackedItemDetailRowTouchable');
var WebViewer = require('./WebViewer');
var Dimensions = require('Dimensions');

var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var { width } = Dimensions.get('window');

class TrackedItemDetail extends React.Component{
  constructor(props){
    super(props);

    console.log('dbug ...aircraft_object.ti_url_seed', );
  }

  handlePress(uid){
    this.props.navigator.push({
      title: uid,
      component: TrackedItemDetail,
      passProps: {
        uid: uid,
        ti: this.props.aircraft_object.tracked_item.by_unique_identifier[uid],
        aircraft_object: this.props.aircraft_object,
      }
    })
  }

  goToMoreInfo(url){
    this.props.navigator.push({
      title: `More ${this.props.uid}`,
      component: WebViewer,
      passProps: {
        url: url
      }
    })
  }

  render(){

    let staticItems = [
      { label: 'Operator ID', id: 'operator_id' },
      { label: 'Type', id: 'tracked_item_type' },
      { label: 'Subtype', id: 'tracked_item_subtype' },
      { label: 'ATA', id: 'ata_full' },
      { label: 'Status', id: 'status' },
      { label: 'RTS', id: 'rts' },
      { label: 'Location', id: 'location' },
      { label: 'RSC', id: 'rsc_name' },
      { label: 'Approval Basis', id: 'approval_basis' },
    ];

    let staticRows = staticItems.map( item =>
        <TIDR 
          key={item.id}
          label={item.label} 
          value={this.props.ti[item.id]} 
        />
      );

let more_info_url = 
  this.props.aircraft_object.ti_url_seed 
  + '?'
  + this.props.aircraft_object.uid_qstring_key
  + '='
  + this.props.uid;



    return(
      <View style={styles.container}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}> 
            {this.props.uid} - {this.props.ti.short_description}
          </Text>
          <Text style={styles.subtitle}>
            created by {this.props.ti.created_by_user_name} on {this.props.ti.create_date}
          </Text>
        </View>

        <View style={styles.detailContainer}>

          {staticRows}

          <TIDRT 
            label='Superseded By' 
            uids={[this.props.ti.superseded_by]} 
            onUidPress = { uid => this.handlePress(uid) } 
          />
          <TIDRT 
            label='Supersedes' 
            uids={this.props.ti.supersedes}
            onUidPress = { uid => this.handlePress(uid) }  
          />

          <TouchableHighlight
            onPress={() => this.goToMoreInfo( more_info_url )}>
            <Text
              style={styles.moreBtn}>
              Find More Info Online &gt;&gt;
            </Text>
          </TouchableHighlight>
 
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  titleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    color: GLOBAL.COLOR.ORANGE,
    fontSize: 20,
  },
  subtitle: {
    color: GLOBAL.COLOR.DARKGRAY,
    fontSize: 10,
  },
  detailContainer: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  moreBtn: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

TrackedItemDetail.propTypes = {
  uid: React.PropTypes.string.isRequired,
  ti: React.PropTypes.object,
  aircraft_object: React.PropTypes.object.isRequired,
}

module.exports = TrackedItemDetail;