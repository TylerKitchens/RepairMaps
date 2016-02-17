'use strict';

var React = require('react-native');
var GLOBAL = require('../Globals');

var {
  AlertIOS,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

class TISearchField extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      searchString: '',
    }
  }

  handleChangeText(uid){

    this.setState({
      searchString: uid.toUpperCase().substring(0,4),
    })

    if(uid.length === 4){
      this.props.onSearchSubmit(uid.toUpperCase());
    }
  }

  render(){
    return(
      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>
          TI Lookup
        </Text>
        <TextInput 
          style={styles.searchField} 
          onChangeText={this.handleChangeText.bind(this)} 
          autoCorrect={false} 
          autoCapitalize='characters'
          placeholder='UID'
          clearButtonMode='always'
          value={this.state.searchString} />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: GLOBAL.COLOR.LIGHTBLUE,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchLabel: {
    fontSize: 20,
    paddingLeft: 10,
    color: GLOBAL.COLOR.DARKBLUE,
  },
  searchField: {
    height: 40,
    width: 110,
    fontSize: 18,
    color: '#000',
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderColor: GLOBAL.COLOR.DARKGRAY,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    margin: 10,
  },
});

TISearchField.propTypes = {
  onSearchSubmit: React.PropTypes.func.isRequired,
}

module.exports = TISearchField;
