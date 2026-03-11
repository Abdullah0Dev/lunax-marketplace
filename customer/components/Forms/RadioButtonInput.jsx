import { Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

const RadioButtonInput = ({ 
  control, 
  placeholder, 
  required, 
  label, 
  name, 
  options 
}) => {
  const Option = ({ label, value, onChange, isSelected }) => {
    return (
      <TouchableOpacity
        style={[
          styles.option,
          isSelected && { backgroundColor: "blue", borderColor: "blue" },
        ]}
        onPress={() => onChange(value)}
      >
        <Text style={[styles.optionText, isSelected && { color: "white" }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Controller
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          {placeholder && (
            <Text style={{ color: "gray", fontSize: 12 }}>{placeholder}</Text>
          )}
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <Option
                key={option.value}
                label={option.label}
                value={option.value}
                onChange={onChange}
                isSelected={value === option.value}
              />
            ))}
          </View>
          {error && <Text style={{ color: "red" }}>{error.message}</Text>}
        </View>
      )}
      name={name}
      rules={{ required: required && "This field is required!" }}
    />
  );
};

export default RadioButtonInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  option: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    borderRadius: 10,
    padding: 7,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 14,
  },
});
