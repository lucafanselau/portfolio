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
*/
  render(): void;
}
