import React, { useState } from 'react';
import {
  AvatarNext,
  ButtonCircle,
  IconNext,
} from '@momentum-ui/react-collaboration';

import useWebexClasses from '../../hooks/useWebexClasses';
import './SpeedDialPhotoInput.styles.scss';

type ISpeedDialPhotoInputProps = {
  name: string;
  title?: string;
  src?: string;
  className?: string;
};

const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * The Speed Dial Photo input that handles previewing an avatar.
 *
 * @param {ISpeedDialPhotoInputProps} props Component props
 * @param {string} props.title The title
 * @param {string} props.name The file input name
 * @param {string} props.className Custom class names
 * @returns {React.Component} React component
 */
export const SpeedDialPhotoInput = ({
  name,
  src = '',
  title = undefined,
  className = undefined,
}: ISpeedDialPhotoInputProps) => {
  const [cssClasses, sc] = useWebexClasses('speed-dial-photo-input');

  const [imageSrc, setImageSrc] = useState<string>(src);

  const handleFileRead = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const base64 = await convertBase64(file);
      setImageSrc(base64 as string);
    }
  };

  const fileRef = React.createRef<HTMLInputElement>();

  return (
    <div className={`${cssClasses} ${className}`}>
      <div className={sc('image-container')}>
        {imageSrc && (
          <img src={imageSrc} alt="Avatar" className={sc('image')} />
        )}
        {!imageSrc && <AvatarNext title={title} src={imageSrc} size={72} />}
        <div className={sc('button-container')}>
          <ButtonCircle
            size={28}
            outline
            onPress={() => {
              fileRef.current?.click();
            }}
          >
            <IconNext name="plus" scale={18} weight="bold" />
          </ButtonCircle>
        </div>
      </div>
      <input
        ref={fileRef}
        onChange={handleFileRead}
        className={sc('file')}
        id="fileInput"
        type="file"
        name={name}
      />
    </div>
  );
};

/*
            <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z"
              fill="url(#pattern0)"
            />
            <defs>
              <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_4865_361306"
                  transform="scale(0.00833333)"
                />
              </pattern>
              <image
                id="image0_4865_361306"
                width="120"
                height="120"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
        */
