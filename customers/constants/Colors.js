const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

// Define multiple gradient palettes (each is a complete set)
const GRADIENT_PALETTES = [
  {
    name: 'palette1',
    colors: [
      ['#33691e', '#9ccc65'], // lime green
      ['#bf360c', '#ff7043'], // deep orange
      ['#006064', '#4dd0e1'], // cyan
      ['#311b92', '#9575cd'], // deep purple
      ['#827717', '#d4e157'], // yellow-green
      ['#ff3d00', '#ff9100'], // orange fire
      ['#1a237e', '#3949ab'], // indigo
      ['#004d40', '#26a69a'], // teal
      ['#4a148c', '#7b1fa2'], // purple
      ['#263238', '#546e7a'], // blue grey
      ['#880e4f', '#d81b60'], // pink
      ['#0d47a1', '#1976d2'], // blue
      ['#1b5e20', '#66bb6a'], // green
      ['#e65100', '#ffb74d'], // orange soft
      ['#3e2723', '#8d6e63'], // brown
      ['#212121', '#616161'], // dark grey
      ['#01579b', '#4fc3f7'], // sky blue
      ['#004d40', '#80cbc4'], // mint
      ['#37474f', '#90a4ae'], // slate
      ['#b71c1c', '#ef5350'], // red
      ['#004d40', '#80cbc4'], // mint
    ]
  },
  {
    name: 'palette2',
    colors: [
      ['#4a148c', '#7b1fa2'], // purple
      ['#263238', '#546e7a'], // blue grey
      ['#880e4f', '#d81b60'], // pink
      ['#0d47a1', '#1976d2'], // blue
      ['#33691e', '#9ccc65'], // lime green
      ['#bf360c', '#ff7043'], // deep orange
      ['#006064', '#4dd0e1'], // cyan
      ['#311b92', '#9575cd'], // deep purple
      ['#827717', '#d4e157'], // yellow-green
      ['#ff3d00', '#ff9100'], // orange fire
      ['#1a237e', '#3949ab'], // indigo
      ['#004d40', '#26a69a'], // teal
      ['#1b5e20', '#66bb6a'], // green
      ['#e65100', '#ffb74d'], // orange soft
      ['#3e2723', '#8d6e63'], // brown
      ['#212121', '#616161'], // dark grey
      ['#01579b', '#4fc3f7'], // sky blue
      ['#004d40', '#80cbc4'], // mint
      ['#37474f', '#90a4ae'], // slate
      ['#b71c1c', '#ef5350'], // red
      ['#004d40', '#80cbc4'], // mint
    ]
  },
  {
    name: 'palette3',
    colors: [
      ['#ff3d00', '#ff9100'], // orange fire
      ['#1a237e', '#3949ab'], // indigo
      ['#004d40', '#26a69a'], // teal
      ['#4a148c', '#7b1fa2'], // purple
      ['#263238', '#546e7a'], // blue grey
      ['#880e4f', '#d81b60'], // pink
      ['#0d47a1', '#1976d2'], // blue
      ['#1b5e20', '#66bb6a'], // green
      ['#e65100', '#ffb74d'], // orange soft
      ['#3e2723', '#8d6e63'], // brown
      ['#212121', '#616161'], // dark grey
      ['#01579b', '#4fc3f7'], // sky blue
      ['#33691e', '#9ccc65'], // lime green
      ['#bf360c', '#ff7043'], // deep orange
      ['#006064', '#4dd0e1'], // cyan
      ['#311b92', '#9575cd'], // deep purple
      ['#827717', '#d4e157'], // yellow-green
      ['#37474f', '#90a4ae'], // slate
      ['#b71c1c', '#ef5350'], // red
      ['#004d40', '#80cbc4'], // mint
    ]
  },
  {
    name: 'palette4',
    colors: [
      ['#006064', '#4dd0e1'], // cyan
      ['#311b92', '#9575cd'], // deep purple
      ['#827717', '#d4e157'], // yellow-green
      ['#ff3d00', '#ff9100'], // orange fire
      ['#1a237e', '#3949ab'], // indigo
      ['#004d40', '#26a69a'], // teal
      ['#3e2723', '#8d6e63'], // brown
      ['#212121', '#616161'], // dark grey
      ['#01579b', '#4fc3f7'], // sky blue
      ['#004d40', '#80cbc4'], // mint
      ['#37474f', '#90a4ae'], // slate
      ['#b71c1c', '#ef5350'], // red
      ['#004d40', '#80cbc4'], // mint
      ['#4a148c', '#7b1fa2'], // purple
      ['#263238', '#546e7a'], // blue grey
      ['#880e4f', '#d81b60'], // pink
      ['#0d47a1', '#1976d2'], // blue
      ['#33691e', '#9ccc65'], // lime green
      ['#bf360c', '#ff7043'], // deep orange
      ['#1b5e20', '#66bb6a'], // green
      ['#e65100', '#ffb74d'], // orange soft
    ]
  },
  {
    name: 'palette5',
    colors: [
      ['#880e4f', '#d81b60'], // pink
      ['#0d47a1', '#1976d2'], // blue
      ['#33691e', '#9ccc65'], // lime green
      ['#bf360c', '#ff7043'], // deep orange
      ['#006064', '#4dd0e1'], // cyan
      ['#311b92', '#9575cd'], // deep purple
      ['#827717', '#d4e157'], // yellow-green
      ['#ff3d00', '#ff9100'], // orange fire
      ['#3e2723', '#8d6e63'], // brown
      ['#212121', '#616161'], // dark grey
      ['#01579b', '#4fc3f7'], // sky blue
      ['#004d40', '#80cbc4'], // mint
      ['#37474f', '#90a4ae'], // slate
      ['#b71c1c', '#ef5350'], // red
      ['#004d40', '#80cbc4'], // mint
      ['#4a148c', '#7b1fa2'], // purple
      ['#263238', '#546e7a'], // blue grey
      ['#1a237e', '#3949ab'], // indigo
      ['#004d40', '#26a69a'], // teal
      ['#1b5e20', '#66bb6a'], // green
      ['#e65100', '#ffb74d'], // orange soft
    ]
  }
];

// Function to get a random palette
export const getRandomPalette = () => {
  const randomIndex = Math.floor(Math.random() * GRADIENT_PALETTES.length);
  return GRADIENT_PALETTES[randomIndex];
};

// Function to get a palette by name (if you want to save user preference)
export const getPaletteByName = (name) => {
  return GRADIENT_PALETTES.find(p => p.name === name)?.colors || GRADIENT_PALETTES[0]?.colors;
};
export const getRandomGradient = () => {
  const availableGradients = getRandomPalette().colors;
  const randomNumber = Math.floor(Math.random() * availableGradients.length);
  const randomGradient = availableGradients[randomNumber][0];
  console.log(randomGradient);
  return randomGradient
}