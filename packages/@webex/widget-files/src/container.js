import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {autobind} from 'core-decorators';
import classNames from 'classnames';

import ActivityMenuHeader from '@webex/react-component-activity-menu-header';

import ShareListingItem from './components/ShareListingItem';

import getFilesWidgetProps from './selectors';

import styles from './styles.css';

const ownPropTypes = {
  onClickClose: PropTypes.func.isRequired,
  onClickMenu: PropTypes.func.isRequired
};

const injectedPropTypes = {
  activityTypes: PropTypes.array.isRequired,
  conversation: PropTypes.object.isRequired,
  fileShares: PropTypes.array.isRequired
};

class FilesWidget extends Component {
  @autobind
  handleMenuClick() {
    this.props.onClickMenu();
  }

  @autobind
  handleCloseClick() {
    this.props.onClickClose();
  }

  render() {
    return (
      <div className={classNames('webex-widget-files', styles.widgetFiles)}>
        <ActivityMenuHeader
          activityTypes={this.props.activityTypes}
          onClose={this.props.onClickClose && this.handleCloseClick}
          onMenuClick={this.props.onClickMenu && this.handleMenuClick}
          title={`Files (${this.props.fileShares.length})`}
        />
        <div className={classNames('webex-widget-files-main', styles.widgetFilesMain)}>
          {
            this.props.fileShares.length && (
              <div>
                {this.props.fileShares.map((fileShare) => (
                  <ShareListingItem fileShare={fileShare} key={fileShare.item.url} type="file" />
                ))}
              </div>
            )
          }
          {
            !this.props.fileShares.length && (
              <div>No Files Found</div>
            )
          }
        </div>
      </div>
    );
  }
}

FilesWidget.propTypes = {
  ...ownPropTypes,
  ...injectedPropTypes
};

export default connect(
  getFilesWidgetProps
)(FilesWidget);