import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux/es/exports";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { postHoax, postHoaxAttachment } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProggress from "./ButtonWithProggress";
import Input from "./input";
import AutoUploadImage from "./AutoUploadImage";

const HoaxSubmit = () => {
  const { image } = useSelector((store) => ({ image: store.image }));
  const [focused, setFocused] = useState(false);
  const [hoax, setHoax] = useState("");
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [newImage, setNewImage] = useState();
  const [attachmentId, setAttachmentId] = useState();

  useEffect(() => {
    if (!focused) {
      setHoax("");
      setErrors({});
      setNewImage();
      setAttachmentId();
    }
  }, [focused]);

  useEffect(() => {
    setErrors({});
  }, [hoax]);

  const onClickHoaxify = async () => {
    const body = {
      content: hoax,
      attachmentId: attachmentId,
    };
    try {
      await postHoax(body);
      setFocused(false);
    } catch (error) {
      if (error.response.data.validationErrors) {
        setErrors(error.response.data.validationErrors);
      }
    }
  };
  let textAreaClass = "form-control";
  if (errors.content) {
    textAreaClass += " is-invalid";
  }

  const onChangeFile = (event) => {
    if (event.target.files.length < 1) {
      return;
    }
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
      uploadFile(file);
    };
    fileReader.readAsDataURL(file);
  };

  const uploadFile = async (file) => {
    const attachment = new FormData();
    attachment.append("file", file);
    const response = await postHoaxAttachment(attachment);
    setAttachmentId(response.data.id);
  };

  const pendingApiCallSendHoax = useApiProgress(
    "post",
    "/api/1.0/hoaxes",
    true
  );
  const pendingFileUpload = useApiProgress(
    "post",
    "/api/1.0/hoax-attachments",
    true
  );

  return (
    <div className='card p-1 flex-row'>
      <ProfileImageWithDefault
        image={image}
        width='32'
        height='32'
        className='rounded-circle me-1'
      />
      <div className='flex-fill'>
        <textarea
          className={textAreaClass}
          rows={focused ? "3" : "1"}
          onFocus={() => setFocused(true)}
          onChange={(event) => {
            setHoax(event.target.value);
          }}
          value={hoax}
          placeholder={t("Write something here...")}
        />
        <div className='invalid-feedback'>{errors.content}</div>
        {focused && (
          <>
            {!newImage && <Input type='file' onChange={onChangeFile} />}
            {newImage && (
              <AutoUploadImage
                image={newImage}
                uploading={pendingFileUpload}
              ></AutoUploadImage>
            )}
            <div className='text-end mt-1'>
              <ButtonWithProggress
                onClick={onClickHoaxify}
                pendingApiCall={pendingApiCallSendHoax}
                disabled={pendingApiCallSendHoax || pendingFileUpload}
                text={t("Hoaxify")}
              ></ButtonWithProggress>

              <button
                className='btn btn-light d-inline-flex ms-1'
                onClick={() => {
                  setFocused(false);
                }}
                disabled={pendingApiCallSendHoax || pendingFileUpload}
              >
                <span className='material-icons'>close</span>
                {t("Cancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HoaxSubmit;
