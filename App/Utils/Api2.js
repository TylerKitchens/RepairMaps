'use strict';


const React = require('react-native');
const GLOBAL = require('../Globals');
const moment = require('moment');
const { AsyncStorage } = React;

const Api = {

  getAircraftList( aircraft_id ){
    const url = GLOBAL.BASE_URL;

    try {
      var response = await fetchLive(url);
    }
    catch(error) {
      console.warn('WARN: unable to retrieve ['+ aircraft_id +'] from the network, so attempting to grab cache instead...', error.message);
      fetchCache(aircraft_id);
    }

  }

  fetchLive( url ){
    return fetch(url);
  }

}

module.exports = Api