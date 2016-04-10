/**
 * namespace
 */
import { namespace as parentNamespace } from './../../app.ts';
export const namespace = `${parentNamespace}.services`;
import HttpService from './utils/http.service.ts';

/**
 * Import dependencies
 */
export const httpService = `${namespace}.httpService`;

/**
 * Define and export angular setup for this module
 *
 * @type {string} returns angular FQDN module name
 */
export default angular.module(namespace, [])
  .service(httpService, HttpService)
  .name;
