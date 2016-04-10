/**
 * Import dependencies
 */
import angularTranslate from './angularTranslate.config.ts';
import angularLocalStorage from './angularLocalStorage.config.ts';
import angularRouter from './angularRouter.config.ts';
import angularLogger from './angularLogger.config.ts';
import angularModel from './angularModel.config.ts';

/**
 * Define namespace of module
 *
 * @type {string}
 */
const namespace = 'app.config';

/**
 * Define and export angular setup for this module
 *
 * @type {string} returns angular FQDN module name
 */
export default angular.module(namespace, [])
  .config(angularTranslate)
  .config(angularLocalStorage)
  .config(angularRouter)
  .value('$routerRootComponent', 'app')
  .run(angularLogger)
  .run(angularModel)
  .name;
