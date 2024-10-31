// src/components/BottomNav.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Box, Button, InputLabel, Paper, TextField } from "@mui/material";

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
  getChatsByUserId,
  getPointByQuadIdAndPointId,
  getPointsInRadius,
  getPostsByUserId,
  getUserById,
  updatePoint,
  updatePointbyPointId,
} from "../../hooks/useChat";
import { PostImage, UploadInput } from "../masterspage/masterPage";
import zIndex from "@mui/material/styles/zIndex";
import { keyframes, styled } from "styled-components";
import { useTheme } from "../../state/providers/themeProvider";

export const PointBox = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 20px;
  border-radius: 10px;
  z-index: 9999999999;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  color: ${({ theme }) => theme.text};
`;
const fadeIn = keyframes`
0% {
  opacity: 0;
 
  
}
100% {
  
  opacity 1;
}
`;

const faded = keyframes`
0% {
  opacity: 0;
 
  
}
100% {
  
  opacity 0;
}
`;

export const PaperFade = styled.div<{ isLoaded: boolean }>`
  opacity: ${({ isLoaded }) => (isLoaded ? "1" : "0")};
  animation: ${({ isLoaded }) => (isLoaded ? fadeIn : faded)} 0.6s ease-in-out
    forwards;
`;

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
  cameraLocation: any;
  tryEditingAPoint: any;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useLocalStorage("user", {});
  const [friend, setFriend] = useLocalStorage("friend", {});
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", {});
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", {});
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string>(props.point?.data?.name || "");
  const [desc, setDesc] = useState<string>(props.point?.data?.desc || "");
  const [newImage, setNewImage] = useState({ src: "", caption: "" });
  const [isNewImage, setIsNewImage] = useState(false);
  const { themevars } = useTheme();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImage({ ...newImage, src: reader.result as string });
        setIsNewImage(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (props.point && props.focusedPoint === props.point?.pointId) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [props.focusedPoint]);
  // console.log(JSON.stringify(props.point));
  // if (!props.point.location) {
  //   return <></>;
  // }
  // console.log(props.point);

  const isAvailableEdit =
    Object.keys(user.points).includes(
      props.point.location.lat.toFixed(2) +
        ":" +
        props.point.location.lng.toFixed(2)
    ) &&
    user.points[
      props.point.location.lat.toFixed(2) +
        ":" +
        props.point.location.lng.toFixed(2)
    ].find((point) => point === props.point.pointId);
  console.log(isAvailableEdit, props.focusedPoint);
  // console.log(props.point.data);
  return (
    <>
      {isEdit && (
        <Paper
          style={{
            position: "absolute",
            marginBlock: "auto",
            display: "flex",
            flexDirection: "column",
            margin: "20px",
            top: "10vh",
            height: "70vw",
            width: "70vw",
          }}
        >
          <textarea
            onChange={(e) => {
              console.log(e);
              setName(e.target.value);
            }}
            value={name}
            className={"textarea"}
          >
            {/* {name} */}
          </textarea>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            className={"textarea"}
          >
            {/* {desc} */}
          </textarea>
          <UploadInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Box style={{ flexDirection: "row" }}>
            <Button
              style={{
                width: "30px",
                height: "40px",
                background: "gray",
                color: "white",
                marginTop: "50px",
                marginRight: "90px",
              }}
              onClick={async () => {
                await props.tryEditingAPoint(
                  {
                    ...props.point,
                    data: {
                      ...props.point.data,
                      name: name,
                      desc: desc,
                      icon: newImage.src,
                    },
                  },

                  props.setUser,

                  props.auth,

                  props.setPoints,
                  props.cameraLocation
                );
                setIsEdit(false);
              }}
            >
              SAVE
            </Button>
            <Button
              style={{
                width: "30px",
                height: "40px",
                background: "gray",
                color: "white",
                marginTop: "50px",
              }}
              onClick={async () => {
                setIsEdit(false);
              }}
            >
              CANCEL
            </Button>
          </Box>
        </Paper>
      )}
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
        // onMouseEnter={() => {
        //   if (props.focusedPoint === null) {
        //     setIsVisible(true);
        //     props.setfocusedPoint(props.pointId);
        //   }
        // }}
        // onMouseLeave={() => {
        //   if (props.focusedPoint === null) {
        //     setIsVisible(false);
        //   } else {
        //     props.setfocusedPoint(null);
        //   }
        // }}
        onClick={() => {
          if (props.focusedPoint === null) props.setfocusedPoint(props.pointId);
        }}
      >
        {isVisible ? (
          <div
            style={{
              width: "300px",
              height: "300px",
              zIndex: 100,
              background: themevars.background,
              position: "inherit",
              display: "flex",
            }}
          >
            {isVisible && props.point?.data?.icon ? (
              <Paper
                style={{
                  background: "black",
                  width: "40px",
                  height: "40px",
                  margin: "10px",
                }}
                onClick={() => {
                  if (props.focusedPoint === null)
                    props.setfocusedPoint(props.point?.pointId);
                }}
              >
                <PostImage
                  // style={{ zIndex: 0 }}
                  src={props.point?.data?.icon}
                ></PostImage>
              </Paper>
            ) : (
              <PostImage
                // style={{ zIndex: 0 }}
                src={props.point?.data?.icon}
              ></PostImage>
            )}
            {isVisible && (
              <PointBox style={{ zIndex: 99999999999 }}>
                {!isEdit && (
                  <>
                    <Typography
                      style={{ width: "auto", fontSize: 20 }}
                      color="black"
                    >
                      {props.point?.data?.name}
                    </Typography>
                    <Typography color="black">
                      {props.point?.data?.desc}
                    </Typography>
                  </>
                )}
                {isAvailableEdit && (
                  <Button
                    onClick={async () => {
                      setIsEdit(!isEdit);
                    }}
                    style={{
                      width: "30px",
                      height: "40px",
                      background: "gray",
                      color: "white",
                      marginTop: "150px",
                      marginRight: "40px",
                    }}
                  >
                    {!isEdit ? "edit" : "save"}
                  </Button>
                )}
                {isAvailableEdit && (
                  <Button
                    onClick={async () => {
                      await props.tryRemovingAPoint(
                        props.point,

                        props.setUser,

                        props.auth,

                        props.setPoints,
                        props.cameraLocation
                      );
                      props.setfocusedPoint(null);
                    }}
                    style={{
                      width: "30px",
                      height: "40px",
                      color: "white",
                      background: "red",
                      marginTop: "150px",
                    }}
                  >
                    REMOVE
                  </Button>
                )}

                {!isAvailableEdit && (
                  <Button
                    onClick={async () => {
                      navigate("../" + props.point.owner);
                    }}
                    style={{
                      width: "150px",
                      height: "40px",
                      color: "white",
                      background: "blue",
                      marginTop: "150px",
                    }}
                  >
                    TO OWNER PAGE
                  </Button>
                )}
              </PointBox>
            )}
          </div>
        ) : (
          <Paper>
            {!isVisible &&
            props.focusedPoint &&
            props.focusedPoint !== props.pointId ? (
              <></>
            ) : (
              <PostImage
                onClick={() => {
                  if (props.focusedPoint === null)
                    props.setfocusedPoint(props.point?.pointId);
                }}
                style={{ zIndex: 0, width: "40px", height: "40px" }}
                src={props.point?.data?.icon}
              ></PostImage>
            )}
          </Paper>
        )}
        {/* </Pin> */}
      </AdvancedMarker>
    </>
  );
};

const tryRemovingAPoint = async (
  point: any,

  setUser: any,

  auth: any,

  setPoints: any,
  cameraLocation: any
) => {
  const headers = {
    Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
  };
  const point_lat = point.location.lat.toFixed(2).toString();
  const point_lng = point.location.lng.toFixed(2).toString();
  const coord = point_lat + ":" + point_lng;
  const newUserData = (await deletePointbyPointId(coord, point.pointId))
    .payload;
  // console.log("EEEE", userData);

  const pointsObject = await getPointsInRadius(cameraLocation, false);

  setUser(newUserData);
  setPoints(pointsObject.payload);
  await auth.setUserFull(newUserData);
  // setFocusedPoint(null);
};
const tryEditingAPoint = async (
  point: any,

  setUser: any,

  auth: any,

  setPoints: any,
  cameraLocation: any
) => {
  const headers = {
    Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
  };
  const point_lat = point.location.lat.toFixed(2).toString();
  const point_lng = point.location.lng.toFixed(2).toString();
  const coord = point_lat + ":" + point_lng;
  const newUserData = (await updatePointbyPointId(coord, point)).payload;
  // console.log("EEEE", userData);

  const pointsObject = await getPointsInRadius(cameraLocation, false);

  setUser(newUserData);
  setPoints(pointsObject.payload);
  await auth.setUserFull(newUserData);
  // setFocusedPoint(null);
};
const calcCrow = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

// Converts numeric degrees to radians
const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};
const tryAddNewPoint = async (
  ev: any,
  user: any,
  setUser: any,
  setErrorMessage: any,
  auth: any,
  addPoint: any,
  setPoints: any,
  cameraLocation: any
) => {
  if (user) {
    const userU = JSON.parse(window.localStorage.getItem("user") || "{}");

    const geoCode = await geocodeLatLng(new google.maps.Geocoder());

    async function geocodeLatLng(geocoder: google.maps.Geocoder) {
      let { lat, lng } = ev.detail.latLng;
      lat = parseFloat(lat.toFixed(2));
      lng = parseFloat(lng.toFixed(2));

      const response = await geocoder.geocode({
        location: { lat: lat, lng: lng },
      });
      const parts = response.results[0].formatted_address.split(",");
      console.log(parts);
      if (parts.length === 3) {
        return parts[1].replace(" ", "") + "," + parts[2].replace(" ", "");
      } else if (parts.length === 2) {
        const sf = parts[0].split(" ").filter((e, i) => i !== 0);

        return (
          sf.toString().replace(",", " ") + "," + parts[1].replace(" ", "")
        );
      }
    }

    const newUserData = (
      await createPointByUsername(userU.username, ev.detail.latLng!, geoCode)
    ).payload;

    const pointsObject = await getPointsInRadius(cameraLocation, false);

    setUser(newUserData);
    setPoints(pointsObject.payload);
    await auth.setUserFull(newUserData);
  }
};

export const MapPage = () => {
  // const [points, setPoints] = useState<Poi[]>([]);
  const { addPoint } = useActions();
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useLocalStorage("user", {});
  const [loading, setLoading] = useLocalStorage("loading", null);
  const [points, setPoints] = useLocalStorage("points", {});
  const [cameraUpdateLock, setCameraUpdateLock] = useState(false);
  const [focusedPoint, setfocusedPoint] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraLocation, setCameraLocation] = useState({
    lat: 32.02119878251853,
    lng: 34.74333323660794,
  });
  const { theme } = useTheme();
  const auth = useAuth();
  const handleCameraRefresh = async (
    ev: MapCameraChangedEvent,
    cameraUpdateLock: boolean,
    setCameraUpdateLock: any
  ) => {
    if (cameraUpdateLock) {
      return;
    }

    // console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom);
    const distance = calcCrow(
      ev.detail.center.lat,
      ev.detail.center.lng,
      cameraLocation.lat,
      cameraLocation.lng
    );
    // console.log(distance);
    if (distance > 0.7) {
      setCameraUpdateLock(true);

      const pointsInRadius = (
        await getPointsInRadius(ev.detail.center, cameraUpdateLock)
      ).payload;
      // console.log("pointsInRadius", pointsInRadius);
      // let inumeratel = user;
      // inumeratel.points = pointsInRadius;
      if (pointsInRadius) {
        setCameraUpdateLock(false);
      }
      setUser(user);
      setPoints(pointsInRadius);
      setCameraLocation(ev.detail.center);
    }
  };

  const { themevars } = useTheme();

  const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];

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
            cameraLocation={cameraLocation}
            tryEditingAPoint={tryEditingAPoint}
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
      <PaperFade
        style={{
          width: isMobile ? "100vw" : "900px",
          height: isMobile ? "100vh" : "600px",
          background: themevars.background,
        }}
        isLoaded={isLoaded}
      >
        <Map
          defaultZoom={15}
          id="map"
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={false}
          mapTypeControl={false}
          mapId={"d4d9dfa4fa686c88"}
          onTilesLoaded={() => setIsLoaded(true)}
          defaultCenter={{ lat: 32.02119878251853, lng: 34.74333323660794 }}
          onCameraChanged={async (e) => {
            if (!cameraUpdateLock) {
              await handleCameraRefresh(
                e,
                cameraUpdateLock,
                setCameraUpdateLock
              );
            }
          }}
          onClick={(ev) => {
            if (focusedPoint === null) {
              // if (cameraUpdateLock) {
              tryAddNewPoint(
                ev,
                user,
                setUser,

                setErrorMessage,
                auth,
                addPoint,
                setPoints,
                cameraLocation
              );
            } else {
              setfocusedPoint(null);
            }
          }}
        >
          {pointsStates}
        </Map>
      </PaperFade>
    </APIProvider>
  );
};
