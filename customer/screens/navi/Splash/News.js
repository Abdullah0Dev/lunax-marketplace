import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const questions = [

  { question: "1- Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
  { question: "2- What is the deepest part of the ocean?", options: ["Mariana Trench", "Tonga Trench", "Puerto Rico Trench", "Java Trench"], answer: "Mariana Trench" },
  { question: "3- Which ocean is the smallest?", options: ["Atlantic", "Indian", "Arctic", "Southern"], answer: "Arctic" },
  { question: "4- Which ocean lies on the east coast of the United States?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], answer: "Atlantic" },
  { question: "5- What is the primary cause of ocean tides?", options: ["Sun", "Wind", "Moon", "Earth’s rotation"], answer: "Moon" },
  { question: "6- Which ocean is known for having the Bermuda Triangle?", options: ["Pacific", "Atlantic", "Indian", "Southern"], answer: "Atlantic" },
  { question: "7- What percentage of the Earth's surface is covered by oceans?", options: ["50%", "60%", "70%", "80%"], answer: "70%" },
  { question: "9- Which ocean is home to the Great Barrier Reef?", options: ["Indian", "Atlantic", "Southern", "Pacific"], answer: "Pacific" },
  { question: "10- Which ocean current is the strongest?", options: ["Gulf Stream", "Kuroshio Current", "Antarctic Circumpolar Current", "California Current"], answer: "Antarctic Circumpolar Current" },
  { question: "11- Which ocean surrounds Antarctica?", options: ["Atlantic", "Indian", "Southern", "Arctic"], answer: "Southern" },
  { question: "12- What type of water is found in oceans?", options: ["Freshwater", "Saltwater", "Brackish water", "Mineral water"], answer: "Saltwater" },
  { question: "13- What is the largest sea creature?", options: ["Great White Shark", "Blue Whale", "Giant Squid", "Orca"], answer: "Blue Whale" },
  { question: "14- What is the main component of sea salt?", options: ["Magnesium chloride", "Sodium chloride", "Calcium sulfate", "Potassium chloride"], answer: "Sodium chloride" },
  { question: "15- What is the movement of ocean water caused by wind called?", options: ["Currents", "Waves", "Tides", "Upwelling"], answer: "Waves" },
  { question: "16- What is the name of the phenomenon where warm water replaces cold water in the Pacific Ocean?", options: ["La Niña", "El Niño", "Tsunami", "Monsoon"], answer: "El Niño" },
  { question: "17- Which ocean has the most coral reefs?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: "Pacific" },


  { question: "18- Which is the tallest mountain in the world?", options: ["K2", "Mount Everest", "Denali", "Kilimanjaro"], answer: "Mount Everest" },
  { question: "19- Which continent is Mount Everest located on?", options: ["South America", "Africa", "Asia", "Europe"], answer: "Asia" },
  { question: "20- Which is the second highest mountain in the world?", options: ["Lhotse", "Makalu", "K2", "Denali"], answer: "K2" },
  { question: "21- What mountain range is Mount Everest part of?", options: ["Rocky Mountains", "Himalayas", "Andes", "Alps"], answer: "Himalayas" },
  { question: "22- Which mountain is known as the 'Roof of Africa'?", options: ["Mount Kenya", "Mount Kilimanjaro", "Table Mountain", "Drakensberg"], answer: "Mount Kilimanjaro" },
  { question: "23- Which mountain is considered the most dangerous to climb?", options: ["Everest", "K2", "Annapurna", "Denali"], answer: "Annapurna" },
  { question: "24- Which is the longest mountain range in the world?", options: ["Rocky Mountains", "Andes", "Himalayas", "Alps"], answer: "Andes" },
  { question: "25- Which US state is home to Denali?", options: ["Colorado", "California", "Alaska", "Montana"], answer: "Alaska" },
  { question: "26- What is the name of the famous Japanese mountain?", options: ["Mount Everest", "Mount Fuji", "Mount Etna", "Mount Kilimanjaro"], answer: "Mount Fuji" },
  { question: "27- Which mountain range is in Europe?", options: ["Himalayas", "Rocky Mountains", "Andes", "Alps"], answer: "Alps" },
  { question: "28- Which is the highest peak in the Alps?", options: ["Mont Blanc", "Matterhorn", "Zugspitze", "Dolomites"], answer: "Mont Blanc" },
  { question: "29- What do you call a mountain with a crater that can erupt?", options: ["Plateau", "Volcano", "Mesa", "Hill"], answer: "Volcano" },
  { question: "30- Which US mountain is known for its famous carved presidents?", options: ["Mount Rushmore", "Denali", "Grand Teton", "Mount St. Helens"], answer: "Mount Rushmore" },
  { question: "31- Which mountain range separates Europe from Asia?", options: ["Andes", "Alps", "Ural Mountains", "Appalachians"], answer: "Ural Mountains" },


  { question: "32- Which animal is commonly found in a zoo?", options: ["Elephant", "Dolphin", "Eagle", "Penguin"], answer: "Elephant" },
  { question: "33- Which of these animals is NOT typically found in a zoo?", options: ["Tiger", "Panda", "House Cat", "Giraffe"], answer: "House Cat" },
  { question: "34- Which animal is known for being the largest land mammal?", options: ["Giraffe", "Elephant", "Hippopotamus", "Rhino"], answer: "Elephant" },
  { question: "35- What is a baby lion called?", options: ["Cub", "Pup", "Kitten", "Calf"], answer: "Cub" },
  { question: "36- Which of these animals can fly?", options: ["Penguin", "Ostrich", "Eagle", "Emu"], answer: "Eagle" },
  { question: "37- What do you call a place where snakes are kept in a zoo?", options: ["Reptile House", "Snake Pit", "Serpentarium", "Terrarium"], answer: "Serpentarium" },
  { question: "38- Which zoo animal is known for its black and white fur?", options: ["Panda", "Zebra", "Skunk", "Tapir"], answer: "Panda" },
  { question: "39- Which animal is known as the ‘King of the Jungle’?", options: ["Tiger", "Lion", "Leopard", "Cheetah"], answer: "Lion" },
  { question: "40- What type of bear is commonly seen in zoos?", options: ["Grizzly Bear", "Panda Bear", "Polar Bear", "All of the above"], answer: "All of the above" },
  { question: "41- Which of these animals sleeps the most?", options: ["Lion", "Koala", "Elephant", "Giraffe"], answer: "Koala" },
  { question: "42- What is the name of a zoo that specializes in marine animals?", options: ["Aquarium", "Safari Park", "Wildlife Reserve", "Sanctuary"], answer: "Aquarium" },
  { question: "43- Which bird is known for its ability to mimic human speech?", options: ["Parrot", "Owl", "Peacock", "Hawk"], answer: "Parrot" },
  { question: "44- Which big cat is the fastest land animal?", options: ["Tiger", "Lion", "Cheetah", "Leopard"], answer: "Cheetah" },
];

console.log(questions);


export default function News({navigation}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [screen, setScreen] = useState("Home");

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setScreen("Result");
    }
  };

  return (

      <View style={styles.container}>

<TouchableOpacity onPress={() => navigation.goBack()}>
            <View>
              <FontAwesome6
                onPress={() => navigation.goBack()}
                name="angle-left"
                style={{
                  fontSize: RFPercentage(5),
                  color: "#fff",
                 right:wp('37%'),
                  marginTop: hp("-37%"),
                
                }}
              />
            </View>
          </TouchableOpacity>


        {screen === "Home" && (
          <>
            <Text style={styles.title}>44 Questions For You </Text>
            <TouchableOpacity style={styles.button} onPress={() => setScreen("Quiz")}>
              <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
          </>
        )}
        {screen === "Quiz" && (
          <>
           
            <Text style={styles.question}>{questions[currentQuestion].question}</Text>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity key={index} style={styles.option} onPress={() => handleAnswer(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
        {screen === "Result" && (
          <>
            <Text style={styles.title}>Your Score: {score}</Text>
            <TouchableOpacity style={styles.button} onPress={() => { setScreen("Home"); setScore(0); setCurrentQuestion(0); }}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
  title: { fontSize: 24, fontWeight: "bold", color: "white" },
  question: { fontSize: 20, marginBottom: 20, color: "white" },
  button: { backgroundColor: "#fff", padding: 13, marginTop: 22, borderRadius: 10 },
  goBackButton: { backgroundColor: "red", padding: 10, marginBottom: 20, borderRadius: 10 },
  buttonText: { color: "blavk", fontSize: 20 },
  option: { backgroundColor: "gray", padding: 20, margin: 15, width: "80%", alignItems: "center", borderRadius: 10 },
  optionText: { fontSize: 18, color: "white" },
});
