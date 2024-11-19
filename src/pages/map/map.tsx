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
import Resizer from "react-image-file-resizer";
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
  getUserMapImagesByUserId,
  updatePoint,
  updatePointbyPointId,
} from "../../hooks/useChat";
import { PostImage, UploadInput } from "../masterspage/masterPage";
import zIndex from "@mui/material/styles/zIndex";
import { keyframes, styled } from "styled-components";
import { useTheme } from "../../state/providers/themeProvider";
import { getPointImageByPointId } from "../../utils/helpers/helperFuncs";
import { useQuery } from "@apollo/client";
import {
  CREATE_POINT,
  POINT_IMAGE_BY_USER_QUERY,
  POINTS_QUERY,
  UPDATE_POINT,
} from "../../graphQL/queries";
import useSlice from "../../hooks/useSlice";

export const PointBox = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 20px;
  border-radius: 10px;
  z-index: 100;
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

  cameraLocation: any;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const [points, setPoints] = useLocalStorage("points", {});
  const pointsInRadiusGQLHook = useQuery(POINTS_QUERY, {
    variables: {
      coordOfCenter: { lat: 32.02119878251853, lng: 34.74333323660794 },
      blocked: false,
    },
  });
  const pointImageByUserGQLHook = useQuery(POINT_IMAGE_BY_USER_QUERY, {
    variables: {
      username: props.user.username,
    },
  });
  const updatePointGQLHook = useQuery(UPDATE_POINT, {
    variables: {
      point: props.point,
      quadId: "1",
    },
  });
  const { data: user, setUser } = useSlice("user"); // Replace useLocalStorage with useSlice
  const { data: friend, setFriend, getFriendData } = useSlice("friend");
  const {
    events: events,
    posts: feedPosts,
    setEvents,
    getNewsDataAction,
  } = useSlice("news");
  const { data: posts, setPosts, getPostsByUserIdAction } = useSlice("posts");
  const {
    avatars: avatars,
    ids: ids,
    mapImages: mapImages,
    setMapImages,
    getMapImagesByUserIdAction,
    getImagesByImageIdsAction,
    getImageIdsByUsernameAction,
    getAvatarsAction,
  } = useSlice("images");
  const {
    data: friendPosts,
    setFriendPosts,
    getFriendPostsAction,
  } = useSlice("friendPosts");

  // const { imageIds, setImageIds } = useSlice("imageIds");
  const {
    privateChats,
    publicChats,
    setPrivateChats,
    setPostChats,
    getPrivateChatsAction,
    getPublicChatsAction,
  } = useSlice("chats");
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string>(props.point?.data?.name || "");
  const [desc, setDesc] = useState<string>(props.point?.data?.desc || "");
  const [newImage, setNewImage] = useState({ src: "", id: props.pointId });
  const [isNewImage, setIsNewImage] = useState(false);
  const { themevars } = useTheme();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        Resizer.imageFileResizer(
          event.target.files[0],
          100,
          100,
          "JPEG",
          100,
          0,
          async (uri) => {
            if (typeof uri === "string") {
              setNewImage({ src: uri, id: props.pointId });
            }
          },
          "base64",
          100,
          100
        );

        setIsNewImage(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const tryEditingAPoint = async (point: any, cameraLocation: any) => {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    const point_lat = point.location.lat.toFixed(2).toString();
    const point_lng = point.location.lng.toFixed(2).toString();
    const coord = point_lat + ":" + point_lng;
    // point.imageSrc = newImage.src;

    const usePointData = (
      await updatePointGQLHook.refetch({
        point: {
          pointId: point.pointId,
          data: {
            name: name,
            desc: desc,
            icon: point.data.icon,
          },
          location: {
            lat: point.location.lat,
            lng: point.location.lng,
          },
          owner: point.owner,
        },
        quadId: coord,
      })
    ).data.updatePoint;

    console.log(usePointData);
    // console.log("EEEE", userData);
    const pointData = (
      await pointsInRadiusGQLHook.refetch({
        coordOfCenter: cameraLocation,
        blocked: false,
      })
    ).data.getPointsInRadius;

    const mapImagges = (
      await pointImageByUserGQLHook.refetch({ username: user.username })
    ).data.getMapImagesByUserPage;

    setUser(usePointData);
    setMapImages(mapImagges);
    const [newUserData, newPointData] = (
      await updatePointbyPointId(coord, point)
    ).payload;
    //

    const pointsInRadius = (await getPointsInRadius(cameraLocation, false))
      .payload;

    setUser(newUserData);
    setFriend(newUserData);
    // props.setPoints({
    //   ...pointsInRadius,
    //   [newPointData.pointId]: newPointData,
    // });
    const mapImagesByRadios = {};

    for (let pointId of Object.keys(pointsInRadius)) {
      let quadId =
        pointsInRadius[pointId].location.lat.toFixed(2) +
        ":" +
        pointsInRadius[pointId].location.lng.toFixed(2);

      const image = await getPointImageByPointId(pointId, quadId);
      if (!image) continue;

      mapImagesByRadios[pointsInRadius[pointId].data.icon] = image.src;
    }
    const userMapImages: any = await getUserMapImagesByUserId(
      newUserData.username
    );
    if (!userMapImages.payload) return;

    setMapImages({ ...userMapImages.payload, ...mapImagesByRadios });

    // setFocusedPoint(null);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (props.point && props.focusedPoint === props.point?.pointId) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [props.focusedPoint]);
  //;
  // if (!props.point.location) {
  //   return <></>;
  // }
  //;

  const isAvailableEdit =
    user.points?.includes(
      props.point.location.lat.toFixed(2) +
        ":" +
        props.point.location.lng.toFixed(2)
    ) &&
    user.points[
      props.point.location.lat.toFixed(2) +
        ":" +
        props.point.location.lng.toFixed(2)
    ].find((point) => point === props.point.pointId);
  //;
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
                await tryEditingAPoint(props.point, props.cameraLocation);
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
                  src={
                    mapImages && mapImages.length > 0
                      ? mapImages.find((e) => e.id === props.point?.data?.icon)
                          ?.src
                      : ""
                  }
                ></PostImage>
              </Paper>
            ) : (
              <PostImage
                // style={{ zIndex: 0 }}
                src={
                  mapImages && mapImages.length > 0
                    ? mapImages.find((e) => e.id === props.point?.data?.icon)
                        ?.src
                    : ""
                }
              ></PostImage>
            )}
            {isVisible && (
              <PointBox style={{ zIndex: 1999 }}>
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

                        // props.setPoints,
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
                src={
                  mapImages && mapImages.length > 0
                    ? mapImages?.find((e) => e.id === props.point?.data?.icon)
                        ?.src
                    : ""
                }
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
  //

  const pointsObject = await getPointsInRadius(cameraLocation, false);

  setUser(newUserData);

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

export const MapPage = () => {
  // const [points, setPoints] = useState<Poi[]>([]);
  const { addPoint } = useActions();
  const [loading, setLoading] = useLocalStorage("loading", null);

  const [errorMessage, setErrorMessage] = useState("");
  const { data: user, setUser } = useSlice("user");
  const { data: friend, setFriend } = useSlice("friend");
  const pointsInRadiusGQLHook = useQuery(POINTS_QUERY, {
    variables: {
      coordOfCenter: { lat: 32.02119878251853, lng: 34.74333323660794 },
      blocked: false,
    },
  });
  const createPointByUsernameGQLHook = useQuery(CREATE_POINT, {
    variables: {
      username: user.username,
      location: { lat: 32.02119878251853, lng: 34.74333323660794 },
      geocode: "",
    },
  });
  const pointImageByUserGQLHook = useQuery(POINT_IMAGE_BY_USER_QUERY, {
    variables: {
      username: user.username,
    },
  });
  const {
    images: images,
    mapImages: mapImages,
    avatars: avatars,
    setMapImages,
    setImages,
  } = useSlice("images");

  const { privateChats, publicChats } = useSlice("chats");
  const { data: friendPosts, setFriendPosts } = useSlice("friendPosts");

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
    try {
      if (cameraUpdateLock) {
        return;
      }

      //
      const distance = calcCrow(
        ev.detail.center.lat,
        ev.detail.center.lng,
        cameraLocation.lat,
        cameraLocation.lng
      );
      //;
      if (distance > 0.7) {
        setCameraUpdateLock(true);

        const pointData = (
          await pointsInRadiusGQLHook.refetch({
            coordOfCenter: cameraLocation,
            blocked: false,
          })
        ).data.getPointsInRadius;

        const mapImagges = (
          await pointImageByUserGQLHook.refetch({ username: user.username })
        ).data.getMapImagesByUserPage;
        console.log(mapImagges);
        setMapImages(mapImagges);
        setUser(user);

        setCameraLocation(ev.detail.center);

        setCameraUpdateLock(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const { themevars } = useTheme();

  const tryAddNewPoint = async (
    ev: any,
    user: any,
    setUser: any,
    setErrorMessage: any,
    auth: any,
    addPoint: any,

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
          language: "en",
        });
        const parts = response.results[0].formatted_address.split(",");
        if (parts.length === 3) {
          return parts[1].replace(" ", "") + "," + parts[2].replace(" ", "");
        } else if (parts.length === 2) {
          const sf = parts[0].split(" ").filter((e, i) => i !== 0);

          return (
            sf.toString().replace(",", " ") + "," + parts[1].replace(" ", "")
          );
        }
      }
      const createPointData = (
        await createPointByUsernameGQLHook.refetch({
          username: userU.username,
          location: ev.detail.latLng,
          geocode: geoCode,
        })
      ).data.createPointByUsername;

      const getPtInRadius = (
        await pointsInRadiusGQLHook.refetch({
          coordOfCenter: cameraLocation,
        })
      ).data.getPointsInRadius;

      setUser(createPointData.user);
      // setFriend(newUserData);
    }
  };

  const pointsStates = useMemo(
    () =>
      pointsInRadiusGQLHook.data?.points?.map((point: any) => {
        return (
          <PoiMarker
            key={point.pointId}
            pointId={point.pointId}
            point={point}
            user={user}
            setUser={setUser}
            tryRemovingAPoint={tryRemovingAPoint}
            focusedPoint={focusedPoint}
            setfocusedPoint={setfocusedPoint}
            setErrorMessage={setErrorMessage}
            auth={auth}
            addPoint={addPoint}
            cameraLocation={cameraLocation}
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
      pointsInRadiusGQLHook,
      mapImages,
      setMapImages,
      pointsInRadiusGQLHook,
    ]
  );

  const isMobile = window.innerWidth < window.innerHeight;
  return (
    <APIProvider
      apiKey="AIzaSyAGFYy06ioQhkJ1yOit5nequl-z05bNgm4"
      onLoad={() => {}}
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
