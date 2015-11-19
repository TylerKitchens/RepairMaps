'use strict';

const React = require('react-native');

const { WebView } = React;

class WebViewer extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <WebView 
        scrollEnabled='true'
        url={this.props.url}
        />
    )
  }
}

module.exports = WebViewer;