export interface ThemeColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  offPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  backdrop: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  statusColors: {
    Present: string;
    Late: string;
    Absent: string;
    "Left Early": string;
    "No Clock Out": string;
    Pending: string;
    Approved: string;
    Rejected: string;
    Canceled: string;
    DRAFT: string;
    CONFIRMED: string;
    CANCELED: string;
    PAID: string;
    NEW: string;
    WON: string;
    CANCEL: string;
    LOSE: string;
    ONGOING: string;
    OPEN: string;
  };
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#9e0b0f",
    onPrimary: "#FFFFFF",
    primaryContainer: "#F4C4C5",
    onPrimaryContainer: "#600608",
    offPrimaryContainer: "#E0E0E0",
    secondary: "#5E2129",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#D69399",
    onSecondaryContainer: "#3C1116",
    tertiary: "#B3475B",
    onTertiary: "#FFFFFF",
    background: "#F5F5F5",
    onBackground: "#2E2E2E",
    surface: "#FFFFFF",
    onSurface: "#3D1C20",
    surfaceVariant: "#E0E0E0",
    onSurfaceVariant: "#5A2D32",
    outline: "#7A3E42",
    outlineVariant: "#BFA5A7",
    inverseSurface: "#2C2C2C",
    inverseOnSurface: "#F5F5F5",
    inversePrimary: "#F4C4C5",
    elevation: {
      level0: "white",
      level1: "#F8F8F8",
      level2: "#F2F2F2",
      level3: "#ECECEC",
      level4: "#E6E6E6",
      level5: "#DFDFDF",
    },
    surfaceDisabled: "rgba(46, 46, 46, 0.12)",
    onSurfaceDisabled: "rgba(46, 46, 46, 0.38)",
    backdrop: "rgba(28, 28, 28, 0.5)",
    card: "#FFFFFF",
    text: "#2E2E2E",
    border: "#CCCCCC",
    notification: "#E63946",
    statusColors: {
      Present: "#4caf50",
      Late: "#ff9800",
      Absent: "#f44336",
      "Left Early": "#2196f3",
      "No Clock Out": "#607d8b",
      Pending: "#2196f3",
      Approved: "#4caf50",
      Rejected: "#ff7043",
      Canceled: "#f44336",
      DRAFT: "#2196f3",
      CONFIRMED: "#3ddad7",
      CANCELED: "#f44336",
      PAID: "#4caf50",
      NEW: "#2196f3",
      WON: "#4CAF50",
      CANCEL: "#F44336",
      LOSE: "#9E9E9E",
      ONGOING: "#F5B716",
      OPEN: "#03A9F4",
      OUTSTANDING: "#ff9800",
      "IN PROGRESS": "#2196f3",
    },
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    ...lightTheme.colors,
    background: "#16171d",
    onBackground: "#f3f4f6",
    surface: "#1f2028",
    onSurface: "#f3f4f6",
    surfaceVariant: "#2e303a",
    onSurfaceVariant: "#f3f4f6",
    border: "#2e303a",
    card: "#1f2028",
    text: "#9ca3af",
  },
};

export const theme = lightTheme;
