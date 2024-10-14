import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string
};

const defaultProps = {
  color: 'black',
  size: '100%',
  title: ''
};

export const ICONS = {
  ICON_TYPE_ADD: 'ICON_TYPE_ADD',
  ICON_TYPE_CONTACT: 'ICON_TYPE_CONTACT',
  ICON_TYPE_DELETE: 'ICON_TYPE_DELETE',
  ICON_TYPE_DND: 'ICON_TYPE_DND',
  ICON_TYPE_DOCUMENT: 'ICON_TYPE_DOCUMENT',
  ICON_TYPE_DOWNLOAD: 'ICON_TYPE_DOWNLOAD',
  ICON_TYPE_EXIT: 'ICON_TYPE_EXIT',
  ICON_TYPE_EXTERNAL_USER: 'ICON_TYPE_EXTERNAL_USER',
  ICON_TYPE_EXTERNAL_USER_OUTLINE: 'ICON_TYPE_EXTERNAL_USER_OUTLINE',
  ICON_TYPE_FILES: 'ICON_TYPE_FILES',
  ICON_TYPE_FLAGGED: 'ICON_TYPE_FLAGGED',
  ICON_TYPE_FLAGGED_OUTLINE: 'ICON_TYPE_FLAGGED_OUTLINE',
  ICON_TYPE_INVITE: 'ICON_TYPE_INVITE',
  ICON_TYPE_MESSAGE: 'ICON_TYPE_MESSAGE',
  ICON_TYPE_MESSAGE_OUTLINE: 'ICON_TYPE_MESSAGE_OUTLINE',
  ICON_TYPE_MORE: 'ICON_TYPE_MORE',
  ICON_TYPE_MUTE_OUTLINE: 'ICON_TYPE_MUTE_OUTLINE',
  ICON_TYPE_PARTICIPANT_LIST: 'ICON_TYPE_PARTICIPANT_LIST',
  ICON_TYPE_PTO: 'ICON_TYPE_PTO',
  ICON_TYPE_RIGHT_ARROW: 'ICON_TYPE_RIGHT_ARROW',
  ICON_TYPE_VIDEO_CROSS_OUTLINE: 'ICON_TYPE_VIDEO_CROSS_OUTLINE',
  ICON_TYPE_VIDEO_OUTLINE: 'ICON_TYPE_VIDEO_OUTLINE',
  ICON_TYPE_WAFFLE: 'ICON_TYPE_WAFFLE'
};

