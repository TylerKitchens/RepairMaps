'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');
var Swipeout = require('react-native-swipeout');
var Separator = require('./Separator');
var Api = require('../Utils/Api');
var TrackedItemIndex = require('./TrackedItemIndex');

var {
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;


class AircraftList extends React.Component{

  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.aircraft_list.aircraft),
      isLoading: false,
      showingCache: false,
      cacheTimestamps: {},
    };
  }

  componentWillMount(){
    this._refreshList('didMount');
  }

  componentWillReceiveProps(){
    this._refreshList('componentWillReceiveProps');
  }

  _refreshList(caller){
    Api.getCachedTimestamps()
      .then(timestamps => {
        console.log('dbug REFRESH ListView called from [%s], updating with [%O]', caller, timestamps);
        this.setState({
          cacheTimestamps: timestamps,
          dataSource: this.ds.cloneWithRows(this.props.aircraft_list.aircraft),
        });
      });
  }

  _renderHeader(){
    return(
      <ActivityIndicatorIOS
        style={styles.activityIndicator}
        animating={this.state.isLoading}
        color={GLOBAL.COLOR.ORANGE}
        size="large" />
    )
  }

  _renderRow( aircraft ){
    let aircraft_id = aircraft.reg_number;
    let dateCached = this.state.cacheTimestamps[aircraft_id] ? this.state.cacheTimestamps[aircraft_id] : 'never'; 

    var swipeoutBtns = [
      {
        text: 'Clear Cache',
        color: '#fff',
        backgroundColor: '#c00',
        type: 'secondary',
        onPress: () => this._clearCache( aircraft_id ),
      },
      // {
      //   text: 'Refresh Cache',
      //   color: '#fff',
      //   backgroundColor: '#060',
      //   type: 'primary',
      //   onPress: function(){this._refreshCache( aircraft_id )}.bind(this),
      // },
    ]

    return (
    <Swipeout 
          right={swipeoutBtns}
          autoClose='true'
          backgroundColor= 'transparent'> 
      <TouchableHighlight
        underlayColor='white'
        onPress={() => { this._handleTap( aircraft_id ) }}>
        <View>
            <View style={styles.rowContainer}>
              <View style={styles.countContainer}> 
                <Text style={styles.count}>
                  {aircraft.ti_count} 
                </Text>
                <Text style={styles.countLabel}>
                  TI&apos;s
                </Text>
              </View>
              <View style={styles.aircraftContainer}>
                <Text style={styles.aircraft}> 
                  {aircraft_id} 
                </Text>
                <Text style={styles.cacheLabel}>
                  last cached on: {dateCached}
                </Text>
              </View>
            </View>
          <Separator />
        </View>
      </TouchableHighlight>
    </Swipeout>
    )
  }

  _clearCache( aircraft_id ){
    Api.clearCachedItem( aircraft_id, this._refreshList );
  }

  _handleTap( aircraft_id ){
    this.setState({
      isLoading: true,
    },
    () => 
      Api.getTrackedItems( aircraft_id )
        .then( aircraft_object => this._handleResponse( aircraft_object ))
    );
  }

  _handleResponse(aircraft_object){
    this.setState({
      isLoading: false,
    })

    this.props.navigator.push({
      title: 'TI Lookup',
      component: TrackedItemIndex,
      passProps: {aircraft_object: aircraft_object}
    });
  }

  render(){
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderHeader={this._renderHeader.bind(this)} />

        <TouchableHighlight
          onPress={()=>this._refreshList('refresh button')}>
          <Text style={{fontSize: 16, color: '#eee', alignSelf: 'center'}}>Refresh List</Text>
        </TouchableHighlight>
      </View>
    );
  }
};


var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
  },

  countContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  count: {
    color: GLOBAL.COLOR.ORANGE,
    fontSize: 20,
  },
  countLabel: {
  color: GLOBAL.COLOR.DARKGRAY,
  fontSize: 10,
},

  aircraftContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  aircraft: {
    color: GLOBAL.COLOR.ORANGE,
    fontSize: 20,
  },
  cacheLabel: {
  color: GLOBAL.COLOR.DARKGRAY,
  fontSize: 10,
},
activityIndicator: {
  alignSelf: 'center',
},

});

AircraftList.propTypes = {
  aircraft_list: React.PropTypes.object.isRequired,
  user_id: React.PropTypes.string.isRequired,
}

module.exports = AircraftList;
