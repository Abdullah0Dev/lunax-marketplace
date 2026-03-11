import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Serekij from "../screens/jernvis/Sereki/Serekij";

///////////////////////////////////////////////
import Rellsrek from "../screens/jernvis/Rellsrek/Rellsrek";
import Homelaptop from "../screens/jernvis/Homepage/Laptop/Homelaptop";
import Homelaptop1 from "../screens/jernvis/Homepage/Laptop/Homelaptop1";
import HomelaptopRellsrek from "../screens/jernvis/Homepage/Laptop/HomelaptopRellsrek";
import Homelaptopdetails from "../screens/jernvis/Homepage/Laptop/Homelaptopdetails";
import Homemarket from "../screens/jernvis/Homepage/Market/Homemarket";
import HomemarketRellsrek from "../screens/jernvis/Homepage/Market/HomemarketRellsrek";
import Homemarketdetails from "../screens/jernvis/Homepage/Market/Homemarketdetails";
import Homemarket1 from "../screens/jernvis/Homepage/Market/Homemarket1";
import HomeClothes from "../screens/jernvis/Homepage/clothes/HomeClothes";
import HomeClothesRellsrek from "../screens/jernvis/Homepage/clothes/HomeClothesRellsrek";
import HomeClothes1 from "../screens/jernvis/Homepage/clothes/HomeClothes1";
import HomeClothesdetails from "../screens/jernvis/Homepage/clothes/HomeClothesdetails";
import HomeshoesRellsrek from "../screens/jernvis/Homepage/shoes/HomeshoesRellsrek";
import Homeshoes from "../screens/jernvis/Homepage/shoes/Homeshoes";
import Homeshoes1 from "../screens/jernvis/Homepage/shoes/Homeshoes1";
import Homeshoesdetails from "../screens/jernvis/Homepage/shoes/Homeshoesdetails";
import Homeindustry from "../screens/jernvis/Homepage/industry/Homeindustry";
import HomeindustryRellsrek from "../screens/jernvis/Homepage/industry/HomeindustryRellsrek";
import Homeindustry1 from "../screens/jernvis/Homepage/industry/Homeindustry1";
import Homeindustrydetails from "../screens/jernvis/Homepage/industry/Homeindustrydetails";
import Homesport from "../screens/jernvis/Homepage/clothessport/Homesport";
import HomesportRellsrek from "../screens/jernvis/Homepage/clothessport/HomesportRellsrek";
import Homesport1 from "../screens/jernvis/Homepage/clothessport/Homesport1";
import Homesportdetails from "../screens/jernvis/Homepage/clothessport/Homesportdetails";
import Homeoil from "../screens/jernvis/Homepage/oil/Homeoil";
import Homeoil1 from "../screens/jernvis/Homepage/oil/Homeoil1";
import HomeoilRellsrek from "../screens/jernvis/Homepage/oil/HomeoilRellsrek";
import Homeoildetails from "../screens/jernvis/Homepage/oil/Homeoildetails";
import Homepaper from "../screens/jernvis/Homepage/paper/Homepaper";
import Homepaper1 from "../screens/jernvis/Homepage/paper/Homepaper1";
import Homepaperdetails from "../screens/jernvis/Homepage/paper/Homepaperdetails";
import HomepaperRellsrek from "../screens/jernvis/Homepage/paper/HomepaperRellsrek";
import Homefly from "../screens/jernvis/Homepage/fly/Homefly";
import Homefly1 from "../screens/jernvis/Homepage/fly/Homefly1";
import HomeflyRellsrek from "../screens/jernvis/Homepage/fly/HomeflyRellsrek";
import Homeflydetails from "../screens/jernvis/Homepage/fly/Homeflydetails";
import Homehotel from "../screens/jernvis/Homepage/hotel/Homehotel";
import Homehoteldetails from "../screens/jernvis/Homepage/hotel/Homehoteldetails";
import HomehotelRellsrek from "../screens/jernvis/Homepage/hotel/HomehotelRellsrek";
import Homehotel1 from "../screens/jernvis/Homepage/hotel/Homehotel1";
import Homemobilyat from "../screens/jernvis/Homepage/mobilyat/Homemobilyat";
import Homemobilyat1 from "../screens/jernvis/Homepage/mobilyat/Homemobilyat1";
import HomemobilyatRellsrek from "../screens/jernvis/Homepage/mobilyat/HomemobilyatRellsrek";
import Homemobilyatdetails from "../screens/jernvis/Homepage/mobilyat/Homemobilyatdetails";
import Homephone from "../screens/jernvis/Homepage/phone/Homephone";
import Homephone1 from "../screens/jernvis/Homepage/phone/Homephone1";
import HomephoneRellsrek from "../screens/jernvis/Homepage/phone/HomephoneRellsrek";
import Homephonedetails from "../screens/jernvis/Homepage/phone/Homephonedetails";
import Hometv from "../screens/jernvis/Homepage/tv/Hometv";
import Hometv1 from "../screens/jernvis/Homepage/tv/Hometv1";
import HometvRellsrek from "../screens/jernvis/Homepage/tv/HometvRellsrek";
import Hometvdetails from "../screens/jernvis/Homepage/tv/Hometvdetails";
import Homestudio from "../screens/jernvis/Homepage/studio/Homestudio";
import Homestudio1 from "../screens/jernvis/Homepage/studio/Homestudio1";
import HomestudioRellsrek from "../screens/jernvis/Homepage/studio/HomestudioRellsrek";
import Homestudiodetails from "../screens/jernvis/Homepage/studio/Homestudiodetails";
import Homesalon from "../screens/jernvis/Homepage/salon/Homesalon";
import Homesalon1 from "../screens/jernvis/Homepage/salon/Homesalon1";
import HomesalonRellsrek from "../screens/jernvis/Homepage/salon/HomesalonRellsrek";
import Homesalondetails from "../screens/jernvis/Homepage/salon/Homesalondetails";
import Homeholl from "../screens/jernvis/Homepage/holl/Homeholl";
import Homeholl1 from "../screens/jernvis/Homepage/holl/Homeholl1";
import Homeholldetails from "../screens/jernvis/Homepage/holl/Homeholldetails";
import HomehollRellsrek from "../screens/jernvis/Homepage/holl/HomehollRellsrek";
import Homedress from "../screens/jernvis/Homepage/dress/Homedress";
import Homedress1 from "../screens/jernvis/Homepage/dress/Homedress1";
import HomedressRellsrek from "../screens/jernvis/Homepage/dress/HomedressRellsrek";
import Homedressdetails from "../screens/jernvis/Homepage/dress/Homedressdetails";
import Homegaming from "../screens/jernvis/Homepage/gaming/Homegaming";
import Homegaming1 from "../screens/jernvis/Homepage/gaming/Homegaming1";
import HomegamingRellsrek from "../screens/jernvis/Homepage/gaming/HomegamingRellsrek";
import Homegamingdetails from "../screens/jernvis/Homepage/gaming/Homegamingdetails";
import Homebaby from "../screens/jernvis/Homepage/baby/Homebaby";
import Homebaby1 from "../screens/jernvis/Homepage/baby/Homebaby1";
import HomebabyRellsrek from "../screens/jernvis/Homepage/baby/HomebabyRellsrek";
import Homebabydetails from "../screens/jernvis/Homepage/baby/Homebabydetails";
import Homecar from "../screens/jernvis/Homepage/car/Homecar";
import Homecar1 from "../screens/jernvis/Homepage/car/Homecar1";
import HomecarRellsrek from "../screens/jernvis/Homepage/car/HomecarRellsrek";
import Homecardetails from "../screens/jernvis/Homepage/car/Homecardetails";
import Homehouse from "../screens/jernvis/Homepage/house/Homehouse";
import Homehouse1 from "../screens/jernvis/Homepage/house/Homehouse1";
import HomehouseRellsrek from "../screens/jernvis/Homepage/house/HomehouseRellsrek";
import Homehousedetails from "../screens/jernvis/Homepage/house/Homehousedetails";
import Homewatch from "../screens/jernvis/Homepage/watch/Homewatch";
import Homewatch1 from "../screens/jernvis/Homepage/watch/Homewatch1";
import HomewatchRellsrek from "../screens/jernvis/Homepage/watch/HomewatchRellsrek";
import Homewatchdetails from "../screens/jernvis/Homepage/watch/Homewatchdetails";
import Homehome from "../screens/jernvis/Homepage/homehome/Homehome";
import Homehome1 from "../screens/jernvis/Homepage/homehome/Homehome1";
import HomehomeRellsrek from "../screens/jernvis/Homepage/homehome/HomehomeRellsrek";
import Homehomedetails from "../screens/jernvis/Homepage/homehome/Homehomedetails";
import Search from "../screens/jernvis/Homepage/search/Search";
const Stack = createNativeStackNavigator();

