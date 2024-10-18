export const CLIENT_VERSION = "0.0.0"; //THE HARDCODED VERSION NUMBER NEEDS TO BE CHECKED WITH SERVER EVERY PUSH

export const devUrl = `http://default-main-1360184486.eu-central-1.elb.amazonaws.com:4000/`;

export interface routeItem {
  route: PAGE_NAVIGATION | null;
  displayString: string;
  icon?: string;
}
export enum PAGE_NAVIGATION {
  NEWS = "News",
  ADVERTISERS = "Advertisers",
  APPS = "Apps",
  PUBLISHERS = "Publishers",
  CAMPAIGN = "Campaigns",
  AGGREGATED = "Aggregated",
  DATACENTER = "Data Center",
  USERS = "Users",
  APPSFLYER = "Appsflyer",
  LOGS = "Logs",
  NETWORK = "Network",
  RAWDATA = "RawData",
  SETTINGS = "Settings",
  PASSWORDS = "Passwords",
  DOCUMENTS = "Documents",
  //DASHBOARD = 'Dashboard',
  AUTOSWITCH = "Autoswitch",
}

export const routes: routeItem[] = [
  {
    route: PAGE_NAVIGATION.NEWS,
    displayString: "News",
    icon: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />',
  },
  {
    route: null,
    displayString: "Dashboard",
    icon: `
	  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
	`,
  },
  {
    route: PAGE_NAVIGATION.ADVERTISERS,
    displayString: "Advertisers",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.PUBLISHERS,
    displayString: "Publishers",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.APPS,
    displayString: "Apps",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.CAMPAIGN,
    displayString: "Campaigns",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: null,
    displayString: "Selector",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: null,
    displayString: "Finance",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: null,
    displayString: "Tools",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.USERS,
    displayString: "Users",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.PASSWORDS,
    displayString: "Passwords",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.DOCUMENTS,
    displayString: "Documents",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.AGGREGATED,
    displayString: "Aggregated",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },

  {
    route: PAGE_NAVIGATION.NETWORK,
    displayString: "Network",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.RAWDATA,
    displayString: "RawData",
    icon: `
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    `,
  },
  {
    route: PAGE_NAVIGATION.AUTOSWITCH,
    displayString: "Autoswitch",
    icon: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />',
  },
];

export enum endpoints {
  USER = "user",
  LIVESTREAMS = "livestreams",
  LIVESTREAMCREATE = "livestreams/createStream",
  REGISTER = "register",
  LOGIN = "users/login",
  ADVERTISER = "advertiser",
  CAMPAIGN = "campaign",
  PUBLISHER = "publisher",
  NEWS = "news",
  NEWS_I = "news/image",
  LOGS = "logs",
  SETTINGS = "settings",
  REPORTS = "reports",
  APPSFLYER = "appsflyer",
  SAVE = "appsflyer/save",
  APP = "app",
  P360APP = "app/p360",
  REMOVEP360APP = "app/p360/remove",
  ICONS = "icons",
  APPUPDATE = "app/update",
  PASSWORD = "password",
  PRESET = "preset",
  RAWDATA = "rawdata",
  NETWORK = "network",
  NETWORK_U = "network/update",
  APPSFLYER_U = "appsflyer/update",
  STORAGE = "storage",
  UPDATE = "update",
  FORGOTPASSWORD = "forgotpwd",
  UNIQUE_CARD = "unique_card",
  PASSWORDS = "passwords",
  SHOW_PASSWORD = "showpasswords",
  INVALID = "invalid",
  DOCUMENTS = "documents",
  DASHBOARD = "dashboard",
  APPSFLYER_ACCOUNTS = "appsflyeraccounts",
  CAMPAIGNHISTORY = "campaignhistory",
  AVATAR = "avatar",
  FINANCE = "finance",
  AUTOSWITCH = "autoswitch",
  ADJUST = "adjust",
  VERSION = "version",
  GETPROFILEDATA = "profile",
  PROFILEDATA_U = "profile/update",
}
