module.exports = {
  extends: [
    "next/core-web-vitals",
    "next",
    "next/typescript"
  ],
  rules: {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "no-console": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
};
