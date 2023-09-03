export class ArrayHelper {
  static chunk<T>(array: T[], size: number): T[][] {
    const chunkedArr: T[][] = [];
    let index = 0;

    while (index < array.length) {
      chunkedArr.push(array.slice(index, size + index));
      index += size;
    }

    return chunkedArr;
  }
}
