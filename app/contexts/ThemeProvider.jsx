import { ConfigProvider } from "antd";

const themeValues = {
  borderRadius: 5,
  hoverColor: "#fd356e50",
  Button: {
    staticColor: "#fd356e",
  },
};

export const AntThemeProvider = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: themeValues.hoverColor,
        borderRadius: themeValues.borderRadius,
        fontFamily: "M PLUS Rounded 1c",
      },
      components: {
        Button: {
          colorPrimary: themeValues.Button.staticColor,
        },
        Input: {
          componentSize: "large",
        },
        Timeline: {
          dotBorderWidth: 5,
          dotBg: "#f5f5f5",
          tailWidth: 4,
        },
      },
    }}
  >
    {children}
  </ConfigProvider>
);
