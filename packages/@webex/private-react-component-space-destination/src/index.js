import React from 'react';
import {PropTypes} from 'prop-types';

import {Checkbox, Input, Radio, RadioGroup} from '@momentum-ui/react';

import './momentum.scss';

const MODE_ONE_ON_ONE_ID = 'userId';
const MODE_ONE_ON_ONE = 'email';
const MODE_SPACE = 'spaceId';
const MODE_SIP = 'sip';
const MODE_PSTN = 'pstn';

const DESTINATION_PROP_MODE_LEGACY = 'DESTINATION_PROP_MODE_LEGACY';
const DESTINATION_PROP_MODE_MAIN = 'DESTINATION_PROP_MODE_MAIN';

export const constants = {
  DESTINATION_PROP_MODE_LEGACY,
  DESTINATION_PROP_MODE_MAIN,
  MODE_ONE_ON_ONE,
  MODE_ONE_ON_ONE_ID,
  MODE_SPACE,
  MODE_SIP,
  MODE_PSTN
};

const propTypes = {
  activities: PropTypes.object.isRequired,
  composerActions: PropTypes.object.isRequired,
  destinationId: PropTypes.string.isRequired,
  destinationPropMode: PropTypes.string,
  initialActivity: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onActivitiesChange: PropTypes.func.isRequired,
  onComposerActionsChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
  onDestinationPropTypeChange: PropTypes.func,
  onInitialActivityChange: PropTypes.func.isRequired,
  onModeChange: PropTypes.func.isRequired,
  onSecondaryFullWidthChange: PropTypes.func.isRequired,
  secondaryFullWidth: PropTypes.bool,
  disablePresence: PropTypes.bool,
  onDisablePresenceChange: PropTypes.func.isRequired,
  onDisableFlagsChange: PropTypes.func.isRequired,
  disableFlags: PropTypes.bool
};

const defaultProps = {
  destinationPropMode: null,
  onDestinationPropTypeChange: () => {},
  secondaryFullWidth: false,
  disablePresence: false,
  disableFlags: false
};

