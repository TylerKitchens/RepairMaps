'use strict';

var React = require('react-native');
var Api = require('../Utils/Api');
var GLOBAL = require('../Globals');
var Separator = require('./Separator');
var Swipeout = require('react-native-swipeout');
var TISearchField = require('./TISearchField');
var TrackedItemDetail = require('./TrackedItemDetail');
var TrackedItemIndex = require('./TrackedItemIndex');

var {
  ActivityIndicatorIOS,
  AlertIOS,
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
    this._refreshList('componentWillMount');
  }

  componentWillReceiveProps(){
    this._refreshList('componentWillReceiveProps');
  }

  _refreshList(caller){
    Api.getCachedTimestamps()
      .then(timestamps => {
        console.log('[status] REFRESH AircraftList ListView called from [%s], updating with [%O]', caller, timestamps);
        this.setState({
          cacheTimestamps: timestamps,
          dataSource: this.ds.cloneWithRows(this.props.aircraft_list.aircraft),
        });
      });
  }

  _renderHeader(){

    return(
      <View style={{paddingTop: 5}}>
        <TISearchField onSearchSubmit={this.handleSearch.bind(this)} />
        <Text style={styles.listTitle}>
          Aircraft List
        </Text>

        <ActivityIndicatorIOS
          style={styles.activityIndicator}
          animating={this.state.isLoading}
          color={GLOBAL.COLOR.ORANGE}
          size="large" />
      </View>
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
        .then( aircraft_object => this._handleTapResponse( aircraft_object ))
    );
  }

  _handleTapResponse(aircraft_object){
    this.setState({
      isLoading: false,
    })

    this.props.navigator.push({
      title: 'TI Lookup',
      component: TrackedItemIndex,
      passProps: {aircraft_object: aircraft_object}
    });
  }

  _handleSearchResponse(uid, aircraft_object){
    this.setState({ isLoading: false });
    var ti = aircraft_object.tracked_item.by_unique_identifier[uid]

    this.props.navigator.push({
      title: uid,
      component: TrackedItemDetail,
      passProps: { uid, ti, aircraft_object }
    })
  }



  handleSearch(uid){
    console.log('[user-action] searches for UID [%s] on AircraftList', uid);
    
    var aircraft = this.props.aircraft_list.aircraft;
    var idx = aircraft.findIndex((el)=>{
        return el.TIs.indexOf(uid) >= 0;
    });

    if(idx > -1){
      console.log('[status] search succeeds');

      var aircraft_id = aircraft[idx].reg_number;
      this.setState({
        isLoading: true}, 
        () => 
          Api.getTrackedItems( aircraft_id )
            .then( aircraft_object => this._handleSearchResponse( uid, aircraft_object ))
      );

    }else{
      console.log('[status] search fails');

      AlertIOS.alert(
        uid +' Not Found',
        'Just as Geraldo Rivera came up empty searching Al Capone\'s vault, we couldn\'t find a tracked item matching the code you entered.',
        [
          {text: 'Ok, I\'ll Try Harder', onPress: () => console.log('[user-action] dismiss error modal')},
        ]
      )
    }

    // let item = this.props.aircraft_object.tracked_item.by_unique_identifier[uid];

    // if(item === undefined){
    //   console.log('[status] search fails');

    //   AlertIOS.alert(
    //     uid +' Not Found',
    //     'Just as Geraldo Rivera came up empty searching Al Capone\'s vault, we couldn\'t find a tracked item matching the code you entered.',
    //     [
    //       {text: 'Ok, I\'ll Try Harder', onPress: () => console.log('[user-action] dismiss error modal')},
    //     ]
    //   )
    // }else{
    //   console.log('[status] search succeeds');
    //   this.setState({ showError: false });

    //     this.props.navigator.push({
    //       title: uid,
    //       component: TrackedItemDetail,
    //       passProps: {
    //         uid: uid,
    //         ti: item,
    //         aircraft_object: this.props.aircraft_object,
    //       }
    //     })      
    // }
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
  listTitle: {
    marginTop: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: GLOBAL.COLOR.DARKBLUE,
    color: 'white',
    alignSelf: 'stretch',
    alignItems: 'center',
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
