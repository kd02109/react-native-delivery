import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {LoggedInParamList} from 'AppNavigator';
import ImagePicker, {Image as ImageType} from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {orderSlice} from '@/slice/order';
import {useAppDispatch} from '../store';
import {postWithAuthToken} from '@/api';
import Button from '@/components/Button';

function Complete() {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<LoggedInParamList, 'Complete'>>();
  const navigation =
    useNavigation<NavigationProp<LoggedInParamList, 'Complete'>>();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const onResponse = useCallback(async (response: ImageType) => {
    console.log('IMAGE SIZE : ', response);
    // 타입과 데이터 preview에 저장
    // react native에서는 이미지 src를 source로 해고 객체로 경로를 받습니다. {uri : string}
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation : ', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      console.log(r.uri, r.name);

      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
    });
  }, []);

  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      // 미리보기에 사용할 데이터를 Base64로 저장합니다.
      includeBase64: true,
      // 휴대폰으로 사진 찍는 것에 따라 방향이 다릅니다. 따라서 각 사진 찍는 방향에 따라 숫자를 붙여서 정방향을 찾게 해줍니다.
      includeExif: true,
      saveToPhotos: true,
      cropping: true,
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const orderId = route.params?.orderId;
  const onComplete = useCallback(async () => {
    setIsLoading(true);
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }
    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);
    formData.append('orderId', orderId);

    try {
      await postWithAuthToken<any, typeof formData>(
        '/complete',
        accessToken,
        formData,
        'multipart/form-data',
      );
      console.log('성공');
      Alert.alert('알림', '완료처리 되었습니다.');
      navigation.goBack();
      navigation.navigate('Settings');
      dispatch(orderSlice.actions.rejectOrder(orderId));
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigation, image, orderId, accessToken]);

  return (
    <View>
      <View style={styles.orderId}>
        <Text>주문번호: {orderId}</Text>
      </View>
      <View style={styles.preview}>
        {preview && <Image style={styles.previewImage} source={preview} />}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onChangeFile}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </Pressable>
        <Button
          style={
            image
              ? styles.button
              : StyleSheet.compose(styles.button, styles.buttonDisabled)
          }
          onPress={onComplete}
          loading={isLoading}>
          <Text style={styles.buttonText}>완료</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderId: {
    padding: 20,
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 3,
    // 이미지 크기 결정 object-fit과 유사
    resizeMode: 'contain',
  },
  buttonWrapper: {flexDirection: 'row', justifyContent: 'center'},
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'black',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
});

export default Complete;
