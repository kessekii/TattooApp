import { Box, LinearProgress, Paper } from "@mui/material";
import { useEffect } from "react";
import { Logo } from "../../pages/components/reusableComponents";
import logo from "../logo-gif-black.gif";
import "./loading.css";
export const Loading = (props: { loading: boolean; report?: boolean }) => {
  if (!props.loading) {
    return <></>;
  }
  return (
    <Paper
      style={{
        position: "absolute",
        top: "0%",
        width: "calc(100vw)",
        height: props.report ? "200vh" : "100vh",
        backdropFilter: "blur(6px)",
        zIndex: "100",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="lds-ring"
        style={{ position: "absolute", marginTop: "-5%" }}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Paper>
  );
};

export const FirstLoading = (props: {
  loading: boolean;
  report?: boolean;
  progress: number;
}) => {
  // useEffect(() => {
  //
  // }, [props.progress])
  if (!props.loading) {
    return <></>;
  }
  return (
    <Paper
      style={{
        position: "absolute",
        top: "0%",
        width: "100%",
        height: "100%",
        backdropFilter: "blur(6px)",
        zIndex: "99999",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        left: "0%",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Paper
        style={{
          position: "absolute",
          top: "0%",
          width: "100%",
          height: "100%",
          backdropFilter: "blur(6px)",
          zIndex: "99999",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: "0%",
          flexDirection: "column",
          overflow: "hidden",
        }}
      ></Paper>
      <Logo
        style={{
          display: "flex",

          position: "relative",

          // transform: 'scale(0.8)'
        }}
      >
        <img
          width="203px"
          height="152px"
          src={logo}
          alt="TO2"
          onAnimationEnd={(e) => {
            e.currentTarget.src = logo;
          }}
          onCompositionEnd={(e) => {
            e.currentTarget.src = logo;
          }}
          onMouseEnter={(e) => {
            e.currentTarget.src = logo;
          }}
        />
      </Logo>
      <Box
        sx={{
          position: "relative",
          width: "60%",
          height: "60px",
          marginTop: "100px",
        }}
      >
        <LinearProgress
          style={{
            zIndex: "100000",
            position: "relative",
            height: "10%",
            borderRadius: "10px",
            backgroundColor: "black",
          }}
          variant="determinate"
          value={props.progress}
          color="secondary"
          classes={{}}
        />
        <Box
          height={"60px"}
          sx={{
            position: "relative",
            width: "101%",
            height: "11px",
            // marginTop: '100px',
            marginLeft: "-0.5%",
            marginTop: "-1%",
            borderRadius: "10px",
            background:
              "linear-gradient(90deg, rgba(238,29,66,1) 0%, rgba(64,19,129,1) 100%)",
          }}
        ></Box>
      </Box>
    </Paper>
  );
};
