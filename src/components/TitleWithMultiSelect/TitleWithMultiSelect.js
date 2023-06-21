import MultiSelect from 'react-native-multiple-select';
import React from 'react';
import styles from './TitleWithMultiSelect.styles';

const TitleWithMultiSelect = props => {
  const {
    fontSize,
    selectText,
    items,
    searchInputPlaceholderText,
    uniqueKey,
    single,
    itemTextColor,
    selectedItems,
    displayKey,
    noItemsText,
    onSelectedItemsChange,
  } = props;
  return (
    <>
      <MultiSelect
        hideTags
        fontSize={ fontSize }
        items={ items }
        fixedHeight
        single={ single }
        noItemsText={ noItemsText }
        uniqueKey={ uniqueKey }
        altFontFamily='Oswald Medium'
        itemFontSize={ 14 }
        textColor='white'
        itemFontFamily='Oswald Medium'
        selectedItemTextColor='white'
        selectedItemIconColor='white'
        styleMainWrapper={ styles.styleMainWrapper }
        styleInputGroup={ styles.InputGroup }
        styleItemsContainer={ styles.styleItemsContainer }
        styleTextDropdownSelected={ styles.styleTextDropdownSelected }
        styleTextDropdown={ styles.styleTextDropdown }
        searchInputStyle={ styles.searchInputStyle }
        onSelectedItemsChange={ onSelectedItemsChange }
        selectedItems={ selectedItems }
        selectText={ selectText }
        searchInputPlaceholderText={ searchInputPlaceholderText }
        itemTextColor={ itemTextColor }
        displayKey={ displayKey }
        styleDropdownMenuSubsection={ styles.styleDropdownMenuSubsection }
      />
    </>
  );
};

export default TitleWithMultiSelect;
