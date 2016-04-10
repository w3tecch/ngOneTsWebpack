/**
 * Import dependencies
 */
import HttpService from './utils/http.service.ts';

/**
 * Define namespace of module
 *
 * @type {string}
 */
const namespace = 'app.services';

/**
 * Export module components
 *
 * @type {string}
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
