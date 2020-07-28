export async function merge(array: any[], compare: Function, lo = 0, hi = array.length - 1) {
  if (hi > lo) {
    let mid = ((lo + hi + 1) / 2) | 0;
    await merge(array, compare, lo, mid - 1);
    await merge(array, compare, mid, hi);
    let results = [];
    let i = lo;
    let j = mid;
    let index = 0;

    while (i < mid || j <= hi) {
      if (i == mid) {
        results[index] = array[j];
        j++;
      } else if (j == hi + 1) {
        results[index] = array[i];
        i++;
      } else {
        if (await compare(array[j], array[i])) {
          results[index] = array[j];
          j++;
        } else {
          results[index] = array[i];
          i++;
        }
      }
      index++;
    }
    for (let k = lo; k <= hi; k++) {
      array[k] = results[k - lo];
    }
  }

  return array;
}