const paths = {
  ICON_TYPE_ADD: 'M33,17H19V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v14H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h14v14c0,0.6,0.4,1,1,1s1-0.4,1-1V19 h14c0.6,0,1-0.4,1-1S33.6,17,33,17z',
  ICON_TYPE_CONTACT: `M34.9,32.5l-1.2-4.7c-1-4-4.6-6.8-8.7-6.8h-0.7c2.8-2,4.7-5.3,4.7-9c0-6.1-4.9-11-11-11S7,5.9,7,12
  c0,3.7,1.9,7,4.7,9H11c-4.1,0-7.7,2.8-8.7,6.8l-1.2,4.7c-0.2,0.6,0,1.2,0.4,1.7C1.8,34.7,2.4,35,3,35h30c0.6,0,1.2-0.3,1.6-0.8
  S35.1,33.1,34.9,32.5z M9,12c0-5,4-9,9-9c5,0,9,4,9,9s-4,9-9,9C13,21,9,17,9,12z M3,33l1.2-4.7C5,25.2,7.7,23,11,23H25
  c3.2,0,6,2.2,6.8,5.3L33,33H3z`,
  ICON_TYPE_DELETE: 'M6,11 C3.243,11 1,8.757 1,6 C1,3.243 3.243,1 6,1 C8.757,1 11,3.243 11,6 C11,8.757 8.757,11 6,11 M6,0 C2.691,0 0,2.691 0,6 C0,9.309 2.691,12 6,12 C9.309,12 12,9.309 12,6 C12,2.691 9.309,0 6,0 Z M7.8535,4.1465 C7.6585,3.9515 7.3415,3.9515 7.1465,4.1465 L5.9995,5.2925 L4.8535,4.1465 C4.6585,3.9515 4.3415,3.9515 4.1465,4.1465 C3.9515,4.3415 3.9515,4.6585 4.1465,4.8535 L5.2925,6.0005 L4.1465,7.1465 C3.9515,7.3415 3.9515,7.6585 4.1465,7.8535 C4.2445,7.9515 4.3725,8.0005 4.4995,8.0005 C4.6275,8.0005 4.7555,7.9515 4.8535,7.8535 L5.9995,6.7075 L7.1465,7.8535 C7.2445,7.9515 7.3725,8.0005 7.4995,8.0005 C7.6275,8.0005 7.7555,7.9515 7.8535,7.8535 C8.0485,7.6585 8.0485,7.3415 7.8535,7.1465 L6.7075,6.0005 L7.8535,4.8535 C8.0485,4.6585 8.0485,4.3415 7.8535,4.1465 Z',
  ICON_TYPE_DND: `M6.3,10.4C6.8,10.8,7.4,11,8,11c1.7,0,3-1.3,3-3c0-0.6-0.2-1.2-0.6-1.7L6.3,10.4z M8,5
  C6.3,5,5,6.3,5,8c0,0.6,0.2,1.2,0.6,1.7l4.2-4.2C9.2,5.2,8.6,5,8,5z M8,12c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S10.2,12,8,12z`,
  ICON_TYPE_DOCUMENT: `M21,1L21,1l0,8c0,1.1,0.9,2,2,2v0h9c0-0.5-0.2-1-0.6-1.4l-9-9C22,0.2,21.5,0,21,0h0V1z
  M31,13L31,13l-8,0c-2.2,0-4-1.8-4-4v0h0V0H8C5.8,0,4,1.8,4,4v28c0,2.2,1.8,4,4,4h20c2.2,0,4-1.8,4-4V13H31z`,
  ICON_TYPE_DOWNLOAD: 'M6.1459,10.8529 C6.1919,10.8989 6.2479,10.9359 6.3089,10.9619 C6.3699,10.9869 6.4349,10.9999 6.4999,10.9999 C6.5649,10.9999 6.6299,10.9869 6.6909,10.9619 C6.7529,10.9359 6.8079,10.8989 6.8539,10.8529 L10.8539,6.8539 C11.0489,6.6579 11.0489,6.3419 10.8539,6.1469 C10.6579,5.9509 10.3419,5.9509 10.1469,6.1469 L6.9999,9.2929 L6.9999,0.4999 C6.9999,0.2239 6.7759,-0.0001 6.4999,-0.0001 C6.2239,-0.0001 5.9999,0.2239 5.9999,0.4999 L5.9999,9.2929 L2.8539,6.1469 C2.6579,5.9509 2.3419,5.9509 2.1469,6.1469 C1.9509,6.3419 1.9509,6.6579 2.1469,6.8539 L6.1459,10.8529 Z M12.5,13 L0.5,13 C0.224,13 0,13.224 0,13.5 C0,13.776 0.224,14 0.5,14 L12.5,14 C12.776,14 13,13.776 13,13.5 C13,13.224 12.776,13 12.5,13 Z',
  ICON_TYPE_EXIT: 'M8.70725,8.00025 L15.85325,0.85425 C16.04925,0.65825 16.04925,0.34225 15.85325,0.14625 C15.65825,-0.04875 15.34225,-0.04875 15.14625,0.14625 L8.00025,7.29325 L0.85325,0.14625 C0.65825,-0.04875 0.34225,-0.04875 0.14625,0.14625 C-0.04875,0.34225 -0.04875,0.65825 0.14625,0.85425 L7.29325,8.00025 L0.14625,15.14625 C-0.04875,15.34225 -0.04875,15.65825 0.14625,15.85425 C0.24425,15.95125 0.37225,16.00025 0.50025,16.00025 C0.62825,16.00025 0.75625,15.95125 0.85325,15.85425 L8.00025,8.70725 L15.14625,15.85425 C15.24425,15.95125 15.37225,16.00025 15.50025,16.00025 C15.62825,16.00025 15.75625,15.95125 15.85325,15.85425 C16.04925,15.65825 16.04925,15.34225 15.85325,15.14625 L8.70725,8.00025 Z',
  ICON_TYPE_EXTERNAL_USER: 'M13.4996809,7 C13.1606809,7 12.8336809,7.044 12.5166809,7.115 C12.8236809,6.473 12.9996809,5.759 12.9996809,5 C12.9996809,2.243 10.7566809,8.8817842e-16 7.99968089,8.8817842e-16 C5.24268089,8.8817842e-16 2.99968089,2.243 2.99968089,5 C2.99968089,6.641 3.80568089,8.089 5.03168089,9 L4.70268089,9 C2.74568089,9 1.04968089,10.405 0.578680889,12.415 L0.027680889,14.764 C-0.044319111,15.073 0.025680889,15.389 0.219680889,15.633 C0.404680889,15.866 0.677680889,16 0.969680889,16 L13.4786809,16 L13.4786809,15.998 C13.4856809,15.998 13.4926809,16 13.4996809,16 C15.9846809,16 17.9996809,13.985 17.9996809,11.5 C17.9996809,9.015 15.9846809,7 13.4996809,7 Z M13.4996809,15 C11.5696809,15 9.99968089,13.43 9.99968089,11.5 C9.99968089,9.57 11.5696809,8 13.4996809,8 C15.4296809,8 16.9996809,9.57 16.9996809,11.5 C16.9996809,13.43 15.4296809,15 13.4996809,15 Z M13.4996809,11 C13.2246809,11 12.9996809,11.225 12.9996809,11.5 L12.9996809,13.5 C12.9996809,13.775 13.2246809,14 13.4996809,14 C13.7746809,14 13.9996809,13.775 13.9996809,13.5 L13.9996809,11.5 C13.9996809,11.225 13.7746809,11 13.4996809,11 Z M13.4996809,9 C13.2236809,9 12.9996809,9.224 12.9996809,9.5 C12.9996809,9.776 13.2236809,10 13.4996809,10 C13.7756809,10 13.9996809,9.776 13.9996809,9.5 C13.9996809,9.224 13.7756809,9 13.4996809,9 Z M1.00168089,14.993 L1.55268089,12.644 C1.91768089,11.087 3.21168089,10 4.70268089,10 L9.27468089,10 C9.10768089,10.472 8.99968089,10.971 8.99968089,11.5 C8.99968089,12.922 9.67168089,14.174 10.7006809,14.998 L1.00168089,14.993 Z M3.99968089,5 C3.99968089,2.794 5.79368089,1 7.99968089,1 C10.2056809,1 11.9996809,2.794 11.9996809,5 C11.9996809,7.206 10.2056809,9 7.99968089,9 C5.79368089,9 3.99968089,7.206 3.99968089,5 Z',
  ICON_TYPE_EXTERNAL_USER_OUTLINE: 'M17.8102622,13.897 C18.0642419,14.338 18.063242,14.866 17.8072624,15.308 C17.5572823,15.742 17.1113178,16 16.6153574,16 L10.2938609,16 L8.38301312,16 L0.969603653,16 C0.677626911,16 0.404648656,15.866 0.219663391,15.633 C0.0256788435,15.389 -0.044315581,15.072 0.0276786842,14.764 L0.578634797,12.415 C1.04959728,10.405 2.74646211,9 4.70330624,9 L5.03228003,9 C3.80637768,8.088 3.00044188,6.641 3.00044188,4.999 C3.00044188,2.243 5.24326323,0 8.00004363,0 C10.7558241,0 12.9986455,2.243 12.9986455,4.999 C12.9986455,5.376 12.9436498,5.737 12.8636562,6.088 C13.2016293,6.172 13.5086048,6.374 13.6935901,6.697 L13.6935901,6.698 L17.8102622,13.897 Z M16.9423313,14.807 C17.0173253,14.678 17.0173253,14.523 16.9433312,14.394 L12.8266592,7.195 C12.7256672,7.019 12.5636801,7 12.4996852,7 C12.4346904,7 12.2727033,7.019 12.1717113,7.195 L8.05603917,14.393 C7.98104514,14.524 7.98204506,14.678 8.05603917,14.808 C8.08903654,14.864 8.18802865,14.991 8.37301392,14.997 L10.2938609,14.998 L10.2938609,15 L16.6153574,15 C16.8093419,15 16.9093339,14.866 16.9423313,14.807 Z M12.4992852,9.0004 C12.7752632,9.0004 12.9992454,9.2244 12.9992454,9.5004 L12.9992454,11.5004 C12.9992454,11.7764 12.7752632,12.0004 12.4992852,12.0004 C12.2233072,12.0004 11.9993251,11.7764 11.9993251,11.5004 L11.9993251,9.5004 C11.9993251,9.2244 12.2233072,9.0004 12.4992852,9.0004 Z M1.55255722,12.644 L1.0016011,14.993 L7.06111842,14.996 C6.9521271,14.631 6.99212392,14.238 7.18910822,13.896 L9.41593084,10 L4.70330624,10 C3.212425,10 1.91752814,11.087 1.55255722,12.644 Z M4.00036223,4.999 C4.00036223,7.205 5.79421934,8.999 8.00004363,8.999 C8.95496756,8.999 9.8218985,8.649 10.5098437,8.088 L11.3047804,6.698 C11.422771,6.492 11.5927574,6.339 11.7857421,6.23 C11.912732,5.84 11.9987251,5.431 11.9987251,4.999 C11.9987251,2.794 10.204868,1 8.00004363,1 C5.79421934,1 4.00036223,2.794 4.00036223,4.999 Z M12.4992852,13.0004 C12.7752632,13.0004 12.9992454,13.2244 12.9992454,13.5004 C12.9992454,13.7764 12.7752632,14.0004 12.4992852,14.0004 C12.2233072,14.0004 11.9993251,13.7764 11.9993251,13.5004 C11.9993251,13.2244 12.2233072,13.0004 12.4992852,13.0004 Z',
  ICON_TYPE_FILES: 'M15,5 L1,5 L1,2 C1,1.449 1.449,1 2,1 L4.627,1 C4.759,1 4.888,1.053 4.981,1.146 L5.396,1.561 C5.679,1.844 6.056,2 6.456,2 L14,2 C14.551,2 15,2.449 15,3 L15,5 Z M15,12 C15,12.551 14.551,13 14,13 L2,13 C1.449,13 1,12.551 1,12 L1,6 L15,6 L15,12 Z M14,1 L6.456,1 C6.323,1 6.197,0.948 6.102,0.854 L5.688,0.439 C5.405,0.156 5.028,0 4.627,0 L2,0 C0.897,0 0,0.897 0,2 L0,12 C0,13.103 0.897,14 2,14 L14,14 C15.103,14 16,13.103 16,12 L16,3 C16,1.897 15.103,1 14,1 L14,1 Z',
  ICON_TYPE_FLAGGED: `M30.7,18.6L25.1,11l5.6-7.6C31,3,31.1,2.4,30.8,1.8C30.6,1.3,30.1,1,29.5,1H6C5.4,1,5,1.4,5,2v32
  c0,0.6,0.4,1,1,1s1-0.4,1-1V21h22.5c0.6,0,1.1-0.3,1.3-0.8C31.1,19.6,31,19,30.7,18.6z`,
  ICON_TYPE_FLAGGED_OUTLINE: `M30.7,18.6L25.1,11l5.6-7.6C31,3,31.1,2.4,30.8,1.8C30.6,1.3,30.1,1,29.5,1H6C5.4,1,5,1.4,5,2v32
  c0,0.6,0.4,1,1,1s1-0.4,1-1V21h22.5c0.6,0,1.1-0.3,1.3-0.8C31.1,19.6,31,19,30.7,18.6z M7,19V3h21.5l-5.3,7.1
  c-0.4,0.5-0.4,1.3,0,1.8l5.3,7.1H7z`,
  ICON_TYPE_INVITE: 'M21.5,23 L2.5,23 C1.673,23 1,22.327 1,21.5 L1,9.4 L10.076,16.341 C10.643,16.773 11.321,16.99 12,16.99 C12.679,16.99 13.357,16.773 13.924,16.341 L23,9.4 L23,21.5 C23,22.327 22.327,23 21.5,23 L21.5,23 Z M2.5,6 L3.018,6 L3.018,9.683 L1,8.141 L1,7.5 C1,6.673 1.673,6 2.5,6 L2.5,6 Z M5.5,1 L18.5,1 C19.327,1 20,1.673 20,2.5 L20,10.435 L13.316,15.546 C12.541,16.14 11.459,16.14 10.684,15.546 L4,10.435 L4,2.5 C4,1.673 4.673,1 5.5,1 L5.5,1 Z M21.5,6 C22.327,6 23,6.673 23,7.5 L23,8.141 L21,9.67 L21,6 L21.5,6 Z M21.5,5 L21,5 L21,2.5 C21,1.121 19.879,0 18.5,0 L5.518,0 C4.139,0 3.018,1.121 3.018,2.5 L3.018,5 L2.5,5 C1.121,5 0,6.121 0,7.5 L0,21.5 C0,22.879 1.121,24 2.5,24 L21.5,24 C22.879,24 24,22.879 24,21.5 L24,7.5 C24,6.121 22.879,5 21.5,5 L21.5,5 Z',
  ICON_TYPE_MESSAGE: `M2,35c-0.3,0-0.5-0.1-0.7-0.3c-0.3-0.3-0.4-0.6-0.3-1l2-7.6C1.7,23.6,1,20.8,1,18C1,8.6,8.6,1,18,1
  s17,7.6,17,17s-7.6,17-17,17c-2.8,0-5.6-0.7-8.1-2.1l-7.6,2C2.2,35,2.1,35,2,35z`,
  ICON_TYPE_MESSAGE_OUTLINE: `M2,35c-0.3,0-0.5-0.1-0.7-0.3c-0.3-0.3-0.4-0.6-0.3-1l2-7.6C1.7,23.6,1,20.8,1,18C1,8.6,8.6,1,18,1
  s17,7.6,17,17s-7.6,17-17,17c-2.8,0-5.6-0.7-8.1-2.1l-7.6,2C2.2,35,2.1,35,2,35z M10,30.9c0.2,0,0.3,0,0.5,0.1c2.3,1.3,4.9,2,7.5,2
  c8.3,0,15-6.7,15-15S26.3,3,18,3S3,9.7,3,18c0,2.6,0.7,5.2,2,7.5c0.1,0.2,0.2,0.5,0.1,0.8l-1.7,6.3l6.3-1.7
  C9.8,30.9,9.9,30.9,10,30.9z`,
  ICON_TYPE_MORE: `M18,22.3L18,22.3c-1.3,0-2.3-1.1-2.3-2.3v0c0-1.3,1.1-2.3,2.3-2.3h0c1.3,0,2.3,1.1,2.3,2.3v0
  C20.3,21.3,19.3,22.3,18,22.3z
  M5.1,22.3L5.1,22.3c-1.3,0-2.3-1.1-2.3-2.3v0c0-1.3,1.1-2.3,2.3-2.3h0c1.3,0,2.3,1.1,2.3,2.3v0
  C7.4,21.3,6.4,22.3,5.1,22.3z
  M30.9,22.3L30.9,22.3c-1.3,0-2.3-1.1-2.3-2.3v0c0-1.3,1.1-2.3,2.3-2.3h0c1.3,0,2.3,1.1,2.3,2.3v0
  C33.2,21.3,32.2,22.3,30.9,22.3z`,
  ICON_TYPE_MUTE_OUTLINE: `M5,30c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l26-26c0.4-0.4,1-0.4,1.4,0c0.4,0.4,0.4,1,0,1.4l-26,26
  C5.5,29.9,5.3,30,5,30z
  M18,36c-0.6,0-1-0.4-1-1v-4c0-0.6,0.4-1,1-1s1,0.4,1,1v4C19,35.6,18.6,36,18,36z
  M23,36H13c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S23.6,36,23,36z
  M18,31c-4.4,0-8-3.6-8-8V8c0-4.4,3.6-8,8-8s8,3.6,8,8v15C26,27.4,22.4,31,18,31z M18,2c-3.3,0-6,2.7-6,6v15
  c0,3.3,2.7,6,6,6s6-2.7,6-6V8C24,4.7,21.3,2,18,2z`,
  ICON_TYPE_PARTICIPANT_LIST: 'M0.5,0.9999 C0.224,0.9999 0,0.7759 0,0.4999 C0,0.2239 0.224,-0.0001 0.5,-0.0001 L19.5,-0.0001 C19.776,-0.0001 20,0.2239 20,0.4999 C20,0.7759 19.776,0.9999 19.5,0.9999 L0.5,0.9999 Z M19.5,6.9999 C19.776,6.9999 20,7.2239 20,7.4999 C20,7.7759 19.776,7.9999 19.5,7.9999 L0.5,7.9999 C0.224,7.9999 0,7.7759 0,7.4999 C0,7.2239 0.224,6.9999 0.5,6.9999 L19.5,6.9999 Z M19.5,13.9999 C19.776,13.9999 20,14.2239 20,14.4999 C20,14.7759 19.776,14.9999 19.5,14.9999 L0.5,14.9999 C0.224,14.9999 0,14.7759 0,14.4999 C0,14.2239 0.224,13.9999 0.5,13.9999 L19.5,13.9999 Z',
  ICON_TYPE_PTO: 'M9.80473107,7.62 C9.67063184,7.693 9.57756297,7.824 9.55254446,7.974 L8.9340868,11.596 L8.46473948,9.104 C8.435718,8.948 8.33364247,8.815 8.19053657,8.746 C8.12148547,8.713 8.04743067,8.696 7.97337587,8.696 C7.89331663,8.696 7.81325738,8.716 7.74020332,8.754 L5.9058459,9.721 C5.51055338,9.936 5.04721051,9.853 4.70695872,9.492 L4.49079876,9.283 L5.06222162,9.504 C5.19932307,9.557 5.35443786,9.547 5.48453413,9.475 L11.6490959,6.098 C11.7631803,6.035 11.907287,6.081 11.9623277,6.2 L11.9633284,6.201 C12.0133655,6.309 11.9713344,6.437 11.8672573,6.494 L9.80473107,7.62 Z M6.75847685,6.036 L8.14049954,6.876 L7.47400634,7.243 L6.60136058,6.128 L6.75847685,6.036 Z M12.8900142,5.721 L12.8900142,5.721 C12.7589172,5.417 12.5057298,5.182 12.196501,5.077 C11.8902744,4.972 11.556027,5.001 11.2758197,5.156 L9.15224824,6.321 L7.1547701,5.107 C6.90658645,4.964 6.61036724,4.965 6.35717989,5.111 L5.60162077,5.558 C5.47752894,5.631 5.39146526,5.754 5.36444526,5.896 C5.33842601,6.037 5.37345193,6.183 5.46251784,6.296 L6.58534873,7.73 L5.20632826,8.487 L4.46778173,8.201 C4.26262992,8.121 4.03446107,8.135 3.83331222,8.247 L3.24988048,8.585 C3.11377977,8.664 3.02271238,8.801 3.00369831,8.957 C2.98468424,9.112 3.03972497,9.267 3.15180791,9.377 L3.99343071,10.193 C4.63090244,10.87 5.59261411,11.034 6.38019692,10.601 L7.60710483,9.954 L8.10347214,12.593 C8.13349436,12.75 8.23657063,12.884 8.38167801,12.953 C8.44972837,12.984 8.52278243,13 8.59583649,13 C8.67889796,13 8.76195942,12.98 8.83601422,12.939 L9.48349336,12.583 C9.69264813,12.467 9.83575403,12.262 9.87678439,12.019 L10.4982443,8.38 L12.3676276,7.354 C12.9240394,7.048 13.1542097,6.331 12.8900142,5.721 L12.8900142,5.721 Z',
  ICON_TYPE_RIGHT_ARROW: 'M0.500700764,9.99959 C0.363700764,9.99959 0.227700764,9.94359 0.128700764,9.83459 C-0.0562992361,9.62859 -0.0392992361,9.31259 0.165700764,9.12759 L4.75270076,4.99959 L0.165700764,0.87159 C-0.0392992361,0.68659 -0.0562992361,0.37059 0.128700764,0.16459 C0.313700764,-0.03941 0.629700764,-0.05641 0.834700764,0.12759 L5.83470076,4.62759 C5.94070076,4.72359 6.00070076,4.85759 6.00070076,4.99959 C6.00070076,5.14159 5.94070076,5.27559 5.83470076,5.37159 L0.834700764,9.87159 C0.739700764,9.95759 0.619700764,9.99959 0.500700764,9.99959',
  ICON_TYPE_VIDEO_CROSS_OUTLINE: 'M22.024,12.855 C22.024,12.934 21.976,12.971 21.936,12.988 C21.895,13.004 21.836,13.011 21.78,12.957 L18,9.176 L18,8.823 L21.78,5.043 C21.836,4.987 21.897,4.996 21.936,5.012 C21.976,5.028 22.024,5.065 22.024,5.144 L22.024,12.855 Z M17,14.477 C17,15.317 16.316,16 15.477,16 L3.522,16 C3.285,16 3.063,15.941 2.863,15.843 L16.389,2.311 C16.757,2.589 17,3.026 17,3.522 L17,14.477 Z M2,14.477 L2,3.522 C2,2.683 2.683,2 3.522,2 L15.285,2 L2.156,15.136 C2.059,14.936 2,14.714 2,14.477 L2,14.477 Z M22.318,4.088 C21.892,3.911 21.402,4.007 21.073,4.335 L18,7.409 L18,3.522 C18,2.75 17.644,2.066 17.095,1.603 L17.845,0.854 C18.04,0.658 18.04,0.342 17.845,0.147 C17.649,-0.049 17.333,-0.049 17.138,0.147 L16.174,1.11 C15.951,1.046 15.721,1 15.477,1 L3.522,1 C2.131,1 1,2.131 1,3.522 L1,14.477 C1,14.992 1.156,15.47 1.422,15.87 L0.146,17.147 C-0.049,17.342 -0.049,17.658 0.146,17.854 C0.244,17.951 0.372,18 0.5,18 C0.628,18 0.756,17.951 0.854,17.854 L2.129,16.577 C2.529,16.843 3.007,17 3.522,17 L15.477,17 C16.868,17 18,15.868 18,14.477 L18,10.59 L21.072,13.664 C21.292,13.882 21.583,14 21.879,14 C22.027,14 22.176,13.97 22.318,13.912 C22.747,13.734 23.024,13.319 23.024,12.855 L23.024,5.144 C23.024,4.68 22.747,4.265 22.318,4.088 L22.318,4.088 Z',
  ICON_TYPE_VIDEO_OUTLINE: 'M33.9,9.7c-0.8-0.3-1.6-0.1-2.2,0.4l-4.6,4.6V9.5c0-2.2-1.8-4-4-4h-18c-2.2,0-4,1.8-4,4v16c0,2.2,1.8,4,4,4h18 c2.2,0,4-1.8,4-4v-5.2l4.6,4.6c0.4,0.4,0.9,0.6,1.4,0.6c0.3,0,0.5,0,0.8-0.2c0.8-0.3,1.2-1,1.2-1.8v-12C35.1,10.7,34.6,10,33.9,9.7z M25.1,25.5c0,1.1-0.9,2-2,2h-18c-1.1,0-2-0.9-2-2v-16c0-1.1,0.9-2,2-2h18c1.1,0,2,0.9,2,2V25.5z M33.1,23.5l-6-6l6-6V23.5z',
  ICON_TYPE_WAFFLE: 'M6 5c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1zm16 2c-.552 0-1-.448-1-1 0-.552.448-1 1-1 .552 0 1 .448 1 1 0 .552-.448 1-1 1zm-8-2c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1zm-8 8c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1zm16 0c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1zm-8 0c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1zm-8 8c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1zm16 0c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1zm-8 0c.552 0 1 .448 1 1 0 .552-.448 1-1 1-.552 0-1-.448-1-1 0-.552.448-1 1-1z'
};

