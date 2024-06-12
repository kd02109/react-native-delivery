import EncryptedStorage from 'react-native-encrypted-storage';

type Value = {[key: string]: string | number | any[]} | string | number | any[];
export const setStorage = async (name: string, value: Value) => {
  await EncryptedStorage.setItem(name, JSON.stringify(value));
};

export const getStorage = async (name: string) => {
  const value = await EncryptedStorage.getItem(name);
  if (!value) {
    return null;
  } else {
    return JSON.parse(value);
  }
};

export const deleteStorage = async (name: string) => {
  EncryptedStorage.removeItem(name);
};
