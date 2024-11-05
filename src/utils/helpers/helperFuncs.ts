import axios from "axios";
import { getAvatarByUserId } from "../../../src/pages/masterspage/portfolioViewPage";
import AxiosCustom from "../../utils/Axios";

export const imageToBlob = async (imageSrc: string): Promise<Blob> => {
  const response = await fetch(imageSrc);
  const blob = await response.blob();
  return blob;
};
export const blobToImage = async (blob: any): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};
//main function to generate nodes for the checkboxes. Mainly used for publisher media capabilities.
export const generateNodesFromArray = (arr: string[], structure: any) => {
  try {
    const baseNodes = arr.map((value: string) => {
      const obj = {};
      for (const [key] of Object.entries(structure)) {
        if (key === "value" || key === "label") {
          Object.assign(obj, { [key]: value });
        } else {
          Object.assign(obj, { [key]: "" });
        }
      }
      return obj;
    });
    return baseNodes;
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const getPointImageByPointId = async (
  pointId: string,
  quadId: string
) => {
  try {
    const response = await fetch(
      "http://localhost:4000/images/getPointImageByPointId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ pointId: pointId, quadId: quadId }),
      }
    );

    const result = response.json();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const getAvatars = async (friend) => {
  let avatarsImagesObject = {};
  let avatarsIds = [];

  const imageUser = await getAvatarByUserId(friend.username);
  if (!imageUser || !imageUser.payload) return [];

  avatarsImagesObject = {
    ...avatarsImagesObject,
    [friend.username]: imageUser.payload,
  };
  avatarsIds.push(imageUser.payload.id);

  for (let friendUsername of Object.keys(friend.friends || {})) {
    const image = await getAvatarByUserId(friendUsername);
    if (!image) continue;
    avatarsImagesObject = {
      ...avatarsImagesObject,
      [friendUsername]: image.payload,
    };
    avatarsIds.push(image.payload.id);
  }
  console.log(avatarsImagesObject);
  // setAvatars(avatarsImagesObject);
  return [avatarsIds, avatarsImagesObject];
};

export const getAvatarIdsByChatId = async (chatId) => {
  try {
    const response = await fetch(
      "http://localhost:4000/images/getImageIdsByChatId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ chatId: chatId }),
      }
    );

    const result = response.json();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const filterContactsByType = (arr: any, type: string) => {
  if (!arr || arr.length === 0) return [];
  const filtered: string[] = [];
  arr.forEach((el: any) => {
    if (el.type === type) filtered.push(el.email);
  });
  return filtered.sort();
};

export function stringIsValidName(string: string) {
  if (
    string.includes("/") ||
    string.endsWith(" ") ||
    string.startsWith(" ") ||
    string.includes("%") ||
    string.includes(".") ||
    string.includes(",")
  ) {
    return false;
  }
  return true;
}
export function checkValidBudgets(daily: number, monthly: number) {
  if (daily > 0 && monthly > 0) {
    return daily > monthly;
  }
  return false;
}
export function isValidEmail(email: string) {
  return email.includes("@");
}

export const makeDictionaryFromEntries = (object: any) => {
  return Object.assign(
    {},
    ...Object.entries(object).map((x) => ({
      [x[0]]: x[1],
    }))
  );
};

export const formatDateToMonth = (inputDate: string) => {
  // 1. Parse the date string
  if (!inputDate) return null;
  const date = new Date(inputDate);

  // 2. Format the date
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  });
  return formatter.format(date);
};

export const getMonthAbbreviation = (dateStr: string) => {
  if (!dateStr) return null;
  const dateObj = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(dateObj);
};
export const getYear = (dateStr: string) => {
  if (!dateStr) return null;
  const dateObj = new Date(dateStr);
  return dateObj.getFullYear().toString();
};

export const handleFinanceStatusColor = (value: string) => {
  const valueToCheck = value.toLowerCase();
  if (valueToCheck === "yes") {
    return "linear-gradient(90deg, rgba(0, 255, 44, 1) 0%, rgba(0, 204, 38, 1) 100%)";
  } else if (valueToCheck === "on hold") {
    // return 'linear-gradient(90deg, rgba(230, 230, 230, 1) 0%, rgba(179, 179, 179, 1) 100%)'
    return "linear-gradient(90deg, rgba(252, 238, 33, 1) 0%, rgba(251, 176, 59, 1) 100%)";
  } else if (valueToCheck === "on hold yellow") {
    return "linear-gradient(90deg, rgba(252, 238, 33, 1) 0%, rgba(251, 176, 59, 1) 100%)";
  } else {
    return "linear-gradient(90deg, rgba(227, 120, 131, 1) 0%, rgba(233, 43, 74, 1) 100%)";
  }
};
