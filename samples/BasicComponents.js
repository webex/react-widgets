import React from 'react';

import Avatar from '@ciscospark/react-component-avatar';
import Button from '@ciscospark/react-component-button';
import Icon, {ICONS} from '@ciscospark/react-component-icon';


function BasicComponents() {
  function onClick() {
    // eslint-disable-next-line no-alert
    window.alert('onClick');
  }

  const buttonContainerStyle = {
    width: '40px',
    height: '40px',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '50%'
  };

  return (
    <div>
      <h3>Avatar</h3>
      <h4>Basic No Avatar</h4>
      <div style={{width: '50px', height: '50px'}}>
        <Avatar name="Test User" />
      </div>
      <h4>Self Avatar</h4>
      <div style={{width: '50px', height: '50px'}}>
        <Avatar isSelfAvatar />
      </div>
      <h4>Image Avatar</h4>
      <div style={{width: '50px', height: '50px'}}>
        <Avatar image="https://1efa7a94ed216783e352-c62266528714497a17239ececf39e9e2.ssl.cf1.rackcdn.com/V1~aebdece11a795253ab6dd74cbcb3a113~WNPdL2bTRpqVQfRKYrJuKA==~110" name="Adam" />
      </div>
      <h3>Buttons</h3>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={buttonContainerStyle}>
          <Button accessibilityLabel="Main Menu" iconColor="black" iconType={ICONS.ICON_TYPE_WAFFLE} onClick={onClick} />
        </div>
        <div style={buttonContainerStyle}>
          <Button
            iconColor="purple"
            iconType={ICONS.ICON_TYPE_DELETE}
            onClick={onClick}
            title="delete"
          />
        </div>
      </div>
      <h3>Icons</h3>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Add Icon"
            type={ICONS.ICON_TYPE_ADD}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Contact Icon"
            type={ICONS.ICON_TYPE_CONTACT}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Delete Icon"
            type={ICONS.ICON_TYPE_DELETE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="DND Icon"
            type={ICONS.ICON_TYPE_DND}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Document Icon"
            type={ICONS.ICON_TYPE_DOCUMENT}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Exit Icon"
            type={ICONS.ICON_TYPE_EXIT}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="External User Icon"
            type={ICONS.ICON_TYPE_EXTERNAL_USER}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="External User Outline Icon"
            type={ICONS.ICON_TYPE_EXTERNAL_USER_OUTLINE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Files Icon"
            type={ICONS.ICON_TYPE_FILES}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Flagged Icon"
            type={ICONS.ICON_TYPE_FLAGGED}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Flagged Outline Icon"
            type={ICONS.ICON_TYPE_FLAGGED_OUTLINE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Invite Icon"
            type={ICONS.ICON_TYPE_INVITE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Message Icon"
            type={ICONS.ICON_TYPE_MESSAGE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Message Outline Icon"
            type={ICONS.ICON_TYPE_MESSAGE_OUTLINE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="More Icon"
            type={ICONS.ICON_TYPE_MORE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Mute Icon"
            type={ICONS.ICON_TYPE_MUTE_OUTLINE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Participant List Icon"
            type={ICONS.ICON_TYPE_PARTICIPANT_LIST}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="PTO Icon"
            type={ICONS.ICON_TYPE_PTO}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Right Arrow Icon"
            type={ICONS.ICON_TYPE_RIGHT_ARROW}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Video Cross Outline Icon"
            type={ICONS.ICON_TYPE_VIDEO_CROSS_OUTLINE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Video Outline Icon"
            type={ICONS.ICON_TYPE_VIDEO_OUTLINE}
          />
        </div>
        <div style={{height: '25px', width: '25px', backgroundColor: 'blueviolet'}}>
          <Icon
            color="white"
            title="Waffle Icon"
            type={ICONS.ICON_TYPE_WAFFLE}
          />
        </div>
      </div>
    </div>
  );
}

export default BasicComponents;
