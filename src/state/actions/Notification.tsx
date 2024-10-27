// Notification component connected to Redux
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { useActions } from "../../hooks/useActions";

export interface NotificationOptions {
  asPortal?: boolean;
  timeout?: number;
  withTimeout?: boolean;
}

const DEFAULT_NOTIF_TIMEOUT = 3000; // Adjust as necessary

const NOTIF_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

const Notification = ({ children }) => {
  const { notification, addNotification, removeNotification } =
    useTypedSelector((state) => state.notify);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      addNotification &&
      addNotification.withTimeout &&
      addNotification.timeout >= 0
    ) {
      const timeoutID = setTimeout(() => {
        dispatch(removeNotification());
      }, notification.timeout);

      return () => clearTimeout(timeoutID);
    }
  }, [notification, dispatch]);

  const notify = (message, type, options = {}) => {
    const notifProps = {
      asPortal: false,
      timeout: DEFAULT_NOTIF_TIMEOUT,
      withTimeout: true,
      ...options,
      message,
      type,
    };

    dispatch(addNotification(notifProps));
  };

  const notifyError = (message, options) =>
    notify(message, NOTIF_TYPES.ERROR, options);
  const notifySuccess = (message, options) =>
    notify(message, NOTIF_TYPES.SUCCESS, options);
  const notifyInfo = (message, options) =>
    notify(message, NOTIF_TYPES.INFO, options);

  return (
    <>
      {notification && (
        <div className="notification-container">
          {/* Render notification */}
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        </div>
      )}
      {children}
    </>
  );
};

Notification.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Notification;
