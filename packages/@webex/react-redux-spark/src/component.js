import {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addError} from '@webex/redux-module-errors';

import WebexSDKAdapter from '@webex/sdk-component-adapter';

import {
  updateSparkStatus,
  registerDevice,
  storeSparkInstance,
  storeSparkAdaptor
} from './actions';
import {createSDKGuestInstance, createSDKInstance} from './sdk';
import {getStatusFromInstance} from './helpers';

const injectedPropTypes = {
  spark: PropTypes.object.isRequired,
  storeSparkInstance: PropTypes.func.isRequired,
  storeSparkAdaptor: PropTypes.func.isRequired,
  updateSparkStatus: PropTypes.func.isRequired,
  addError: PropTypes.func.isRequired
};

const propTypes = {
  accessToken: PropTypes.string,
  guestToken: PropTypes.string,
  sdkInstance: PropTypes.object,
  ...injectedPropTypes
};

const defaultProps = {
  accessToken: '',
  guestToken: '',
  sdkInstance: undefined
};

const PLUGINS = ['authorization', 'logger', 'meetings', 'people', 'rooms'];
const INTERNAL_PLUGINS = ['conversation', 'feature', 'flag', 'mercury', 'presence', 'search', 'team'];

const storeSDKAdaptor = async (sdk, props) => {
  if (!props.spaceActivities || props.spaceActivities.meet) {
    const a = new WebexSDKAdapter(sdk);

    await a.meetingsAdapter.connect();
    props.storeSparkAdaptor(a);
  }
};

export class SparkComponent extends Component {
  constructor(props) {
    super(props);

    this.storeSDKInstance = this.storeSDKInstance.bind(this);
  }

  componentDidMount() {
    const {
      accessToken,
      guestToken,
      spark,
      sdkInstance
    } = this.props;

    // Get the sdk instance from redux state
    const sparkInstance = spark.get('spark');

    // No instance stored, let's get one
    if (!sparkInstance) {
      // SDK Instance passed via props
      if (sdkInstance) {
        sdkInstance.config.appPlatform = `webex-widgets-${this.props.name}/${process.env.REACT_WEBEX_VERSION}`;

        this.storeSDKInstance(sdkInstance);
      }
      // Guest token passed via props
      else if (guestToken) {
        createSDKGuestInstance(guestToken, this.props).then(this.storeSDKInstance);
      }
      // Access token passed via props
      else if (accessToken) {
        createSDKInstance(accessToken, this.props).then(this.storeSDKInstance);
      }
      else {
        // No valid options to create an sdk instance, throw an error
        this.props.addError({
          id: 'webex-sdk-config-props',
          displayTitle: 'Something\'s not right. Please try again',
          displaySubtitle: 'Missing initial configuration, please pass \'sdkInstance\', \'accessToken\', or \'guestToken\'',
          temporary: false
        });
      }
    }
    else {
      this.listenToSparkEvents(sparkInstance);
    }
  }

  /**
   * Register the device if the user has been authenticated
   * and the device is not registered yet.
   * @param {Object} sparkInstance
   */
  setupDevice(sparkInstance) {
    const {
      registering,
      registerError
    } = this.props.spark.get('status');

    const {
      authenticated,
      registered
    } = getStatusFromInstance(sparkInstance);

    if (authenticated && !registered && !registering && !registerError) {
      this.props.registerDevice(sparkInstance);
    }
  }

  /**
   * Listen to any new events and update the sprak instance
   * status accordingly
   * @param {Object} sparkInstance
   */
  listenToSparkEvents(sparkInstance) {
    sparkInstance.listenToAndRun(sparkInstance, 'change:canAuthorize', () => {
      this.props.updateSparkStatus({authenticated: sparkInstance.canAuthorize});
    });

    sparkInstance.listenToAndRun(sparkInstance, 'change:isAuthenticating', () => {
      this.props.updateSparkStatus({authenticating: sparkInstance.isAuthenticating});
    });

    sparkInstance.listenToAndRun(sparkInstance.internal.device, 'change:registered', () => {
      this.props.updateSparkStatus({registered: sparkInstance.internal.device.registered});
    });

    this.setupDevice(sparkInstance);
  }

  /**
   * Verify for the plugins, store the spark instance
   * and listen to any events
   * @param {Object} sdkInstance
   */
  storeSDKInstance(sdkInstance) {
    if (this.validateSDKInstance(sdkInstance)) {
      this.props.storeSparkInstance(sdkInstance);
      this.listenToSparkEvents(sdkInstance);
      storeSDKAdaptor(sdkInstance, this.props);
    }
  }

  /**
   * Validates the sdk instance object and plugins
   *
   * @param {Object} sdkInstance
   * @returns {boolean}
   * @memberof SparkComponent
   */
  validateSDKInstance(sdkInstance) {
    if (typeof sdkInstance !== 'object') {
      this.props.addError({
        id: 'webex-sdk-instance-prop',
        displayTitle: 'Something\'s not right. Please try again',
        displaySubtitle: 'The \'sdkInstance\' passed was invalid. Please pass a proper SDK Instance.',
        temporary: false
      });

      return false;
    }

    return this.verifyPlugins(sdkInstance);
  }

  /**
   * Verify if all the plugins have been injected
   * properly to the webex SDK instance
   * @param {Object} sdkInstance
   * @returns {boolean}
   */
  verifyPlugins(sdkInstance) {
    let contains = false;
    let verified = true;

    for (const plugin of PLUGINS) {
      contains = Object.prototype.hasOwnProperty.call(sdkInstance, plugin);

      if (!contains) {
        this.props.addError({
          id: 'webex-plugins-missing',
          displayTitle: 'Something\'s not right. Please try again',
          displaySubtitle: `Webex SDK instance plugin ${plugin} is not injected to the widget properly`,
          temporary: false
        });
        verified = false;
      }
    }

    for (const internalPlugin of INTERNAL_PLUGINS) {
      contains = Object.prototype.hasOwnProperty.call(sdkInstance.internal, internalPlugin);

      if (!contains) {
        this.props.addError({
          id: 'webex-internal-plugins-missing',
          displayTitle: 'Something\'s not right. Please try again',
          displaySubtitle: `Webex SDK instance internal plugin ${internalPlugin} is not injected to the widget properly`,
          temporary: false
        });
        verified = false;
      }
    }

    return verified;
  }

  render() {
    return null;
  }
}

SparkComponent.propTypes = propTypes;
SparkComponent.defaultProps = defaultProps;

export default connect(
  (state) => ({
    spark: state.spark
  }),
  (dispatch) => bindActionCreators({
    updateSparkStatus,
    registerDevice,
    storeSparkInstance,
    storeSparkAdaptor,
    addError
  }, dispatch)
)(SparkComponent);