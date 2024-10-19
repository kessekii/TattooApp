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
  getPointByQuadIdAndPointId,
  getPointsInRadius,
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
  pointId: any;
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
    if (props.point && props.focusedPoint === props.point?.pointId) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [props.focusedPoint]);
  console.log(JSON.stringify(props.point));
  // if (!props.point.location) {
  //   return <></>;
  // }
  console.log(props.point);
  return (
    <AdvancedMarker
      key={props.pointId}
      position={
        props.point && props.point?.location
          ? {
              lng: props.point?.location?.lng,
              lat: props.point?.location?.lat,
            }
          : undefined
      }
      onMouseEnter={() => {
        if (props.focusedPoint === null) setIsVisible(true);
      }}
      onMouseLeave={() => {
        if (props.focusedPoint === null) setIsVisible(false);
      }}
      onClick={() => {
        if (props.focusedPoint === null) props.setfocusedPoint(props.pointId);
      }}
    >
      <div
        style={{
          width: isVisible ? "200px" : "40px",
          height: isVisible ? "200px" : "40px",
          zIndex: "1",
          background: isVisible ? "white" : "black",
        }}
      >
        {isVisible && props.point?.icon !== "" && (
          <Paper
            style={{
              zIndex: "1",
              background: "black",
              width: "40px",
              height: "40px",
            }}
            onClick={() => {
              if (props.focusedPoint === null)
                props.setfocusedPoint(props.point?.pointId);
            }}
          ></Paper>
        )}
        {isVisible && (
          <>
            <Typography color="black">{props.point?.data?.name}</Typography>
            <Typography color="black">
              {props.point?.data?.discription}
            </Typography>
            <Button
              onClick={async () => {
                await props.tryRemovingAPoint(
                  props.point,

                  props.setUser,

                  props.auth,

                  props.setPoints
                );
                props.setfocusedPoint(null);
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

  setUser: any,

  auth: any,

  setPoints: any
) => {
  const headers = {
    Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
  };
  const point_lat = point.location.lat.toFixed(2).toString();
  const point_lng = point.location.lng.toFixed(2).toString();
  const coord = point_lat + ":" + point_lng;
  const userData = (await deletePointbyPointId(coord, point.pointId)).payload;
  // console.log("EEEE", userData);
  let pointsObject: any = {};
  for (let quadId of Object.keys(userData.points)) {
    for (let pointId of userData.points[quadId]) {
      const pointData = await getPointByQuadIdAndPointId(quadId, pointId);
      pointsObject[pointId] = pointData.payload;
    }
  }

  setUser(userData);
  setPoints(pointsObject);
  await auth.setUserFull(userData);
  // setFocusedPoint(null);
};

const tryAddNewPoint = async (
  ev: any,
  user: any,
  setUser: any,
  setErrorMessage: any,
  auth: any,
  addPoint: any,
  setPoints: any
) => {
  const userU = JSON.parse(window.localStorage.getItem("user") || "{}");
  console.log("????????", user);
  const newUserData = (
    await createPointByUsername(user.username, ev.detail.latLng!)
  ).payload;

  let pointsObject: any = {};
  console.log(newUserData.points);
  for (let quadId of Object.keys(newUserData?.points || {})) {
    for (let pointId of newUserData.points[quadId]) {
      const pointData = await getPointByQuadIdAndPointId(quadId, pointId);
      pointsObject[pointId] = pointData.payload;
    }
  }
  console.log(newUserData, pointsObject);
  setUser(newUserData);
  setPoints(pointsObject);
  await auth.setUserFull(newUserData);
};

export const MapPage = () => {
  // const [points, setPoints] = useState<Poi[]>([]);
  const { addPoint } = useActions();
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useLocalStorage("user", {});
  const [points, setPoints] = useLocalStorage("points", {});
  const [focusedPoint, setfocusedPoint] = useState<any>(null);
  const [cameraLocation, setCameraLocation] = useState({
    lat: 32.02119878251853,
    lng: 34.74333323660794,
  });

  const auth = useAuth();

  // useEffect(() => {
  //   if (!user) {
  //     setUser(Object.assign({}, user));
  //   }
  // }, [user]);

  const pointsStates = useMemo(
    () =>
      Object.keys(points || {}).map((pointId: any) => {
        return (
          <PoiMarker
            key={pointId}
            pointId={pointId}
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
          onCameraChanged={async (ev: MapCameraChangedEvent) => {
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom
            );
            setCameraLocation(ev.detail.center);

            const pointsInRadius = (
              await getPointsInRadius(ev.detail.center, 1.8)
            ).payload;
            console.log("pointsInRadius", pointsInRadius);
            let inumeratel = user;
            inumeratel.points = pointsInRadius;
            setUser(inumeratel);
            setPoints(pointsInRadius);
          }}
          onClick={(ev) => {
            if (focusedPoint === null) {
              tryAddNewPoint(
                ev,
                user,
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
