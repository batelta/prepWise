import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import languages from './languages.json';

const LanguageSelector = ({ selectedLanguages, setSelectedLanguages }) => {
    const [selectedItems, setSelectedItems] = useState([]);
  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    handleSelectedLanguages(selectedItems)
  };
//trying to send the name of the language and not the code to the signup page
const handleSelectedLanguages = (selectedItems) => {
    const selectedLanguages = selectedItems
      .map(code => languages.find(lang => lang.code === code))
      .filter(lang => lang !== undefined);
    setSelectedLanguages(selectedLanguages.map(lang => lang.name)); // Store names instead of objects
  };
  return (
    <View style={{ flex: 1 }}>
      <MultiSelect
        hideTags={false} // Make sure tags are not hidden
        items={languages}
        uniqueKey="code"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        tagRemoveIconColor="#black" // Color of the "x" icon
        tagBorderColor="#CCC" // Border color of the tags
        tagTextColor="#000" // Text color inside the tag
        selectedItemTextColor="#000"
        displayKey="name" // Use name for displaying the item
        submitButtonColor="#CCC"
        submitButtonText="Submit"
        styleMainWrapper={styles.multiSelectWrapper} // Style the main container
        styleRowList={styles.multiSelectRow} // Style the row for items in the dropdown
        styleDropdownMenuSubsection={styles.dropdownMenuSubsection} // Style the dropdown
        tagContainerStyle={styles.tagContainer} // Style the container of each selected item
      />
      {/* Display selected items in a row */}
      <View style={styles.selectedItemsContainer}>
      {/*
      {selectedItems.map((item, index) => {
          // Find the language object based on the selected code
          const language = languages.find(lang => lang.code === item);
          return language ? (
            <View >
              <Text style={styles.selectedItemText}>{language.name}</Text>
               You can remove the selected item when the "x" icon is clicked 
            </View>
          ) : null;
        })}  */}
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  multiSelectWrapper: {
    marginBottom: 10,
  },
  multiSelectRow: {
    flexDirection: 'row', // Make sure the dropdown items appear horizontally
    flexWrap: 'wrap', // Allow wrapping of items if they don't fit in one row
  },
  dropdownMenuSubsection: {
    borderRadius: 5, // Style for the dropdown menu
  },
  tagContainer: {
    flexDirection: 'row', // Display tags in a row
    flexWrap: 'wrap', // Allow wrapping of tags
    padding: 5,
  },
  selectedItemsContainer: {
    flexDirection: 'row', // Display selected items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line if needed
    marginTop: 10,
  },
  selectedItemBox: {
    backgroundColor: '#BFB4FF',
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemText: {
    color: '#003D5B',
    fontSize: 14,
    marginRight: 5,
  },
});

export default LanguageSelector;