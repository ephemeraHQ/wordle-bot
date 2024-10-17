/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} public_key
* @param {Uint8Array} private_key
* @param {Uint8Array} message
* @returns {Uint8Array}
*/
export function user_preferences_encrypt(public_key: Uint8Array, private_key: Uint8Array, message: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} public_key
* @param {Uint8Array} private_key
* @param {Uint8Array} message
* @returns {Uint8Array}
*/
export function user_preferences_decrypt(public_key: Uint8Array, private_key: Uint8Array, message: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} private_key
* @returns {string}
*/
export function generate_private_preferences_topic(private_key: Uint8Array): string;
