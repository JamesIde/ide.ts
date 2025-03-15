/** @type {import('tailwindcss').Config} */
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      playfair: ["Playfair Display"],
      nova: ["Proxima Nova"],
    },
    colors: {
      "rich-indigo": "#6060FF",
    },
  },
};
export const plugins = [
  require("@tailwindcss/typography"),
  // ...
];
