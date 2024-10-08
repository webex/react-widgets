/* eslint max-nested-callbacks: ["error", 3] */
import {join} from 'path';
import {readFile} from 'fs';

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {Map} from 'immutable';

import FileStagingArea from '.';

const renderer = new ShallowRenderer();

// Grabbed from @webex/test-helper-file in the SDK repo
const fetchWithoutMagic = (filename) =>
  new Promise((resolve, reject) => {
    const filepath = join(__dirname, '../../../../node_modules/@webex/test-helper-server/static/', filename);

    readFile(filepath, (err, data) => {
      if (err) {
        reject(err);

        return;
      }
      resolve({...data, name: filename});
    });
  });

describe('FileStagingArea component', () => {
  let props;
  let txtFile = 'sample-text-one.txt';
  let pptFile = 'sample-powerpoint-two-page.ppt';

  beforeAll(() =>
    Promise.all([
      fetchWithoutMagic(txtFile),
      fetchWithoutMagic(pptFile)
    ])
      .then((res) => {
        [txtFile, pptFile] = res;
        txtFile.type = 'text/plain';
        txtFile.id = 'txtFile';
        pptFile.type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        pptFile.id = 'pptFile';
      }));

  beforeEach(() => {
    props = {
      files: new Map({txtFile, pptFile}),
      onFileRemove: jest.fn(),
      onSubmit: jest.fn()
    };
  });


  it('renders properly', () => {
    renderer.render(<FileStagingArea {...props} />);
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
