import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Text} from 'react-native';

const propTypes = {
  startTime: PropTypes.number.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ])
};

const defaultProps = {
  style: {}
};

class Timer extends Component {
  componentDidMount() {
    clearInterval(this.interval);
    if (this.props.startTime) {
      this.interval = setInterval(this.forceUpdate.bind(this), 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (!this.props.startTime) {
      return false;
    }
    const elapsed = Date.now() - this.props.startTime;
    let timeFormat = 'mm:ss';
    if (elapsed > 1000 * 3600) {
      timeFormat = 'hh:mm:ss';
    }
    return (
      <Text className="ciscospark-timer" style={this.props.style}>{moment.utc(elapsed).format(timeFormat)}</Text>
    );
  }
}

Timer.propTypes = propTypes;
Timer.defaultProps = defaultProps;

export default Timer;
