import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AddButton } from "../../pages/components/reusableComponents";

export const ErrorPrompt = ({
  PopUpVisible,
  setPopUpVisible,
  errorMessage,
  setErrorMessage,
  handleLogout,
}: {
  PopUpVisible: boolean;
  setPopUpVisible: any;
  errorMessage?: null | string;
  setErrorMessage: any;
  handleLogout: any;
}) => {
  // if (errorMessage?.toString().includes('401')) {
  // 	handleLogout()
  // }
  return (
    <Dialog open={PopUpVisible}>
      <DialogTitle>ERROR</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {errorMessage?.toString() || "Unknown Error"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <AddButton
          style={{ margin: "auto" }}
          onClick={() => {
            setErrorMessage(null);
            setPopUpVisible(false);
            errorMessage?.toString().includes("CLIENT VERSION")
              ? handleLogout()
              : setPopUpVisible(false);
          }}
        >
          Cancel
        </AddButton>
      </DialogActions>
    </Dialog>
  );
};
