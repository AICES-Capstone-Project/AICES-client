// src/components/Layout/system/systemTheme.ts
export const GOLD = {
  primary: "#F5C400",
  hover: "#E1B800",
  active: "#CFA800",
  cream: "#FFFBE6",
  cream2: "#FFF7D6",
  border: "#FFE58F",
  textOnCream: "#614700",
  shadow: "rgba(245,196,0,0.18)",
} as const;

export const systemAntdTheme = {
  token: {
    colorPrimary: GOLD.primary,
    colorLink: GOLD.primary,
    colorText: "#1F1F1F",
    colorBorder: "#F0F0F0",
    borderRadius: 10,
    controlOutline: "rgba(245,196,0,0.28)",
    controlItemBgActive: GOLD.cream,
  },
  components: {
    Menu: {
      itemSelectedBg: GOLD.cream,
      itemActiveBg: GOLD.cream,
      itemSelectedColor: GOLD.textOnCream,
      itemBorderRadius: 8,
    },
    Button: {
      colorPrimary: GOLD.primary,
      colorPrimaryHover: GOLD.hover,
      colorPrimaryActive: GOLD.active,
      defaultBorderColor: GOLD.border,
      defaultColor: GOLD.textOnCream,
      defaultHoverBorderColor: GOLD.hover,
      borderRadius: 10,
    },
    Tag: {
      defaultBg: GOLD.cream,
      defaultColor: GOLD.textOnCream,
      defaultBorderColor: GOLD.border,
      borderRadiusSM: 8,
    },
    Pagination: {
      itemActiveBg: GOLD.cream,
      itemInputBg: "#fff",
      colorPrimary: GOLD.primary,
    },
    Input: {
      activeBorderColor: GOLD.primary,
      hoverBorderColor: GOLD.primary,
      activeShadow: `0 0 0 2px rgba(245,196,0,0.25)`,
      borderRadius: 10,
    },
    Table: {
      headerBg: "#FAFAFA",
      rowHoverBg: GOLD.cream2,
      borderColor: "#F5F5F5",
      headerSplitColor: "#F0F0F0",
    },
    Tabs: {
      itemActiveColor: GOLD.textOnCream,
      inkBarColor: GOLD.primary,
    },
    Badge: {
      colorBgDefault: GOLD.cream,
      colorText: GOLD.textOnCream,
    },
  } as any,
} as const;
