/* eslint no-underscore-dangle: 0  */

import React from 'react';
import {Select, SelectOption, RadioGroup, Radio} from '@momentum-ui/react';
import * as AdaptiveCard from 'adaptivecards';
import classnames from 'classnames';
import {v4 as UUID} from 'uuid';
import {renderCardElement, DEFAULT_VALUE_CHECK_BOX} from '@webex/react-component-utils';

/**
 * Replaces Choice Set(radio button and checkboxes) of adaptive Card with MD(Momentum Design) Select and Radio Group
 * @returns {HTMLElement}
 */
class MDChoiceSetInput extends AdaptiveCard.ChoiceSetInput {
  constructor(addChildNode) {
    super();
    this.addChildNode = addChildNode;
    this._toggleInputs = [];
  }

  /**
   * returns the assigned value to internalRender() method
   * @returns {string}
   */
  get value() {
    return this._value;
  }

  /**
   * assigns the value when the data is sent in the JSON request
   * @param {string} newValue
   */
  set value(newValue) {
    this._value = newValue;
  }

  /**
   * Renders the momentum design `<Select />` and `<RadioGroup />` components
   * @returns {HTMLElement}
   */
  internalRender() {
    this._selectElement = document.createElement('div');
    if (!this.isMultiSelect) {
      const defaultChoice = this.choices.find((choice) => this.defaultValue === choice.value) || null;

      this.value = this.defaultValue || null;

      if (this.isCompact) {
        // Render Select box
        let defaultOptionText = null;

        if (defaultChoice === null && this.choices.length > 0) {
          defaultOptionText = this.choices[0].title;
        }

        if (this.placeholder) {
          defaultOptionText = this.placeholder;
        }

        const jsx = (
          <Select
            defaultValue={defaultChoice ? defaultChoice.title : defaultOptionText}
            onSelect={(choice) => {
              this.value = (choice.length && choice[0].value) || null;
            }}
            className={classnames('ac-input', 'ac-multichoiceInput')}
            isDynamic={false}
          >
            {this.choices.map((choice) => (
              <SelectOption key={choice.value} value={choice.value} label={choice.title} />
            ))}
          </Select>
        );

        renderCardElement(jsx, this._selectElement, this.addChildNode);

        return this._selectElement;
      }

      // Render radio button for non-compact single-valued ChoiceSets
      const radioGroupName = `__ac-category-${UUID()}`;
      const jsx = (
        <RadioGroup
          className={classnames('ac-input')}
          name={radioGroupName}
          onChange={(newValue) => {
            this.value = newValue;
          }}
          values={[this.defaultValue]} // This array sets the default value
        >
          {this.choices.map((choice) => (
            <Radio
              label={choice.title}
              htmlId={UUID()} // required for labelFor attribute
              key={choice.value}
              value={choice.value}
            />
          ))}
        </RadioGroup>
      );

      renderCardElement(jsx, this._selectElement, this.addChildNode);

      return this._selectElement;
    }

    // Render Checkboxes
    const defaultOptionText = this.title || this.placeholder || DEFAULT_VALUE_CHECK_BOX;

    this.value = this.defaultValue; // this.value should be delimiter separated string

    const jsx = (
      <Select
        className={classnames('ac-input')}
        defaultValue={defaultOptionText} // This is the label. Default values for multiselect not supported in MD
        onSelect={(choices) => {
          this.value = choices.map((choice) => choice.value).join(this.hostConfig.choiceSetInputValueSeparator) || null;
        }}
        isMulti
        isDynamic={false}
      >
        {this.choices.map((choice) => (
          <SelectOption
            key={choice.value}
            value={choice.value}
            label={choice.title}
          />
        ))}
      </Select>
    );

    renderCardElement(jsx, this._selectElement, this.addChildNode);

    return this._selectElement;
  }
}

export default MDChoiceSetInput;