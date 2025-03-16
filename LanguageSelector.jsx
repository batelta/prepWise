import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import languages from './languages.json';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Ensure each item has a unique key
  const formattedLanguages = languages.map(lang => ({
    key: lang.code, 
    value: lang.code, 
    label: lang.name,
  }));

  return (
    <View style={{ padding: 20 }}>
      <DropDownPicker style={ {width: '90%',
      borderRadius:'8%',
    backgroundColor: '#F2F2F2',
    borderColor: '#fFF',
    color:'9C9BC2'}}
        open={open}
        value={selectedLanguage}
        items={formattedLanguages}
        setOpen={setOpen}
        setValue={setSelectedLanguage}
        placeholder="Select a language (optional)"
        searchable={true} 
        textStyle={{
            color: '#9C9BC2', // Change color of selected item text
            fontSize: 16,
          }}
          labelStyle={{
            color: '#003D5B', // Change color of dropdown list items
            fontSize: 16,
          }}
          dropDownContainerStyle={{
            borderColor: '#F2F2F2', // Outline color of dropdown list
            width:'90%',
          }}
       
          showTickIcon={true}
          TickIconComponent={({}) => (
            <AntDesign
              style={{marginRight: 5}}
              color="#9FF9D5"
              name="check"
              size={20}
            />
          )}
          // to style the selected item style
selectedItemContainerStyle={{
    backgroundColor: "#F2F2F2"
 }}
      />
    </View>
  );
};

export default LanguageSelector;
