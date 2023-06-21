import React, { useState, useEffect } from 'react';
import {
  View, Text, Alert, TouchableOpacity, ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Button, Chip } from 'react-native-elements';
import URContainer from '../../components/URContainer/URContainer';
import { userGenresSagaAction, getUserGenresSagaAction } from '../../state/actions/sagas';
import { getUserDetails, getUserGenresList } from '../../state/selectors/UserProfile';
import styles from './GenreSelection.styles';
import { strings } from '../../utilities/localization/localization';
import Colors from '../../theme/colors';
import Loader from '../../components/Loader/Loader';

const GenreSelection = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserGenresSagaAction());
  }, []);
  const genreList = useSelector(getUserGenresList);
  const genreData = _.map(genreList, data => ({ ...data, isChecked: false }));
  const [genr, setGenr] = useState(genreData);
  const listenerId = useSelector(getUserDetails);

  const updateCheck = id => {
    const temp = _.map(genr, product => {
      if (id === product.id) {
        return { ...product, isChecked: !product.isChecked };
      }
      return product;
    });
    setGenr(temp);
  };

  const renderChips = items => (
    _.map(items, item => (
      <Chip
        key={ item.id }
        title={ item.name }
        TouchableComponent={ TouchableOpacity }
        type={ item.isChecked ? 'solid' : 'outline' }
        onPress={ () => updateCheck(item.id) }
        buttonStyle={ [styles.chipBtnStyle, {
          borderColor: item.isChecked ? Colors.URbtnColor : Colors.labelColor,
          backgroundColor: item.isChecked ? Colors.URbtnColor : 'transparent',
        }] }
        titleStyle={ [styles.genrText, { color: item.isChecked ? Colors.Black : Colors.labelColor }] }
        containerStyle={ styles.chipContainer }
      />
    ))
  );

  const handleSaveBtn = async () => {
    const selected = genr.filter(product => product.isChecked);
    const genres = _.map(selected, item => item.name);
    if (genres.length < 1) {
      Alert.alert(strings('GenreSelection.emptyAlertText'));
    } else {
      const payload = {
        userId: listenerId.id,
        genres,
        from: 1,
      };
      dispatch(userGenresSagaAction(payload));
    }
  };
  const showLoading = useSelector(state => state.userGenres.isWaiting);
  return (
    <URContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.contentView }>
        <View>
          <Text style={ styles.selectText }>
            { strings('GenreSelection.selectText') }
          </Text>
          <ScrollView style={ { height: '78%' } }>
            <View style={ styles.chipsView }>
              { renderChips(genr) }
            </View>
          </ScrollView>
        </View>
        <Button
          onPress={ handleSaveBtn }
          TouchableComponent={ TouchableOpacity }
          containerStyle={ styles.containerStyle }
          buttonStyle={ styles.buttonStyle }
          titleStyle={ styles.titleStyle }
          title={ strings('GenreSelection.save') }
        />
      </View>
    </URContainer>
  );
};

export default GenreSelection;
