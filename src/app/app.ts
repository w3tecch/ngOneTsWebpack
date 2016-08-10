/**
 * Import Styles
 */
import '../assets/scss/main.scss';
/**
 * Import Third Libraries
 */
import 'core-js/es6';
import 'jquery';
import 'angular';
import '@angular/router/angular1/angular_1_router';
import 'angular-translate';
import 'angular-local-storage';
import 'angular-sanitize';

/**
 * Import app modules
 */
import Decorators from './common/decorators/decorator.module.ts';
import Config from './config/config.module.ts';
import Home from './modules/home/home.routes.ts';
import Layout from './layout/layout.routes.ts';

import AppConfig from './app.config.ts';
import Logger from './common/services/utils/logger.service.ts';

/**
 * Define your app
 */
angular
  .module('app', [
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

    // App modules
    Home
  ])
  .run(() => {
      const logger = new Logger('app.ts').debug('AppConfig');
      logger(AppConfig);
  });
