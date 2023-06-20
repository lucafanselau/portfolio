/* tslint:disable */
/* eslint-disable */
/**
*/
export class Game {
  free(): void;
/**
* @returns {Promise<Game>}
*/
  static new(): Promise<Game>;
/**
* @param {number} dt
* @param {number} total
* @returns {boolean}
*/
  update(dt: number, total: number): boolean;
/**
* @param {number} width
* @param {number} height
*/
  resize(width: number, height: number): void;
/**
* @param {boolean} disabled
*/
  set_disabled(disabled: boolean): void;
/**
*/
  render(): void;
}
