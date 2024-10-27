import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React from "react";
import CheckIcon from "../../assets/svg/checkIcon";
import { AddButton } from "../../pages/components/reusableComponents";

export const SuccessPrompt = ({
  PopUpVisible,
  setPopUpVisible,
  message,
}: {
  PopUpVisible: boolean;
  setPopUpVisible: any;
  message: string;

  icon?: any;
}) => {
  return (
    <Dialog open={PopUpVisible}>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckIcon />
        <DialogContentText>{message.toString()}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <AddButton
          style={{ margin: "auto", width: "auto" }}
          onClick={() => {
            setPopUpVisible(false);
          }}
        >
          OK
        </AddButton>
      </DialogActions>
    </Dialog>
  );
};