function SpaceDestination(props) {
  function getDestinationLabels() {
    let ariaLabel, placeholder;

    switch (props.mode) {
      case MODE_ONE_ON_ONE:
        ariaLabel = 'To User Email';
        placeholder = 'Webex User Email (For 1:1)';
        break;
      case MODE_ONE_ON_ONE_ID:
        ariaLabel = 'To User Id';
        placeholder = 'Webex User Id (For 1:1)';
        break;
      case MODE_SPACE:
        ariaLabel = 'To Space ID';
        placeholder = 'Webex Space Id';
        break;
      case MODE_SIP:
        ariaLabel = 'To SIP URI';
        placeholder = 'SIP URI';
        break;
      case MODE_PSTN:
        ariaLabel = 'To Phone Number';
        placeholder = 'Phone Number';
        break;
      default: {
        ariaLabel = 'unknown mode';
        placeholder = 'Please pick a type';
      }
    }

    return {
      ariaLabel,
      placeholder
    };
  }

  const displayActivityWarning = !props.activities[props.initialActivity];
  const isMeetOnly = [MODE_SIP, MODE_PSTN].includes(props.mode);

  const {
    ariaLabel,
    placeholder
  } = getDestinationLabels();

  return (
    <div>
      <h3> Widget Destination Type </h3>
      <div>
        <RadioGroup
          ariaLabel="Widget 'To' Type"
          name="toType"
          onChange={props.onModeChange}
          values={[props.mode]}
        >
          <Radio
            ariaLabel="To Space"
            htmlId="toTypeSpace"
            label="To Space"
            value={MODE_SPACE}
          />
          <Radio
            ariaLabel="To Person Email"
            htmlId="toTypeEmail"
            label="To Person"
            value={MODE_ONE_ON_ONE}
          />
          <Radio
            ariaLabel="To Person Id"
            htmlId="toTypePersonId"
            label="To Person Id"
            value={MODE_ONE_ON_ONE_ID}
          />
          <Radio
            ariaLabel="To SIP URI"
            htmlId="toTypeSIP"
            label="To SIP URI"
            value={MODE_SIP}
          />
        </RadioGroup>
      </div>

      <h3> Widget Initial Activity </h3>
      <div>
        <RadioGroup
          ariaLabel="Initial Activity"
          name="initialActivity"
          onChange={props.onInitialActivityChange}
          values={isMeetOnly ? ['meet'] : [props.initialActivity]}
        >
          <Radio
            ariaLabel="Message"
            htmlId="initialActivityMessage"
            label="Message"
            value="message"
            disabled={isMeetOnly}
          />
          <Radio
            ariaLabel="Meet"
            htmlId="initialActivityMeet"
            label="Meet"
            value="meet"
          />
        </RadioGroup>
      </div>

      <div>
        <h3> Widget Activities </h3>
        {
          displayActivityWarning &&
          <div> Warning: The initial activity is not enabled </div>
        }

        <Checkbox
          checked={props.activities.files}
          htmlId="activitiesFiles"
          label="Files"
          onChange={props.onActivitiesChange}
          value="files"
          disabled={isMeetOnly}
        />
        <Checkbox
          checked={props.activities.meet}
          htmlId="activitiesMeet"
          label="Meet"
          onChange={props.onActivitiesChange}
          value="meet"
        />
        <Checkbox
          checked={props.activities.message}
          htmlId="activitiesMessage"
          label="Message"
          onChange={props.onActivitiesChange}
          value="message"
          disabled={isMeetOnly}
        />
        <Checkbox
          checked={props.activities.people}
          htmlId="activitiesPeople"
          label="People"
          onChange={props.onActivitiesChange}
          value="people"
        />

      </div>

      <div>
        <h3> Widget Composer Actions </h3>
        <Checkbox
          checked={props.composerActions.attachFiles}
          htmlId="attachFiles"
          label="Attach Files"
          onChange={props.onComposerActionsChange}
          value="attachFiles"
          disabled={isMeetOnly}
        />
      </div>
      <div>
        <h3>Other Configurations</h3>
        <Checkbox
          checked={props.secondaryFullWidth}
          htmlId="secondaryFullWidth"
          label="secondaryActivitiesFullWidth"
          onChange={props.onSecondaryFullWidthChange}
        />
      </div>
      <div>
        <h3>Disable Presence</h3>
        <Checkbox
          checked={props.disablePresence}
          htmlId="disablePresence"
          label="Disable Presence"
          onChange={props.onDisablePresenceChange}
        />
      </div>
      <div>
        <h3>Disable Flags</h3>
        <Checkbox
          checked={props.disableFlags}
          htmlId="disableFlags"
          label="Disable Flags"
          onChange={props.onDisableFlagsChange}
        />
      </div>
      { props.destinationPropMode &&
        <div>
          <h3>Widget Destination Prop Type</h3>
          <RadioGroup
            ariaLabel="Widget 'Destination Prop' Type"
            name="destinationType"
            onChange={props.onDestinationPropTypeChange}
            values={[props.destinationPropMode]}
          >
            <Radio
              ariaLabel="Destination ID & Type Mode"
              htmlId="destinationTypeMain"
              label="Destination ID & Type Mode"
              value={DESTINATION_PROP_MODE_MAIN}
            />
            <Radio
              ariaLabel="Destination Legacy Mode"
              htmlId="destinationTypeLegacy"
              label="Destination Legacy Mode"
              value={DESTINATION_PROP_MODE_LEGACY}
            />
          </RadioGroup>
        </div>
      }
      <div>
        <h3> Widget Destination </h3>
        <Input
          aria-label={ariaLabel}
          htmlId="destinationId"
          inputSize="medium-12"
          onChange={props.onDestinationChange}
          placeholder={placeholder}
          value={props.destinationId}
        />
      </div>
    </div>
  );
}

SpaceDestination.propTypes = propTypes;

SpaceDestination.defaultProps = defaultProps;

export default SpaceDestination;