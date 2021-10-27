import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import { api } from './api';
import { serialize, settings } from './settings';

let saving = false;
let needsToSave = false;
const omitFields = ['userId', 'fantlabAuth', 'persistState', 'mode'];
const SETTINGS_KEY = 'SESSION_KEY';

export async function saveSettings() {
  if (saving || !needsToSave) return;

  saving = true;

  const body = _.omit(serialize(), omitFields);

  try {
    await api.saveSettings({ body });

    needsToSave = false;
  } catch (e) {
    console.error(e);
  }

  saving = false;
}

export async function loadSettings() {
  try {
    const data = await api.getSettings();

    if (_.isEmpty(data)) return;

    omitFields.forEach(field => {
      if (settings[field] !== undefined) {
        data[field] = settings[field];
      }
    });

    if (!_.isEqual(data, serialize())) {
      settings.multiSet(data);

      await saveLocalSettings();
    }
  } catch (e) {
    console.error(e);
  }
}

export async function loadLocalSettings() {
  try {
    const settingsText = await AsyncStorage.getItem(SETTINGS_KEY);

    settings.multiSet(JSON.parse(settingsText) || {});
  } catch (error) {
    console.warn(error.toString());
  }
}

settings.watchAll(field => {
  if (!omitFields.includes(field)) {
    needsToSave = true;
  }

  saveLocalSettings();
});

function saveLocalSettings() {
  const data = serialize();

  return AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
}
