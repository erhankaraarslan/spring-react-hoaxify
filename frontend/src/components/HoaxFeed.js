import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  getHoaxes,
  getNewHoaxCount,
  getNewHoaxCountOfUser,
  getNewHoaxes,
  getNewHoaxesOfUser,
  getOldHoaxes,
  getOldHoaxesOfUser,
} from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import HoaxView from "./HoaxView";
import Spinner from "./Spinner";
const HoaxFeed = () => {
  const [hoaxPage, setHoaxPage] = useState({
    content: [],
    last: true,
    number: 0,
  });

  const [newHoaxCount, setNewHoaxCount] = useState(0);

  const { t } = useTranslation();
  const { username } = useParams();

  const path = username
    ? `/api/1.0/users/${username}/hoaxes`
    : "/api/1.0/hoaxes";

  const initialHoaxLoadProgress = useApiProgress("get", path);

  let firstHoaxId = 0;
  let lastHoaxId = 0;
  if (hoaxPage.content.length > 0) {
    firstHoaxId = hoaxPage.content[0].id;
    const lastHoaxIndex = hoaxPage.content.length - 1;
    lastHoaxId = hoaxPage.content[lastHoaxIndex].id;
  }

  const loadOldHoaxesProgress = useApiProgress(
    "get",
    "/api/1.0/hoaxes/" + lastHoaxId,
    true
  );

  const loadNewHoaxesProgress = useApiProgress(
    "get",
    `/api/1.0/hoaxes/${firstHoaxId}?direction=after`,
    true
  );

  useEffect(() => {
    const getCount = async () => {
      let response;
      if (username === undefined) {
        response = await getNewHoaxCount(firstHoaxId);
      } else {
        response = await getNewHoaxCountOfUser(username, firstHoaxId);
      }
      setNewHoaxCount(response.data.count);
    };
    let looper = setInterval(getCount, 1000);
    return function cleanup() {
      clearInterval(looper);
    };
  }, [firstHoaxId, username]);

  useEffect(() => {
    const loadHoaxes = async (page) => {
      try {
        const response = await getHoaxes(username, page);
        setHoaxPage((prevHoaxPage) => ({
          ...response.data,
          content: [...prevHoaxPage.content, ...response.data.content],
        }));
      } catch (error) {}
    };
    loadHoaxes();
  }, [username]);

  const loadOldHoaxes = async () => {
    let response;
    try {
      if (username === undefined) {
        response = await getOldHoaxes(lastHoaxId);
      } else {
        response = await getOldHoaxesOfUser(username, lastHoaxId);
      }
      setHoaxPage((prevHoaxPage) => ({
        ...response.data,
        content: [...prevHoaxPage.content, ...response.data.content],
      }));
    } catch (error) {}
  };

  const loadNewHoaxes = async () => {
    let response;
    if (username === undefined) {
      response = await getNewHoaxes(firstHoaxId);
    } else {
      response = await getNewHoaxesOfUser(username, firstHoaxId);
    }

    setHoaxPage((prevHoaxPage) => ({
      ...prevHoaxPage,
      content: [...response.data, ...prevHoaxPage.content],
    }));
  };

  const onDeleteHoaxSuccess = (id) => {
    setHoaxPage((prevHoaxPage) => ({
      ...prevHoaxPage,
      content: prevHoaxPage.content.filter((hoax) => hoax.id !== id),
    }));
  };

  const { content, last } = hoaxPage;

  if (content.length === 0) {
    return (
      <div className='alert alert-secondary text-center'>
        {initialHoaxLoadProgress ? <Spinner /> : t("There are no hoaxes")}
      </div>
    );
  }

  return (
    <div>
      {newHoaxCount > 0 && (
        <div
          className='alert alert-secondary text-center mb-1'
          onClick={loadNewHoaxesProgress ? () => {} : loadNewHoaxes}
          style={{ cursor: loadNewHoaxesProgress ? "not-allowed" : "pointer" }}
        >
          {loadNewHoaxesProgress ? <Spinner /> : t("There are new hoaxes")}
        </div>
      )}
      {content.map((hoax) => {
        return (
          <HoaxView
            key={hoax.id}
            hoax={hoax}
            onDeleteHoax={onDeleteHoaxSuccess}
          ></HoaxView>
        );
      })}
      {!last && (
        <div
          className='alert alert-secondary text-center'
          onClick={loadOldHoaxesProgress ? () => {} : loadOldHoaxes}
          style={{ cursor: loadOldHoaxesProgress ? "not-allowed" : "pointer" }}
        >
          {loadOldHoaxesProgress ? <Spinner /> : t("Load old hoaxes")}
        </div>
      )}
    </div>
  );
};

export default HoaxFeed;
