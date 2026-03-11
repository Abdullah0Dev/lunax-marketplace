import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setFavorites,
  removeFromFavorite,
  removeAllFavorites,
} from "../../redux/reducers/favoriteReducer";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";

const FavoriteScreen = ({ navigation }) => {
  const favoriteList = useSelector((state) => state.favorites.favoriteList);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          dispatch(setFavorites(JSON.parse(storedFavorites)));
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setLoading(false); 
      }
    };
    loadFavorites();
  }, [dispatch]);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("favorites", JSON.stringify(favoriteList));
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }
    };
    saveFavorites();
  }, [favoriteList]);

  const handleRemoveFromFavorite = (item) => {
    dispatch(removeFromFavorite(item));
  };

  const handleRemoveAllFavorites = () => {
    dispatch(removeAllFavorites());
  };

  const handleNavigateToDetails = (item) => {
    navigation.navigate("Bnk", { item });
  };

  return (
    <View style={styles.centeredView}>
      <Text style={styles.headerText}>دلخۆازا تە</Text>

      {favoriteList.length > 0 && (
        <TouchableOpacity onPress={handleRemoveAllFavorites}>
          <Image
            source={require('../../assets/tr.webp')}
            style={styles.clearAllImage}
          />
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <FlatList
          data={[...favoriteList].reverse()}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleNavigateToDetails(item)}>
              <View style={styles.card}>
                <Image source={{ uri: item.wene }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.nav}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromFavorite(item)}
                >
                  <Image
                    source={require("../../assets/bookmarked.png")}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Image
             
              source={require('../../assets/m916.webp')}
              style={styles.emptyImage}
            />
          )}
        />
      )}
      <StatusBar backgroundColor="black" barStyle="light-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerText: {
    color: "black",
    fontSize: RFPercentage(4),
    textAlign: "center",
    marginTop: hp("7%"),
    fontFamily: "k24",
  },
  clearAllImage: {
    width: wp("10.7%"),
    height: hp("5%"),
    marginHorizontal: 5,
    
    position: "absolute",
    right: wp("5%"),
    top: hp("-4.6%"),
  },
  listContent: {
    top: hp("5%"),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  loader: {
    marginTop: hp("20%"),
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: "black",
    width: wp("44%"),
    height: hp("35%"),
    marginHorizontal: 10,
    overflow: "hidden",
  },
  cardImage: {
    width: wp("40%"),
    height: hp("30%"),
    marginHorizontal: 10,
    borderRadius: 10,
  },
  cardTitle: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
    marginVertical: 5,
    fontFamily: "k24",
  },
  removeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 8,
    borderRadius: 50,
  },
  bookmarkIcon: {
    width: 32,
    height: 32,
  },
  emptyImage: {
    width: wp("33.7%"),
    height: hp("16%"),
    alignSelf: "center",
    marginTop: hp("30%"),
  },
  
});

export default FavoriteScreen;
