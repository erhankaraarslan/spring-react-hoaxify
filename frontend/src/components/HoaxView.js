import React, { useState } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux/es/exports";
import { deleteHoax } from "../api/apiCalls";
import Modal from "./Modal";
import { useApiProgress } from "../shared/ApiProgress";

const HoaxView = (props) => {
  const loggedInUser = useSelector((store) => store.username);
  const { hoax, onDeleteHoax } = props;
  const { user, content, timestamp, fileAttachment, id } = hoax;
  const { username, displayName, image } = user;
  const { t, i18n } = useTranslation();
  const formatted = format(timestamp, i18n.language);
  const ownedByLoggedInuser = loggedInUser === username;
  const [modalVisible, setModalVisible] = useState(false);

  const pendingApiCall = useApiProgress(
    "delete",
    "/api/1.0/hoaxes/" + id,
    true
  );

  const onClickDelete = async () => {
    await deleteHoax(id);
    onDeleteHoax(id);
  };

  const onClickCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div className='card p-1'>
        <div className='d-flex'>
          <ProfileImageWithDefault
            image={image}
            width='32'
            height='32'
            className='rounded-circle m-1'
          />
          <div className='flex-fill m-auto ps-2'>
            <Link to={`/user/${username}`} className='text-info'>
              <h6 className='d-inline'>
                {displayName}@{username}
              </h6>
              <span>-</span>
              <span className='text-black-50'>{formatted}</span>
            </Link>
          </div>
          {ownedByLoggedInuser && (
            <button
              className='btn btn-delete-link btn-sm'
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <span className='material-icons'>delete_outline</span>
            </button>
          )}
        </div>
        <div className='ps-5'>{content}</div>
        {fileAttachment && (
          <div className='ps-5'>
            {fileAttachment.fileType.startsWith("image") && (
              <img
                className='img-fluid'
                src={"images/attachment/" + fileAttachment.name}
                alt={content}
              ></img>
            )}
            {!fileAttachment.fileType.startsWith("image") && (
              <strong>Hoax has unknown attachment</strong>
            )}
          </div>
        )}
      </div>
      <Modal
        visible={modalVisible}
        onClickCancel={onClickCancel}
        onClickOk={onClickDelete}
        pendingApiCall={pendingApiCall}
        title={t("Delete Hoax")}
        okButton={t("Delete Hoax")}
        message={
          <div>
            <div>
              <strong>{t("Are you sure to delete hoax?")}</strong>
            </div>
            <span>{content}</span>
          </div>
        }
      />
    </>
  );
};

export default HoaxView;