// Some of our SVGs require a defined view box
const sizes = {
  ICON_TYPE_DELETE: 12,
  ICON_TYPE_DND: 16,
  ICON_TYPE_DOWNLOAD: 16,
  ICON_TYPE_EXIT: 20,
  ICON_TYPE_EXTERNAL_USER: 18,
  ICON_TYPE_EXTERNAL_USER_OUTLINE: 18,
  ICON_TYPE_FILES: 16,
  ICON_TYPE_INVITE: 24,
  ICON_TYPE_PARTICIPANT_LIST: 24,
  ICON_TYPE_PTO: 16,
  ICON_TYPE_RIGHT_ARROW: 12,
  ICON_TYPE_VIDEO_CROSS_OUTLINE: 24,
  ICON_TYPE_WAFFLE: 28
};

const transforms = {
  ICON_TYPE_DOWNLOAD: 'translate(2.000000, 1.000000)',
  ICON_TYPE_EXIT: 'translate(2.000000, 2.000000)',
  ICON_TYPE_PARTICIPANT_LIST: 'translate(1.000000, 3.000000)',
  ICON_TYPE_RIGHT_ARROW: 'translate(3.000000, 1.000000)',
  ICON_TYPE_VIDEO_CROSS_OUTLINE: 'translate(0.000000, 3.000000)'
};

function Icon(props) {
  const svgStyles = {
    svg: {
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    path: {
      fill: props.color
    }
  };

  const viewBoxSize = `0 0 ${sizes[props.type] || 36} ${sizes[props.type] || 36}`;

  return (
    <div className={classNames('webex-icon')} title={props.title}>
      <svg
        style={svgStyles.svg}
        width={`${props.size}`}
        height={`${props.size}`}
        viewBox={viewBoxSize}
      >
        <path
          style={svgStyles.path}
          d={paths[props.type]}
          transform={transforms[props.type]}
        />
      </svg>
    </div>
  );
}

Icon.propTypes = propTypes;

Icon.defaultProps = defaultProps;

export default Icon;
