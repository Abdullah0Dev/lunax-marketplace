import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
export const isTablet = screenWidth >= 768;
export const categoriesData = [
  // Row 1
  [
    {
      id: 1,
      title: 'کومپیوتەر',
      image: require('../assets/images/m20.png'),
      screen: 'computer',  // English: computer
      palette: "palette1"
    },
    {
      id: 2,
      title: 'جلوبەرگ',
      image: require('../assets/images/m21.png'),
      screen: 'clothing',  // English: clothing
      palette: "palette2"
    },
    {
      id: 3,
      title: 'پێلاڤ',
      image: require('../assets/images/m22.webp'),
      screen: 'shoes',  // English: shoes
      palette: "palette3"
    },
    {
      id: 4,
      title: 'دروسکەر',
      image: require('../assets/images/m23.png'),
      screen: 'manufacturer',  // English: manufacturer
      palette: "palette4"
    },
    {
      id: 5,
      title: 'وەرزشی',
      image: require('../assets/images/m26.png'),
      screen: 'sports',  // English: sports
      palette: "palette5"
    },
  ],
  // Row 2
  [
    {
      id: 6,
      title: 'مارکێت',
      image: require('../assets/images/m24.webp'),
      screen: 'market',  // English: market
      palette: "palette1"
    },
    {
      id: 7,
      title: 'پانزینخانە',
      image: require('../assets/images/m25.png'),
      screen: 'gas-station',  // English: gas station
      palette: "palette4"
    },
    {
      id: 8,
      title: 'پەرگە',
      image: require('../assets/images/m27.webp'),
      screen: 'paper',  // English: paper
      palette: "palette2"
    },
    {
      id: 9,
      title: 'فروکەڤانی',
      image: require('../assets/images/m28.png'),
      screen: 'aviation',  // English: aviation
      palette: "palette2"
    },
    {
      id: 10,
      title: 'هوتێل',
      image: require('../assets/images/m29.webp'),
      screen: 'hotel',  // English: hotel
      palette: "palette5"
    },
  ],
  [
    {
      id: 11,
      title: 'پێشانگەهێن موبیلیاتا',
      image: require('../assets/images/m29.webp'),
      screen: 'showroom',  // English: Showroom
      palette: "palette3"
    },
    {
      id: 12,
      title: 'پێشانگەهێن موبایلا',
      image: require('../assets/images/m54.gif'),
      screen: 'phone',  // English: Showroom
      palette: "palette2"
    },
    {
      id: 13,
      title: 'پێشانگەهێن Tv سمارت',
      image: require('../assets/images/m60.png'),
      screen: 'smart-tv',  // English: Showroom
      palette: "palette1"
    },
    {
      id: 14,
      title: 'ستوديو',
      image: require('../assets/images/m61.png'),
      screen: 'studio',  // English: Showroom
      palette: "palette5"
    },
    {
      id: 15,
      title: 'جوانکاریێن ئافرەتان',
      image: require('../assets/images/m62.png'),
      screen: 'beauty-salon',  // English: Showroom
      palette: "palette2"
    },
    {
      id: 16,
      title: 'هۆڵێن شەهیانا',
      image: require('../assets/images/m63.png'),
      screen: 'wedding-hall',  // English: Showroom
      palette: "palette3"
    },
    {
      id: 17,
      title: 'کراسێن بیکا',
      image: require('../assets/images/m64.png'),
      screen: 'wedding-dress',  // English: Showroom
      palette: "palette2"
    },
    {
      id: 18,
      title: 'جيمينج',
      image: require('../assets/images/m65.png'),
      screen: 'gaming',  // English: Showroom
      palette: "palette3"
    },
    {
      id: 19,
      title: 'جیهانا زاروکا',
      image: require('../assets/images/m90.png'),
      screen: 'kids',  // English: Showroom
      palette: "palette4"
    },
    {
      id: 20,
      title: 'ترومبێل',
      image: require('../assets/images/m108.png'),
      screen: 'cars',  // English: Showroom
      palette: "palette2"
    },
    {
      id: 21,
      title: 'ئەرد و خانی',
      image: require('../assets/images/m106.png'),
      screen: 'homes',  // English: Showroom
      palette: "palette5"
    },
    {
      id: 22,
      title: 'جیهانا دەمژمێرا',
      image: require('../assets/images/m102.png'),
      screen: 'watches',  // English: Showroom
      palette: "palette1"
    },
    {
      id: 23,
      title: 'ناف مالی',
      image: require('../assets/images/m910.webp'),
      screen: 'living',  // English: Showroom
      palette: "palette2"
    },

  ]
];
export const storeData = [
  {
    id: 1,
    title: "Laptop 1",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 2,
    title: "Laptop 2",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 3,
    title: "Laptop 3",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 4,
    title: "Laptop 4",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 5,
    title: "Laptop 5",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 6,
    title: "Laptop 6",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 7,
    title: "Laptop 7",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 8,
    title: "Laptop 8",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 9,
    title: "Laptop 9",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
  {
    id: 10,
    title: "Laptop 10",
    img: require("../assets/images/m600.jpg"),
    img1: require("../assets/images/m202.png"),
  },
];

export const adImages = [
  "https://live.staticflickr.com/1179/582854192_6135ac445e_b.jpg",
  "https://hips.hearstapps.com/hmg-prod/images/apple-iphone-17-group-001-68cacd4eb0920.jpg",
]