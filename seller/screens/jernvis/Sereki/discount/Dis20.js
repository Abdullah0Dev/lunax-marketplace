import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
  Image,
  ScrollView
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export default function Dis20() {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [currency, setCurrency] = useState("$");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState([{ title: "", value: "" }]);
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [customCode, setCustomCode] = useState("");

  const [data, setData] = useState([]);

  const addSpec = () => setSpecs([...specs, { title: "", value: "" }]);
  const removeSpec = (index) => {
    if (specs.length === 1) return;
    const arr = [...specs];
    arr.splice(index, 1);
    setSpecs(arr);
  };
  const changeSpec = (text, index, key) => {
    const arr = [...specs];
    arr[index][key] = text;
    setSpecs(arr);
  };

  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true
    });
    if (!res.canceled) {
      const uris = res.assets.map(a => a.uri);
      setImages(prev => [...prev, ...uris].slice(0,4));
    }
  };

  const pickCover = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });
    if (!res.canceled) setCoverImage(res.assets[0].uri);
  };

  const removeImage = (uri) => setImages(prev => prev.filter(u => u !== uri));

  const clearForm = () => {
    setName("");
    setOriginalPrice("");
    setCurrency("$");
    setDescription("");
    setSpecs([{ title: "", value: "" }]);
    setImages([]);
    setCoverImage(null);
    setCustomCode("");
    setEditItem(null);
  };

  const getDiscountedPrice = () => {
    const num = parseFloat(originalPrice) || 0;
    return (num * 0.80).toFixed(3); // 40% discount
  };

  const handleSave = () => {
    if (name.trim() === "" || originalPrice.trim() === "") return;

    const discountedPrice = getDiscountedPrice();
    const newItem = {
      id: editItem ? editItem.id : Date.now().toString(),
      name,
      price: `${currency}${discountedPrice}`,
      description,
      specs,
      images,
      coverImage,
      code: customCode,
      date: new Date().toLocaleString(),
    };

    if (editItem) {
      setData(data.map(item => item.id === editItem.id ? newItem : item));
    } else {
      setData(prev => [newItem, ...prev]);
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }

    clearForm();
    setModalVisible(false);
  };

  const startEdit = (item) => {
    setEditItem(item);
    setName(item.name);
    const original = parseFloat(item.price.replace(currency,"")) / 0.6;
    setOriginalPrice(original.toString());
    setDescription(item.description);
    setSpecs(item.specs.length ? item.specs : [{ title: "", value: "" }]);
    setImages(item.images || []);
    setCoverImage(item.coverImage || null);
    setCustomCode(item.code || "");
    setModalVisible(true);
  };

  const confirmDelete = (id) => { setSelectedId(id); setDeleteModal(true); };
  const handleDelete = () => { setData(data.filter(item => item.id !== selectedId)); setDeleteModal(false); };

  return (
    <View style={styles.container}>
      <StatusBar />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
        <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/011/297/609/small/promotion-number-20-percent-3d-png.png' }} style={{ width: wp("20%"), height: hp("8%") }}/>
        <Text style={styles.uploadText}>Discount 20%</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => startEdit(item)}>
              <Text style={styles.itemText}>{item.name} - {item.price}</Text>
              {item.code ? (
                <Text style={{color:"#11a1a1",fontSize:12}}>Code: {item.code}</Text>
              ) : null}
              {item.coverImage && <Image source={{uri:item.coverImage}} style={{width:100,height:100,borderRadius:12,marginVertical:4}} />}
              {item.specs.map((s,i)=>(
                <Text key={i} style={styles.specText}>{s.title}: {s.value}</Text>
              ))}
              <Text style={styles.dateText}>{item.date}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editItem ? "Edit Item" : "Add New Detail"}</Text>

              <Text style={styles.label}>Product Name</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Enter name" style={styles.input}/>

              <View style={{marginVertical:10}}>
                <TouchableOpacity onPress={pickCover} style={{borderWidth:2,borderStyle:'dashed',borderRadius:16,padding:18,alignItems:'center',borderColor:'rgb(8, 98, 215)'}}>
                  <Text style={{color:'rgb(8, 98, 215)'}}>Pick Cover Image</Text>
                </TouchableOpacity>
                {coverImage && <Image source={{uri:coverImage}} style={{width:100,height:100,borderRadius:12,marginTop:8}} />}
              </View>

              <View style={{marginVertical:10}}>
                <TouchableOpacity onPress={pickImages} style={{borderWidth:2,borderStyle:'dashed',borderRadius:16,padding:18,alignItems:'center',borderColor:'#11a1a1'}}>
                  <Text style={{color:'#11a1a1'}}>Upload Images (max 4)</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:10}}>
                  {images.map((uri)=> (
                    <View key={uri} style={{marginRight:10,marginBottom:10}}>
                      <Image source={{uri}} style={{width:80,height:80,borderRadius:12}} />
                      <TouchableOpacity onPress={()=>removeImage(uri)} style={{position:'absolute',top:-6,right:-6,backgroundColor:'red',borderRadius:20,padding:4}}>
                        <Text style={{color:'#fff',fontSize:12}}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {specs.map((sp, i) => (
                <View key={i} style={{marginBottom:8}}>
                  <Text style={styles.label}>Specification {i+1}</Text>
                  <View style={{flexDirection:"row",alignItems:"center",gap:6}}>
                    <TextInput value={sp.title} onChangeText={(t)=>changeSpec(t,i,"title")} placeholder="Type (RAM)" style={[styles.input,{flex:1}]} />
                    <TextInput value={sp.value} onChangeText={(t)=>changeSpec(t,i,"value")} placeholder="Value (16GB)" style={[styles.input,{flex:1}]} />
                    <TouchableOpacity onPress={()=>removeSpec(i)}>
                      <Ionicons name="close-circle" size={26} color="#ff4d4d" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={{alignSelf:"center",marginVertical:10}} onPress={addSpec}>
                <Ionicons name="add-circle" size={36} color="#11a1a1" />
              </TouchableOpacity>

              <Text style={styles.label}>Original Price</Text>
              <View style={{flexDirection:"row",alignItems:"center",gap:10}}>
                <TextInput value={originalPrice} onChangeText={setOriginalPrice} placeholder="Enter price" keyboardType="numeric" style={[styles.input,{flex:1}]} />
                <TouchableOpacity onPress={()=>setCurrency("$")} style={{padding:12,borderWidth:1,borderRadius:12,borderColor: currency === "$" ? "#11a1a1" : "#ccc",marginTop:-10}}>
                  <Text>$</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setCurrency("IQD")} style={{padding:12,borderWidth:1,borderRadius:12,borderColor: currency === "IQD" ? "#11a1a1" : "#ccc",marginTop:-10}}>
                  <Text>IQD</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Price after 20% discount</Text>
              <TextInput value={`${getDiscountedPrice()} ${currency}`} editable={false} style={[styles.input,{backgroundColor:"#e0f7fa"}]} />

              <Text style={styles.label}>Code</Text>
              <TextInput value={customCode} onChangeText={setCustomCode} placeholder="Enter code..." style={styles.input}/>

              <Text style={styles.label}>Description</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Write details..." style={styles.input}/>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={()=>{setModalVisible(false);clearForm();}}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={deleteModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.deleteBox}>
            <Text style={styles.deleteTitle}>Delete this item?</Text>
            <View style={styles.deleteButtons}>
              <TouchableOpacity onPress={()=>setDeleteModal(false)}>
                <Text style={{color:"gray"}}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={{color:"red"}}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#f6f7fb",paddingTop:hp("6%")},
  backButton:{position:"absolute",top:50,left:20,backgroundColor:"white",padding:8,borderRadius:50,elevation:4},
  uploadButton:{alignSelf:"center",alignItems:"center",justifyContent:"center",width:wp("90%"),height:hp("20%"),borderRadius:24,backgroundColor:"white",borderWidth:2,borderColor:"#11a1a1",borderStyle:"dashed",gap:12,marginBottom:hp("2%"),marginTop:wp("12%"),elevation:6},
  uploadText:{color:"#11a1a1",fontSize:RFPercentage(3),fontWeight:"600"},
  itemBox:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"white",padding:18,borderRadius:18,marginBottom:14,elevation:4},
  itemText:{fontSize:RFPercentage(2.4),fontWeight:"600",color:"#222"},
  specText:{fontSize:12,color:"#555"},
  dateText:{fontSize:11,color:"gray"},
  modalOverlay:{flex:1,backgroundColor:"rgba(0,0,0,0.25)",justifyContent:"center",padding:20},
  modalBox:{backgroundColor:"white",borderRadius:26,padding:22,elevation:10},
  modalTitle:{fontSize:20,fontWeight:"700",marginBottom:18,textAlign:"center"},
  label:{marginBottom:4,fontWeight:"600",color:"#444"},
  input:{borderWidth:1.2,borderColor:"#e5e7eb",borderRadius:14,padding:14,marginBottom:12,backgroundColor:"#fafafa"},
  buttonRow:{flexDirection:"row",justifyContent:"space-between",marginTop:10},
  cancelButton:{flex:1,backgroundColor:"#eef0f4",paddingVertical:14,borderRadius:14,alignItems:"center",marginRight:10},
  saveButton:{flex:1,backgroundColor:"#11a1a1",paddingVertical:14,borderRadius:14,alignItems:"center"},
  cancelText:{color:"#555",fontWeight:"600"},
  saveText:{color:"white",fontWeight:"700"},
  deleteBox:{backgroundColor:"white",padding:24,borderRadius:20},
  deleteTitle:{textAlign:"center",marginBottom:18,fontSize:16,fontWeight:"600"},
  deleteButtons:{flexDirection:"row",justifyContent:"space-around"},
});
