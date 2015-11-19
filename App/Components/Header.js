var React = require('react-native');
var GLOBAL = require('../Globals');

var {
  View,
  Text,
  Image,
  StyleSheet,
} = React;

class Header extends React.Component{
  render(){
    return(
        <View style={styles.header}>
          <Image 
            style={styles.logo}
            source={require('../Images/logo-repairmaps.png')} 
            />
          <Text style={styles.headerText}>RepairMaps Mobile</Text>
        </View>
    )
  }
}

var styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    backgroundColor: GLOBAL.COLOR.LIGHTBLUE,
  },
  logo: {
    height: 75,
    width: 75,
    marginLeft: -2,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 28,
    marginLeft: 5,
  }, 
  cacheWarning: {
    padding:5,
    backgroundColor: GLOBAL.COLOR.ORANGE,
  },
});

module.exports = Header;