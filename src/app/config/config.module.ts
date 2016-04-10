/**
 * namespace
 */
import { namespace as parentNamespace } from './../app.ts';
export const namespace = `${parentNamespace}.config`;

/**
 * Import dependencies
 */
import angularTranslate from './angularTranslate.config.ts';
import angularLocalStorage from './angularLocalStorage.config.ts';
import angularRouter from './angularRouter.config.ts';
import angularLogger from './angularLogger.config.ts';
import angularModel from './angularModel.config.ts';

/**
 * Define and export angular setup for this module
 *
 * @type {string} returns angular FQDN module name
 */
export default angular.module(namespace, [])
  .config(angularTranslate)
  .config(angularLocalStorage)
  .config(angularRouter)
  .value('$routerRootComponent', 'layout')
  .run(angularLogger)
  .run(angularModel)
  .name;
