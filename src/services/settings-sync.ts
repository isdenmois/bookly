import _ from 'lodash';
import { api } from './api';
import { session } from './session';

let saving = false;
const omitFields = ['userId', 'fantlabAuth', 'persistState', 'mode'];

export async function saveSettings() {
  if (saving || !session.needsToSave) return;

  saving = true;

  const body = _.omit(session.serialize(), omitFields);

  try {
    await api.saveSettings({ body });

    session.needsToSave = false;
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
      if (session[field] !== undefined) {
        data[field] = session[field];
      }
    });

    if (!_.isEqual(data, session.serialize())) {
      session.setDefaults(data);

      await session.saveSession(false);
    }
  } catch (e) {
    console.error(e);
  }
}
