import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux/es/exports";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { useTranslation } from "react-i18next";
import Input from "./input";
import { updateUser, deleteUser } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProggress from "./ButtonWithProggress";
import { logoutSuccess, updateSuccess } from "../redux/authActions";
import Modal from "./Modal";

const ProfileCard = (props) => {
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState();
  const reduxState = useSelector((store) => ({
    loggedInUsername: store.username,
  }));
  const { loggedInUsername } = reduxState;
  const routeParams = useParams();
  const pathUsername = routeParams.username;
  const [user, setUser] = useState({});
  const [editable, setEditable] = useState(false);
  const [newImage, setNewImage] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    setEditable(pathUsername === loggedInUsername);
  }, [pathUsername, loggedInUsername]);

  const { username, displayName, image } = user;
  const { t } = useTranslation();

  useEffect(() => {
    setValidationErrors((previousValidationErrors) => ({
      ...previousValidationErrors,
      displayName: undefined,
    }));
  }, [updatedDisplayName]);

  useEffect(() => {
    setValidationErrors((previousValidationErrors) => ({
      ...previousValidationErrors,
      image: undefined,
    }));
  }, [newImage]);

  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined);
      setNewImage(undefined);
    }
    setUpdatedDisplayName(displayName);
  }, [inEditMode, displayName]);

  const onClickSave = async () => {
    let image;
    if (newImage) {
      image = newImage.split(",")[1];
    }
    const body = {
      displayName: updatedDisplayName,
      image,
    };
    try {
      const response = await updateUser(username, body);
      setInEditMode(false);
      setUser(response.data);
      dispatch(updateSuccess(response.data));
    } catch (error) {
      setValidationErrors(error.response.data.validationErrors);
    }
  };
  const onChangeFile = (event) => {
    if (event.target.files.length < 1) {
      return;
    }
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const pendingApiCall = useApiProgress("put", "/api/1.0/users/" + username);
  const pendingApiCallDeleteUser = useApiProgress(
    "delete",
    "/api/1.0/users/" + username
  );
  const { displayName: displayNameError, image: imageError } = validationErrors;
  const onClickDeleteUser = async () => {
    await deleteUser(username);
    setModalVisible(false);
    dispatch(logoutSuccess());
    history.push("/");
  };
  const onClickCancel = () => {
    setModalVisible(false);
  };
  return (
    <div className='card text-center'>
      <div className='card-header'>
        <ProfileImageWithDefault
          className='rounded-circle shadow'
          alt={`${username} profile`}
          width='200'
          height='200'
          image={image}
          tempimage={newImage}
        ></ProfileImageWithDefault>
      </div>
      <div className='card-body'>
        {!inEditMode && (
          <>
            <h3>
              {displayName}@{username}
            </h3>
            {editable && (
              <>
                <div>
                  <button
                    className='btn btn-success d-inline-flex'
                    onClick={() => {
                      setInEditMode(true);
                    }}
                  >
                    <span className='material-icons'>edit</span>
                    {t("Edit")}
                  </button>
                </div>
                <div className='pt-2'>
                  <button
                    className='btn btn-danger d-inline-flex'
                    onClick={() => {
                      setModalVisible(true);
                    }}
                  >
                    <span className='material-icons'>directions_run</span>
                    {t("Delete My Account")}
                  </button>
                </div>
                <Modal
                  visible={modalVisible}
                  title={t("Delete My Account")}
                  okButton={t("Delete My Account")}
                  onClickCancel={onClickCancel}
                  onClickOk={onClickDeleteUser}
                  pendingApiCall={pendingApiCallDeleteUser}
                  message={t("Are you sure to delete your account?")}
                />
              </>
            )}
          </>
        )}
        {inEditMode && (
          <div>
            <Input
              label={t("Change Display Name")}
              defaultValue={displayName}
              onChange={(event) => {
                setUpdatedDisplayName(event.target.value);
              }}
              error={displayNameError}
            />

            <Input type='file' onChange={onChangeFile} error={imageError} />

            <div>
              <ButtonWithProggress
                className='btn btn-primary d-inline-flex'
                onClick={onClickSave}
                disabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={
                  <>
                    <span className='material-icons'>save</span>
                    {t("Save")}
                  </>
                }
              ></ButtonWithProggress>
              <button
                className='btn btn-light d-inline-flex ms-1'
                disabled={pendingApiCall}
                onClick={() => {
                  setInEditMode(false);
                }}
              >
                <span className='material-icons'>close</span>
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
