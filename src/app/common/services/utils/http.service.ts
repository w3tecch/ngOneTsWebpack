/**
 * Import dependencies
 */
import AppConfig from './../../../app.config.ts';

/**
 * @name IHttpUtilService
 * @description
 * This wrapper service build http request with the
 * needed information like headers.
 */
export interface IHttpUtilService {
  /**
   * Create request to create a new object at the database
   */
  create(url: string, data: any, params?: any, skipAuthorization?: boolean): ng.IPromise<any>;
  /**
   * Reads items from the backend
   */
  read(url: string, params?: any, skipAuthorization?: boolean): ng.IPromise<any>;
  /**
   * Updated the given item at the backends database
   */
  update(url: string, data: any, params?: any, skipAuthorization?: boolean): ng.IPromise<any>;
  /**
   * Deletes the given item at the backends database
   */
  destroy(url: string, params?: any, skipAuthorization?: boolean): ng.IPromise<any>;
  /**
   * This is a helper method for custom requests
   */
  custom(method: string, url: string, params?: any, data?: any, headers?: any, skipAuthorization?: boolean)
    : ng.IPromise<any>;
  /**
   * Returns the backend url from the app config
   */
  getBackendUrl(): string;
}

/**
 * @name IHttpUtilService
 * @requires $http
 */
class HttpUtilService {

  public static $inject = [
    '$q',
    '$http'
  ];
  /**
   * Creates an instance of HttpUtilService.
   *
   * @param {ng.IQService} $q (description)
   * @param {angular.IHttpService} $http (description)
   */
  constructor(
    private $q: ng.IQService,
    private $http: angular.IHttpService
  ) {
  }

  /**
   * Create request
   *
   * @param {string} url Without the base endpoint
   * @param {*} data The request data
   * @param {*} [params] The request params
   * @param {boolean} [skipAuthorization=false] If checked the autorization will be skiped
   * @returns {ng.IPromise<any>} Return respone as promise
   */
  public create(url: string, data: any, params?: any, skipAuthorization: boolean = false): ng.IPromise<any> {
    return this.request('POST', AppConfig.ENV.API_URL + url, skipAuthorization, params, data);
  }

  /**
   * Read request
   *
   * @param {string} url Without the base endpoint
   * @param {*} [params] The request params
   * @param {boolean} [skipAuthorization=false] If checked the autorization will be skiped
   * @returns {ng.IPromise<any>} Return respone as promise
   */
  public read(url: string, params?: any, skipAuthorization: boolean = false): ng.IPromise<any> {
    return this.request('GET', AppConfig.ENV.API_URL + url, skipAuthorization, params);
  }

  /**
   * Update request
   *
   * @param {string} url Without the base endpoint
   * @param {*} data The request data
   * @param {*} [params] The request params
   * @param {boolean} [skipAuthorization=false] If checked the autorization will be skiped
   * @returns {ng.IPromise<any>} Return respone as promise
   */
  public update(url: string, data: any, params?: any, skipAuthorization: boolean = false): ng.IPromise<any> {
    return this.request('PUT', AppConfig.ENV.API_URL + url, skipAuthorization, params, data);
  }

  /**
   * Destroy request
   *
   * @param {string} url Without the base endpoint
   * @param {*} [params] The request data
   * @param {boolean} [skipAuthorization=false] If checked the autorization will be skiped
   * @returns {ng.IPromise<any>} Return respone as promise
   */
  public destroy(url: string, params?: any, skipAuthorization: boolean = false): ng.IPromise<any> {
    return this.request('DELETE', AppConfig.ENV.API_URL + url, skipAuthorization, params);
  }

  /**
   * Custom request
   *
   * @param {string} method The request verb
   * @param {string} url Without the base endpoint
   * @param {*} [params] The request params
   * @param {*} [data] The request data
   * @param {*} [headers] The request headers
   * @param {boolean} [skipAuthorization=false] If checked the autorization will be skiped
   * @returns {ng.IPromise<any>} Return respone as promise
   */
  public custom(
    method: string,
    url: string,
    params?: any,
    data?: any,
    headers?: any,
    skipAuthorization: boolean = false
  ): ng.IPromise<any> {
    return this.request(method, AppConfig.ENV.API_URL + url, skipAuthorization, params, data, headers);
  }

  /**
   * Returns the configured backend url
   *
   * @returns {string}
   */
  public getBackendUrl(): string {
    return AppConfig.ENV.API_URL;
  }

  /**
   * A generic request method
   *
   * @private
   * @param {string} method The request verb
   * @param {string} url Without the base endpoint
   * @param {boolean} skipAuthorization If checked the autorization will be skiped
   * @param {*} [params]  The request params
   * @param {*} [data] The request data
   * @param {*} [headers] The request headers
   * @returns {ng.IPromise<any>} Return respone as promise
   */
  private request(method: string, url: string, skipAuthorization: boolean, params?: any, data?: any, headers?: any): ng.IPromise<any> {
    let body = {
      method: method || 'GET',
      url: url,
      skipAuthorization: skipAuthorization,
      headers: undefined,
      data: undefined,
      params: undefined
    };
    body.headers = {
      'Accept': `application/json`,
      'Content-Type': `application/json`
    };
    if (headers) {
      angular.extend(body.headers, headers);
    }
    if (data) {
      body.data = data;
    }
    if (params) {
      body.params = params;
    }
    let def = this.$q.defer();

    this.$http(body)
        .then(response => {
          def.resolve(response.data);
        }, response => {
          def.reject(response);
        });

    return def.promise;
  }
}

/**
 * Export the Service
 */
export default HttpUtilService;
