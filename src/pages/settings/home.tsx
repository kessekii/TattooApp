// src/components/BottomNav.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button, Paper } from "@mui/material";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import { Typography } from "antd";

import { useTypedSelector } from "../../hooks/useTypedSelector";
import useLocalStorage from "../../hooks/useLocalStorage";
import { User } from "../register/registerPage";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../hooks/useAuth";
import { useActions } from "../../hooks/useActions";
import {
  createPointByUsername,
  deletePointbyPointId,
  getPointByPointId,
} from "../../../src/hooks/useChat";

type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  name: string;
  icon: any;
  discription: string;
  username: string;
};
const PoiMarker = (props: {
  point: any;
  user: any;
  setUser: any;
  tryRemovingAPoint: any;
  focusedPoint: any;
  setfocusedPoint: any;
  setErrorMessage: any;
  auth: any;
  addPoint: any;
  setPoints: any;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (props.point && props.focusedPoint === props.point.pointId) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [props.focusedPoint]);
  console.log(JSON.stringify(props.point));
  if (!props.point) {
    return <></>;
  }
  console.log(props);
  return (
    <AdvancedMarker
      key={props.point.pointId}
      position={props.point.location}
      onMouseEnter={() => {
        if (props.focusedPoint === null) setIsVisible(true);
      }}
      onMouseLeave={() => {
        if (props.focusedPoint === null) setIsVisible(false);
      }}
      onClick={() => {
        if (props.focusedPoint === null)
          props.setfocusedPoint(props.point.pointId);
      }}
    >
      {/* <Pin background={"#FBBC04"} glyphColor={"#0f0"} borderColor={"#000"} /> */}
      <div
        style={{
          width: isVisible ? "200px" : "40px",
          height: isVisible ? "200px" : "40px",
          zIndex: "1",
          background: isVisible ? "white" : "black",
        }}
      >
        {isVisible && props.point.icon !== "" && props.point.icon && (
          <Paper
            style={{
              zIndex: "1",
              background: "black",
              width: "40px",
              height: "40px",
            }}
            onClick={() => {
              if (props.focusedPoint === null)
                props.setfocusedPoint(props.point.pointId);
            }}
          ></Paper>
        )}
        {isVisible && (
          <>
            <Typography color="black">{props.point.data?.name}</Typography>
            <Typography color="black">
              {props.point.data?.discription}
            </Typography>
            <Button
              onClick={async () => {
                await props.tryRemovingAPoint(
                  props.point,
                  props.user,
                  props.setUser,
                  props.setErrorMessage,
                  props.auth,
                  props.addPoint,
                  props.setPoints
                );
                props.setfocusedPoint(0);
              }}
              style={{ width: "20px", height: "20px", background: "red" }}
            ></Button>
          </>
        )}
      </div>
      {/* </Pin> */}
    </AdvancedMarker>
  );
};
const tryRemovingAPoint = async (
  point: any,
  user: any,
  setUser: any,
  setErrorMessage: any,
  auth: any,
  addPoint: any,
  setPoints
) => {
  const headers = {
    Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
  };

  const newUserFields = Object.assign({}, user);

  const userData = await deletePointbyPointId(point.key);

  console.log(newUserFields);
  let pointsObject: any = {};
  for (let pointId of Object.keys(userData.points)) {
    const pointData = await getPointByPointId(pointId);
    pointsObject[pointId] = pointData.payload;
  }
  setUser(userData);
  setPoints(pointsObject);
  await auth.setUserFull(newUserFields);
};

const tryAddNewPoint = async (
  ev: any,

  setUser: any,
  setErrorMessage: any,
  auth: any,
  addPoint: any,
  setPoints: any
) => {
  const user = JSON.parse(window.localStorage.getItem("user") || "");

  const newUserFields = Object.assign({}, user);

  await createPointByUsername(user.username, ev.detail.latLng!);
  let pointsObject: any = {};
  for (let pointId of Object.keys(user.points)) {
    const pointData = await getPointByPointId(pointId);
    pointsObject[pointId] = pointData.payload;
  }
  setUser(newUserFields);
  setPoints(pointsObject);
  // addPoint(newUserFields, setErrorMessage);
  await auth.setUserFull(newUserFields);
};

export const MapPage = () => {
  // const [points, setPoints] = useState<Poi[]>([]);
  const { addPoint } = useActions();
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useLocalStorage("user", {});
  const [points, setPoints] = useLocalStorage("points", {});
  const [focusedPoint, setfocusedPoint] = useState<any>(null);

  const auth = useAuth();

  // useEffect(() => {
  //   if (!user) {
  //     setUser(Object.assign({}, user));
  //   }
  // }, [user]);

  const pointsStates = useMemo(
    () =>
      Object.keys(points).map((pointId: any) => {
        return (
          <PoiMarker
            key={pointId}
            point={points[pointId]}
            user={user}
            setUser={setUser}
            tryRemovingAPoint={tryRemovingAPoint}
            focusedPoint={focusedPoint}
            setfocusedPoint={setfocusedPoint}
            setErrorMessage={setErrorMessage}
            auth={auth}
            addPoint={addPoint}
            setPoints={setPoints}
          ></PoiMarker>
        );
      }) || [],
    [
      focusedPoint,
      user,
      setUser,
      setfocusedPoint,
      auth,
      setErrorMessage,
      points,
    ]
  );
  const isMobile = window.innerWidth < window.innerHeight;
  return (
    <APIProvider
      apiKey="AIzaSyAGFYy06ioQhkJ1yOit5nequl-z05bNgm4"
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Paper
        style={{
          width: isMobile ? "100vw" : "900px",
          height: isMobile ? "80vh" : "600px",
        }}
      >
        <Map
          defaultZoom={15}
          mapId={"d4d9dfa4fa686c88"}
          defaultCenter={{ lat: 32.02119878251853, lng: 34.74333323660794 }}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom
            )
          }
          onClick={(ev) => {
            const userRef = {};
            Object.assign(userRef, user);
            if (focusedPoint === null) {
              console.log("", userRef);
              tryAddNewPoint(
                ev,
                setUser,

                setErrorMessage,
                auth,
                addPoint,
                setPoints
              );
            } else {
              setfocusedPoint(null);
            }
          }}
        >
          {pointsStates}
        </Map>
      </Paper>
    </APIProvider>
  );
};
