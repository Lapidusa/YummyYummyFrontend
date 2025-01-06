module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#FFBF9B',
        'background-light': '#FFF7EE',
        'background-dark-light': '#F6F6F6',
        'background-secondary': '#F4F1EE',
        'btn-background-light': '#FFFAF4',
        'main-contrast': '#FE5F00',
        'light': 'white',
        'dark': 'black',
        'font-secondary': '#AEAEAE',
        'font-secondary-alt': '#7B7B7B',
        'select-no-active': '#ECECEC',
        'search': '#F9F9F9',
        'no-active-dark': '#888888',
        'no-active-light': '#EDEDED',
        'no-active-light-alt': '#FAFAFA',
        'green': '#1BB486',
        'green-light': '#EAF8F4',
        'red': '#FF544A',
        'red-light': '#FFF0EF',
        'yellow': '#917C12',
        'yellow-light': '#FFF3B4',
      },
    },
  },
  plugins: [],
}