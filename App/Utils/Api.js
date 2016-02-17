'use strict';


var React = require('react-native');
var GLOBAL = require('../Globals');
var moment = require('moment');

var {
  AsyncStorage,
} = React;

var Api = {

  nameSpacedKey( key ){
    return GLOBAL.APP_NAMESPACE.concat(key);
  },

  getAircraftList( user_id ) {
    this.getAllKeys(); // dbug
    const url = GLOBAL.BASE_URL;
    const response = this.getNetworkItem(url, user_id, 'Aircraft List');
    return response;
  },

  getTrackedItems( aircraft_id ) {
    const url = GLOBAL.BASE_URL + aircraft_id;
    const response = this.getNetworkItem(url, aircraft_id, 'Tracked Items');
    return response
  },

  async getNetworkItem( url, key, asset_name ){
    try{
      let response = await fetch(url);
      this.setCachedItem( key, response._bodyInit );
      response = response.json();
      return response;
    }
    catch(error){
      console.warn('[status] WARN: unable to retrieve '+ asset_name +' ['+ key +'] from the network, so attempting to grab cache instead...', error.message);
      let response = await this.getCachedItem( key )
      response.isCachedVersion = true;
      return response;
    }
  },

  async getCachedItem( key ){
    try{
      let response = await AsyncStorage.getItem( this.nameSpacedKey(key) );
      response = JSON.parse(response);
      return JSON.parse(response);
    }
    catch(error){
      console.error('[status] ERROR: unable to retrieve cached data for key '+ key +' because...', error.message)
      return false;
    }
  },

  setCachedItem( key, val ){
    let valStr = JSON.stringify(val);

    AsyncStorage.setItem(this.nameSpacedKey( key ), valStr)
      .then( console.info('[status] SUCCESS: cached the following data for key [%s] %O', key, val))

    this.setCachedTimestamps( key );
  },

  clearCachedItem( key, cb ){
    // TODO: add toast-like feedback to confirm the action
    const item = AsyncStorage.removeItem( this.nameSpacedKey(key) )
    const timestamp = this.clearCachedTimestamp(key);

    return Promise.all([item,timestamp]).then(() => cb());
  },

  getCachedTimestamps(){
    const store = this.nameSpacedKey('cacheTimestamps');
    
    return AsyncStorage.getItem(store)
      .then(result => { 
        if(!result){ 
          return {};
        }else{
          return JSON.parse(result); 
        }
      });
  },
 
  async setCachedTimestamps( key ){
    const store = this.nameSpacedKey('cacheTimestamps');
    const ts = moment().format('MMM D, YYYY | h:mm:ss a');
    const tsPatch = {[key]: ts};
    const prevTimestamps = await this.getCachedTimestamps();
    const nextTimestamps = Object.assign(prevTimestamps, tsPatch);
    const nextTimestampsStr = JSON.stringify(nextTimestamps);

    AsyncStorage.setItem(store, nextTimestampsStr)
      .then( console.info('[status] cacheTimestamps updated with value %O', nextTimestamps) )

    return true;
  },

  async clearCachedTimestamp( key ){
    let timestamps = await this.getCachedTimestamps();
    delete timestamps[key];
    const store = this.nameSpacedKey('cacheTimestamps');
    const timestampsStr = JSON.stringify(timestamps);
    return AsyncStorage.setItem(store, timestampsStr);
  },

  getAllKeys(){
    AsyncStorage.getAllKeys()
      .then( keys => console.info('[status] all AsyncStorage keys [%O]', keys) );

  },
}

module.exports = Api;