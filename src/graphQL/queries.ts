import { gql } from "@apollo/client";

const USER_QUERY = gql`
  query User($username: String!) {
    getProfileData(username: $username) {
      username

      calendar {
        date
      }

      friends {
        username
        profilePicture {
          id
          src
        }
        backdrop {
          src
          id
        }
      }

      description

      location
      name
      password
      posts {
        postId
        image {
          src
        }
        chatId
      }
      profilePicture {
        src
      }
      backdrop {
        src
      }
      points {
        pointId
      }
      type
      userEmail
    }
  }
`;
const POINTS_QUERY = gql`
  query PointsInRadius($coordOfCenter: LocationInput!) {
    getPointsInRadius(coordOfCenter: $coordOfCenter) {
      pointId
      data {
        icon
        name
        desc
      }
      quadId
      location {
        lat
        lng
      }
    }
  }
`;
const IMAGES_QUERY = gql`
  query getAllImagesByUserPage($username: String!) {
    getAllImagesByUserPage(username: $username) {
      avatars {
        src
        id
        owner
      }
      posts {
        src
        id
        owner
      }
      map {
        src
        id
        owner
      }
    }
  }
`;
const AVATARS_QUERY = gql`
  query getAllAvatarsByUserPage($username: String!) {
    getAllAvatarsByUserPage(username: $username) {
      src
      id
      owner
    }
  }
`;
const POINTS_IN_RADIUS_QUERY = gql`
  query getPointsInRadius($coordOfCenter: LocationInput!) {
    getPointsInRadius(coordOfCenter: $coordOfCenter) {
      pointId
      data {
        icon
        name
        desc
      }
      quadId
      location {
        lat
        lng
      }
    }
  }
`;
const USER_UPDATE_MUTATION = gql`
  query UpdateUserAndImage($user: UserEditInput!) {
    updateUserAndImage(user: $user) {
      username
      location
      userEmail
      profilePicture {
        src
        id
      }
      backdrop {
        src
        id
      }
      description
    }
  }
`;
const IMAGE_SRC_QUERY = gql`
  query getImageById($id: String!) {
    getImageByImageId(id: $id) {
      src
      id
    }
  }
`;
const POINT_IMAGE_QUERY = gql`
  query getPointImageByPoint($pointId: String!, $quadId: String!) {
    getPointImageByPointId(pointId: $pointId, quadId: $quadId) {
      src
      id
    }
  }
`;
const NEWS_QUERY = gql`
  query getNews($city: String!, $country: String!) {
    getNewsByGeo(city: $city, country: $country) {
      events {
        pointId
      }
      posts {
        postId
      }
    }
  }
`;
const REGISTER_USER = gql`
  query RegisterUser(
    $username: String!
    $password: String!
    $userEmail: String!
  ) {
    register(username: $username, password: $password, userEmail: $userEmail) {
      username
      location
      userEmail
      description
    }
  }
`;
const OPEN_POST_AND_CHAT = gql`
  mutation OpenPostAndChat($username: String!, $post: PostInput!) {
    openPostAndChatByUserAndPostId(username: $username, post: $post) {
      chatId
    }
  }
`;
const CREATE_POINT = gql`
  query CreatePoint(
    $username: String!
    $location: LocationInput!
    $geocode: String!
  ) {
    createPointByUsername(
      username: $username
      location: $location
      geocode: $geocode
    ) {
      user {
        username
      }
      point {
        pointId
      }
    }
  }
`;
const UPDATE_POINT = gql`
  query UpdatePoint($point: PointInput!, $quadId: String, $imageSrc: String) {
    updatePoint(point: $point, quadId: $quadId, imageSrc: $imageSrc) {
      pointId
      data {
        icon
        name
        desc
      }
      quadId
      location {
        lat
        lng
      }
    }
  }
`;
const POINT_IMAGE_BY_USER_QUERY = gql`
  query getPointImageByUser($username: String!) {
    getMapImagesByUserPage(username: $username) {
      src

      id
    }
  }
`;

export {
  USER_QUERY,
  POINTS_QUERY,
  IMAGES_QUERY,
  AVATARS_QUERY,
  IMAGE_SRC_QUERY,
  POINT_IMAGE_QUERY,
  NEWS_QUERY,
  POINT_IMAGE_BY_USER_QUERY,
  USER_UPDATE_MUTATION,
  POINTS_IN_RADIUS_QUERY,
  UPDATE_POINT,
  CREATE_POINT,
  REGISTER_USER,
  OPEN_POST_AND_CHAT,
};
