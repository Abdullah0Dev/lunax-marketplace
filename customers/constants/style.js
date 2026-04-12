import { StyleSheet } from "react-native";

export const defaultStyles = StyleSheet.create({
    lineWithOr: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    dashLine: {
        flex: 1,
        height: 3,
        backgroundColor: "black",
        marginHorizontal: 10,
        opacity: 0.6,
        borderRadius: 50,
    },
    textstudio: {
        fontSize: 30,
        color: "black",
        fontFamily: "lor",
        textAlign: "center",
        fontWeight: "900",
    },
})