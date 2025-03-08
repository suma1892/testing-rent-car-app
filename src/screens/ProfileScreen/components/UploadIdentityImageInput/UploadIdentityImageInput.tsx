import FirstTimeIdentityUploadInput from './FirstTimeIdentityUploadInput';
import ImagePickerModal from 'components/MyProfileComponent/ImagePickerModal/ImagePickerModal';
import React, {Dispatch, memo, SetStateAction, useState} from 'react';
import ReuploadIdentityInput from './ReuploadIdentityInput';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {ImagePickerResponse} from 'react-native-image-picker';
import {setUserData} from 'redux/features/user/userSlice';
import {showBSheet} from 'utils/BSheet';
import {uploadFile} from 'redux/features/user/userAPI';
import {useAppDispatch, useAppSelector} from 'redux/hooks';

type UploadIdentityImageInputProps = {
  type: 'ktp' | 'sim';
  temporaryFileUpload: TemporaryFileUpload;
  setTemporaryFileUpload: Dispatch<SetStateAction<TemporaryFileUpload>>;
  formError: ProfileForm;
  setFormError: Dispatch<SetStateAction<ProfileForm>>;
};

type TypeUpload = 'photo_ktp' | 'photo_license';

const UploadIdentityImageInput = ({
  type,
  temporaryFileUpload,
  setTemporaryFileUpload,
  formError,
  setFormError,
}: UploadIdentityImageInputProps) => {
  const dispatch = useAppDispatch();
  const {userProfile} = useAppSelector(appDataState);
  const [fileName, setFileName] = useState('');

  const needReviewKtp =
    type === 'ktp' && userProfile?.personal_info?.need_review_ktp;
  const needReviewSim =
    type === 'sim' && userProfile?.personal_info?.need_review_sim;
  const uploadType = type === 'ktp' ? 'photo_ktp' : 'photo_license';

  const onImageChange = (
    val: ImagePickerResponse['assets'],
    type: TypeUpload,
  ) => {
    if (type && val?.[0]) {
      dispatch(uploadFile({file: val?.[0], name: type}));
      setFormError(prev => ({...prev, [type]: ''}));
      setFileName(val?.[0]?.fileName || '');
    }
  };

  const showImagePickerOptionsModal = (type: TypeUpload) => {
    showBSheet({
      snapPoint: ['30%', '30%'],
      content: (
        <ImagePickerModal
          onCameraChange={val => onImageChange(val, type)}
          onImageLibraryChange={val => onImageChange(val, type)}
        />
      ),
    });
  };

  if (needReviewKtp || needReviewSim) {
    return (
      <ReuploadIdentityInput
        onPress={() => {
          showImagePickerOptionsModal(uploadType);
        }}
        onDelete={() => {
          setTemporaryFileUpload(prev => ({
            ...prev,
            [uploadType]: '',
          }));
          dispatch(setUserData({[uploadType]: ''}));
        }}
        selectedImageLabel={fileName}
        selected={
          type === 'ktp'
            ? temporaryFileUpload.photo_ktp
            : temporaryFileUpload.photo_license
        }
      />
    );
  }

  return (
    <FirstTimeIdentityUploadInput
      selectedImageLabel={fileName}
      selected={
        type === 'ktp'
          ? temporaryFileUpload.photo_ktp
          : temporaryFileUpload.photo_license
      }
      onPress={() => {
        showImagePickerOptionsModal(uploadType);
      }}
      onDelete={() => {
        setTemporaryFileUpload(prev => ({
          ...prev,
          [uploadType]: '',
        }));
        dispatch(setUserData({[uploadType]: ''}));
      }}
      errorMessage={formError[uploadType]}
    />
  );
};

export default memo(UploadIdentityImageInput);
