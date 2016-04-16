/**
 * Namespace
 */
export const namespace = 'app';

/**
 * Import Styles
 */
import '../assets/scss/main.scss';
/**
 * Import Third Libraries
 */
import 'angular';
import '@angular/router/angular1/angular_1_router';
import 'angular-translate';
import 'angular-local-storage';
import 'angular-sanitize';

/**
 * Import app modules
 */
import Decorators from './common/decorators/decorator.module.ts';
import Services from './common/services/services.module.ts';
import Config from './config/config.module.ts';
import {default as Home} from './modules/home/home.module.ts';
import {default as Layout} from './layout/layout.module.ts';

import AppConfig from './app.config.ts';
import Logger from './common/services/utils/logger.service.ts';

/**
 * Define your app
 */
angular
  .module(namespace, [
    // AngularJS Libs
    'ngComponentRouter',

    // Third-Party Libs
    'pascalprecht.translate',
    'LocalStorageModule',
    'ngSanitize',

    // Configs, middleware, run, layout...
    Config,
    Layout,

    // Common components, services, filters, models...
    Decorators,
    Services,

    // App modules
    Home
  ])
  .run(() => {
      const logger = new Logger('app.ts').debug('AppConfig');
      logger(AppConfig);
  });