export const StackNavigator1 = () => (

    <Stack.Navigator>
      <Stack.Screen
        name="Serekij"
        component={Serekij}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
      <Stack.Screen
        name="Rellsrek"
        component={Rellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="Homelaptop"
        component={Homelaptop}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

      <Stack.Screen
        name="Homelaptop1"
        component={Homelaptop1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

 <Stack.Screen
        name="HomelaptopRellsrek"
        component={HomelaptopRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
 <Stack.Screen
        name="Homelaptopdetails"
        component={Homelaptopdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
 <Stack.Screen
        name="Homemarket"
        component={Homemarket}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
 <Stack.Screen
        name="Homemarket1"
        component={Homemarket1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="HomemarketRellsrek"
        component={HomemarketRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="Homemarketdetails"
        component={Homemarketdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

 <Stack.Screen
        name="HomeClothesdetails"
        component={HomeClothesdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="HomeClothes"
        component={HomeClothes}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
  <Stack.Screen
        name="HomeClothes1"
        component={HomeClothes1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="HomeClothesRellsrek"
        component={HomeClothesRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
 <Stack.Screen
        name="HomeshoesRellsrek"
        component={HomeshoesRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="Homeshoes"
        component={Homeshoes}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="Homeshoes1"
        component={Homeshoes1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

 <Stack.Screen
        name="Homeshoesdetails"
        component={Homeshoesdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
 <Stack.Screen
        name="Homeindustry"
        component={Homeindustry}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="Homeindustry1"
        component={Homeindustry1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="HomeindustryRellsrek"
        component={HomeindustryRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
            <Stack.Screen
        name="Homeindustrydetails"
        component={Homeindustrydetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
              <Stack.Screen
        name="Homesport"
        component={Homesport}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
              <Stack.Screen
        name="Homesport1"
        component={Homesport1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="HomesportRellsrek"
        component={HomesportRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
             <Stack.Screen
        name="Homesportdetails"
        component={Homesportdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="Homeoil"
        component={Homeoil}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="Homeoil1"
        component={Homeoil1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
   <Stack.Screen
        name="HomeoilRellsrek"
        component={HomeoilRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="Homeoildetails"
        component={Homeoildetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
   <Stack.Screen
        name="Homepaper"
        component={Homepaper}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
 <Stack.Screen
        name="Homepaper1"
        component={Homepaper1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="Homepaperdetails"
        component={Homepaperdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="HomepaperRellsrek"
        component={HomepaperRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
 <Stack.Screen
        name="Homefly"
        component={Homefly}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="Homefly1"
        component={Homefly1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="HomeflyRellsrek"
        component={HomeflyRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
       <Stack.Screen
        name="Homeflydetails"
        component={Homeflydetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
  <Stack.Screen
        name="Homehotel"
        component={Homehotel}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
        <Stack.Screen
        name="Homehotel1"
        component={Homehotel1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
        <Stack.Screen
        name="Homehoteldetails"
        component={Homehoteldetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
        <Stack.Screen
        name="HomehotelRellsrek"
        component={HomehotelRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

    <Stack.Screen
        name="Homemobilyat"
        component={Homemobilyat}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="Homemobilyat1"
        component={Homemobilyat1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="HomemobilyatRellsrek"
        component={HomemobilyatRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="Homemobilyatdetails"
        component={Homemobilyatdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
   <Stack.Screen
        name="Homephone"
        component={Homephone}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="Homephone1"
        component={Homephone1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="HomephoneRellsrek"
        component={HomephoneRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="Homephonedetails"
        component={Homephonedetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
   <Stack.Screen
        name="Hometv"
        component={Hometv}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
   <Stack.Screen
        name="Hometv1"
        component={Hometv1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="HometvRellsrek"
        component={HometvRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="Hometvdetails"
        component={Hometvdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="Homestudio"
        component={Homestudio}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="Homestudio1"
        component={Homestudio1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="HomestudioRellsrek"
        component={HomestudioRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
          <Stack.Screen
        name="Homestudiodetails"
        component={Homestudiodetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="Homesalon"
        component={Homesalon}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="Homesalon1"
        component={Homesalon1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="HomesalonRellsrek"
        component={HomesalonRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="Homesalondetails"
        component={Homesalondetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="Homeholl"
        component={Homeholl}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
   <Stack.Screen
        name="Homeholl1"
        component={Homeholl1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="Homeholldetails"
        component={Homeholldetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
         <Stack.Screen
        name="HomehollRellsrek"
        component={HomehollRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

      <Stack.Screen
        name="Homedress"
        component={Homedress}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
     <Stack.Screen
        name="Homedress1"
        component={Homedress1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="HomedressRellsrek"
        component={HomedressRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="Homedressdetails"
        component={Homedressdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="Homegaming"
        component={Homegaming}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

           <Stack.Screen
        name="Homegaming1"
        component={Homegaming1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
           <Stack.Screen
        name="HomegamingRellsrek"
        component={HomegamingRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                 <Stack.Screen
        name="Homegamingdetails"
        component={Homegamingdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                <Stack.Screen
        name="Homebaby"
        component={Homebaby}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
            <Stack.Screen
        name="Homebaby1"
        component={Homebaby1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                  <Stack.Screen
        name="HomebabyRellsrek"
        component={HomebabyRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                  <Stack.Screen
        name="Homebabydetails"
        component={Homebabydetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                <Stack.Screen
        name="Homecar"
        component={Homecar}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                <Stack.Screen
        name="Homecar1"
        component={Homecar1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                      <Stack.Screen
        name="HomecarRellsrek"
        component={HomecarRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                      <Stack.Screen
        name="Homecardetails"
        component={Homecardetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

<Stack.Screen
        name="Homehouse"
        component={Homehouse}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="Homehouse1"
        component={Homehouse1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="HomehouseRellsrek"
        component={HomehouseRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="Homehousedetails"
        component={Homehousedetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />

      <Stack.Screen
        name="Homewatch"
        component={Homewatch}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="Homewatch1"
        component={Homewatch1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
            <Stack.Screen
        name="HomewatchRellsrek"
        component={HomewatchRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
            <Stack.Screen
        name="Homewatchdetails"
        component={Homewatchdetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
            <Stack.Screen
        name="Homehome"
        component={Homehome}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                  <Stack.Screen
        name="Homehome1"
        component={Homehome1}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                  <Stack.Screen
        name="HomehomeRellsrek"
        component={HomehomeRellsrek}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
                  <Stack.Screen
        name="Homehomedetails"
        component={Homehomedetails}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />
               <Stack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          presentation: "containedModal",
        }}
      />











      
    </Stack.Navigator>
  
);