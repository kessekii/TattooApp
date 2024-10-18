import { ThemeProvider } from "@emotion/react";
import MenuIcon from "@mui/icons-material/Menu";
import { DialogActions, ListItemButton, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/gif-once.gif";
import { FirstLoading, Loading } from "../assets/svg/loading";
import { CLIENT_VERSION, routes } from "../config";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import {
  ActionsButton,
  AddButton,
  CancelButton,
  ChipInputList,
  Logo,
  StyledDialog,
  StyledTextField,
  UserNameWithAvatar,
} from "../pages/components/reusableComponents";
import { fetchData } from "../utils/helpers/navigationHelper";
import { ErrorPrompt } from "../utils/notifications/ErrorPrompt";
import { SuccessPrompt } from "../utils/notifications/SuccessPrompt";
import { WarningPrompt } from "../utils/notifications/WarningPrompt";
import theme from "../utils/theme";
import { MenuComponent, MenuIsSelected, MenuNotSelected } from "./NavBarStyled";

const ResponsiveDrawer = (props: {
  isErrorPromptOpened: any;
  setIsErrorPromptOpened: any;
  isSuccessPromptOpened: any;
  setIsSuccessPromptOpened: any;
  isWarningPromptOpened: any;
  setIsWarningPromptOpened: any;
  setErrorMessage: any;
  errorMessage: any;
  PopUpVisible: boolean;
  setPopUpVisible: any;
  forcedFilterStatus: number;
  setForcedFilterStatus: any;
}) => {
  const { login } = useTypedSelector((state) => state);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentpage, setCurrentpage] = useState(location.pathname);
  const [viewRecord, setViewRecord] = useState<any>(null);
  const [isPreviewOpened, setIsPreviewOpened] = useState(false);
  const [universalEdit, setUniversalEdit] = useState<any>(null);
  const [universalDelete, setUniversalDelete] = useState<any>(null);
  const { logOutAction } = useActions();

  console.log(login);

  const labelConvertorIntoPage = (label: string) => {
    return "/" + label.toLowerCase();
  };

  useEffect(() => {
    const currentPath = "/" + window.location.pathname.split("/")[1];
    if (currentPath !== currentpage) {
      setCurrentpage(window.location.pathname);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (props.errorMessage !== null) {
      props.setIsErrorPromptOpened(true);
    }
  }, [props.errorMessage]);

  useEffect(() => {
    if (viewRecord !== null) {
      setIsPreviewOpened(true);
    }
  }, [viewRecord]);

  useEffect(() => {
    return () => {
      if (isPreviewOpened) {
        setUniversalDelete(null);
        setUniversalEdit(null);
      }
    };
  }, [isPreviewOpened]);

  // useEffect(() => {
  // 	const loadCurrentSettings = async () => {
  // 		const headers = {
  // 			Authorization: `Token ${login.user.token}`,
  // 		}
  // 		await getSettingsAction(headers)
  // 	}
  // 	loadCurrentSettings()
  // }, [])

  // useEffect(() => {
  // 	console.log(currentpage)
  // }, [currentpage])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const RowViewPopUp = (props: {
    row: any;
    setRow: any;
    popUpVisible: any;
    setPopUpVisible: any;
  }) => {
    const renderFilters = (row: any) => {
      const keys = Object.entries(row);
      const result = keys.filter((c: any) => {
        return c[1].length !== 0;
      });
      const a = result.map((r) => (
        <ChipInputList
          key={r[0]}
          label={r[0]}
          style={{ pointerEvents: "none" }}
          options={r}
          value={r[1] as string[]}
        ></ChipInputList>
      ));
      return a;
    };

    if (props.popUpVisible && props.row) {
      return <StyledDialog open={isPreviewOpened}></StyledDialog>;
    }
    return <></>;
  };

  const SelectionComponent = ({
    children,
    isSelected,
  }: {
    children: any;
    isSelected: boolean;
  }) => {
    if (isSelected)
      return <MenuIsSelected theme={theme}>{children}</MenuIsSelected>;
    return <MenuNotSelected theme={theme}>{children}</MenuNotSelected>;
  };

  const DrawerComponent = (props: { setPopUpVisible: any }) => {
    const Option = (props: {
      page: any;
      index: number;
      disabled?: boolean;
      setPopUpVisible?: any;
    }) => {
      let route = props.page;

      const map = {
        STREAM: "newstream",
      };
      if (map[props.page as keyof typeof map]) {
        route = map[props.page as keyof typeof map];
      }
      return (
        <MenuItem
          onClick={() => {
            const futureRoute = "/" + route.toLowerCase();
            if (props.setPopUpVisible) {
              props.setPopUpVisible(false);
            }
            setCurrentpage(futureRoute);
            navigate(futureRoute);
          }}
          disabled={props.disabled && props.disabled == true ? true : false}
        >
          {props.page}
        </MenuItem>
      );
    };

    return (
      <MenuComponent
        theme={theme}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "200px",
          whiteSpace: "nowrap",
          marginLeft: "-12px",
        }}
      >
        <Logo
          style={{
            display: "flex",
            width: "90px",
            position: "relative",
            marginLeft: "20px",
            // transform: 'scale(0.8)'
          }}
        >
          <img
            width="45px"
            height="35px"
            src={logo}
            alt="TO2"
            onMouseEnter={(e) => {
              e.currentTarget.src = logo;
            }}
          />
        </Logo>
        {/* <GradientedText
					fontFamily='Montserrat'
					fontSize='12pt'
					fontWeight='1000'
					marginRight='24px'
				>
					Thing Or Two.
				</GradientedText> */}
        <List
          style={{
            display: "inherit",
            width: "80%",
            flexDirection: "inherit",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2px",
          }}
        >
          <Option page={"newstream"} index={0} />
        </List>
        <Toolbar
          style={{
            justifyContent: "flex-end",
            paddingLeft: "0px",
            marginLeft: "20px",
            marginTop: "-2px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <SelectionComponent
            isSelected={
              false
              // window.location.pathname === '/logs' ||
              // window.location.pathname === '/users' ||
              // window.location.pathname === '/settings'
              // 	? true
              // 	: false
            }
          >
            <ActionsButton
              style={{
                boxShadow: "none",
                // color:
                // window.location.pathname === '/logs' ||
                // window.location.pathname === '/users' ||
                // window.location.pathname === '/settings'
                // 	? theme.palette.primary.main
                // 	: 'inherit',
              }}
              width={0}
              row={undefined}
              label={"settings"}
              options={menuOptions}
              // arrowColor={theme.colors.red}
            >
              <UserNameWithAvatar value={login.user.username} />
            </ActionsButton>
          </SelectionComponent>
        </Toolbar>
      </MenuComponent>
    );
  };
  const handleLogout = () => {
    // logOutAction({ setUser });
    navigate("/");
  };
  const menuOptions = (
    <div>
      {login.user.role.toLowerCase() === "admin" ||
      login.user.role.toLowerCase() === "super" ? (
        <>
          {login.user.role.toLowerCase() === "super" ? (
            <MenuItem
              key={"logs_menuption"}
              onClick={() => {
                navigate("/logs");
                setCurrentpage("/logs");
              }}
            >
              Logs
            </MenuItem>
          ) : (
            <></>
          )}

          <MenuItem
            key={"settings_menuption"}
            onClick={() => {
              navigate("/settings");
              setCurrentpage("/settings");
            }}
          >
            Settings
          </MenuItem>
        </>
      ) : null}
      <MenuItem
        onClick={() => {
          navigate("/users");
          setCurrentpage("/users");
        }}
      >
        Users
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("/personalSettings");
          setCurrentpage("/personalSettings");
        }}
      >
        Personal
      </MenuItem>
      {/* <MenuItem onClick={() => handleLogout()}>Log</MenuItem> */}
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <Box
          component="nav"
          sx={{ width: { sm: 40 }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            //container={container}
            style={{ backgroundColor: theme.colors.gray }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <DrawerComponent setPopUpVisible={props.setPopUpVisible} />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "100%",
                height: "55px",
                backgroundColor: theme.colors.gray,
                padding: "0.1rem 1rem 0.1rem 3rem",
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "0px",
                boxShadow: "-4px 4px 4px -3px rgba(0,0,0,0.9)",
              },
            }}
            open
          >
            <DrawerComponent setPopUpVisible={props.setPopUpVisible} />
          </Drawer>
        </Box>

        <Box component="main" sx={{ width: "100%" }}>
          <Toolbar />
          <ErrorPrompt
            errorMessage={props.errorMessage}
            setErrorMessage={props.setErrorMessage}
            PopUpVisible={props.isErrorPromptOpened}
            setPopUpVisible={props.setIsErrorPromptOpened}
            handleLogout={handleLogout}
          />
          <SuccessPrompt
            message={"UPDATE SUCCESSFUL"}
            PopUpVisible={props.isSuccessPromptOpened}
            setPopUpVisible={props.setIsSuccessPromptOpened}
          />
          <RowViewPopUp
            row={viewRecord}
            setRow={setViewRecord}
            popUpVisible={isPreviewOpened}
            setPopUpVisible={setIsPreviewOpened}
          />
          <WarningPrompt
            message={
              "Refreshing the Data may take some time (approximately 2-15 seconds)"
            }
            PopUpVisible={props.isWarningPromptOpened}
            setPopUpVisible={props.setIsWarningPromptOpened}
          />

          <Loading loading={loading} />
          <FirstLoading loading={firstLoading} progress={progress} />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ResponsiveDrawer;

const checkFinanceLabel = (currentpage: string) => {
  if (currentpage === "/finance/balancein") {
    return "BALANCE IN";
  }
  if (currentpage === "/finance/balanceout") {
    return "BALANCE OUT";
  }
  if (currentpage === "/finance/mediabuying") {
    return "MEDIA BUYING";
  }
  if (
    currentpage === "/finance/global" ||
    currentpage === "/finance/demand" ||
    currentpage === "/finance/supply" ||
    currentpage === "/finance/personal"
  ) {
    return currentpage.split("/")[2].toUpperCase();
  }
  return "FINANCE";
};
