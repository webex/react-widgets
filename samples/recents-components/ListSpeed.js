import React, {Component} from 'react';
import {autobind} from 'core-decorators';

import SpacesList from '@ciscospark/react-component-spaces-list';

import spaces from './spaces.json';

class ListSpeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSpace: null,
      spaces
    };
  }

  @autobind
  onSpaceClick(space) {
    this.setState({selectedSpace: space});
  }

  render() {
    return (
      <div>
        <div>Rendering a list of {this.state.spaces.length}</div>
        <SpacesList
          activeSpaceId={this.state.selectedSpace}
          onClick={this.onSpaceClick}
          spaces={this.state.spaces}
        />
      </div>
    );
  }
}

export default ListSpeed;
