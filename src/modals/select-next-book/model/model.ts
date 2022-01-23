import { atom, computed, map } from 'nanostores';

export const $selected = map<any>();
export const $selectedIds = computed($selected, selected => {
  const ids: string[] = [];

  for (const id of Object.keys(selected)) {
    if (selected[id]) {
      ids.push(id);
    }
  }

  return ids;
});
export const $hasSelected = computed($selectedIds, ids => ids.length > 0);

export const $bookAddingInProgress = atom(false);

export const $selectedLists = atom(new Set<string>());
