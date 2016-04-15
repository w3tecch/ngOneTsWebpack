/**
 * Import dependencies
 */
import * as moment from 'moment';
import { IHttpUtilService } from './../services/utils/http.service.ts';

/**
 * The attributes interface
 *
 * @export
 * @interface IModelFillAbles
 */
export interface IModelFillAbles {
  [key: string]: IModelFillAblesTypes;
}

/**
 * The available types
 *
 * @export
 * @enum {number}
 */
export enum IModelFillAblesTypes {
  NUMBER,
  FLOAT,
  STRING,
  BOOL,
  DATE,
  TIME,
  OBJECT
}

export type IModelIdentifier = string | number;

export type IModelAttributes = Object;

/**
 * The Abstract model interface
 *
 * @export
 * @interface IAbstractModel
 */
export interface IAbstractModel<K> {
  rootUrl: string;
  attributes: K;
  isNew(): boolean;
  save<T>(): ng.IPromise<T>;
  destroy<T>(): ng.IPromise<T>;
  resetAttributes(): K;
  toArray(): K;
  bulkUpdateAttrs(list: Object): K;
  getId(): IModelIdentifier;
}

interface IConstruct {
  name: string;
}

/**
 * The Abstract model
 *
 * @abstract
 * @class AbstractModel
 * @implements {IAbstractModel}
 */
abstract class AbstractModel<K extends IModelAttributes, J extends IAbstractModel<K>> implements IAbstractModel<K> {

  /**
   * HttpService
   *
   * @static
   * @type {IHttpUtilService}
   */
  public static httpService: IHttpUtilService;

  /**
   * The model root url
   * empty for abstract class
   *
   * @type {string}
   */
  public rootUrl: string;

  /**
   * This hold the attributes you are action on
   *
   * @type {IModelAttributes}
   */
  public attributes: K = <K>{};

  /**
   * Identifier
   * This can be overwriten by a direved class if needed
   *
   * @protected
   * @type {string}
   */
  protected identifier: string = 'id';

  /**
   * Default time format which is used in your backend
   *
   * @protected
   * @type {string}
   */
  protected httpDateFormat: string = 'YYYY-MM-DD HH:mm:ss';

  /**
   * Should we send the identifier within the payload
   *
   * @protected
   * @type {boolean}
   */
  protected httpSendIdentifier: boolean = false;

  /**
   * Which data should we not send to the backend
   *
   * @protected
   * @type {string[]}
   */
  protected httpNotSendData: string[] = [
    'createdAt',
    'updatedAt'
  ];

  /**
   * This holds you attributes from the backend
   *
   * @protected
   * @type {IModelAttributes}
   */
  protected original: K = <K>{};

  /**
   * Constructor
   * @param model
   * @param attrs
   */
  constructor(attrs?: Object) {
    if (attrs) { this.fill(attrs); } else { this.fillEmpty(); }
  }

  /**
   * Tells if the model is new
   *
   * @returns {boolean}
   */
  public isNew(): boolean { return !this.getId(); }

  /**
   * Find one model
   *
   * @param {IModelIdentifier} id
   * @returns {ng.IPromise<IAbstractModel>}
   */
  public find(id: IModelIdentifier): ng.IPromise<J> {
    return this.get(id);
  }

  /**
   * Find all models
   *
   * @returns {ng.IPromise<IAbstractModel[]>}
   */
  public findAll(): ng.IPromise<J[]> {
    return this.getAll();
  }

  /**
   * Find one or all model with a different url
   *
   * @param {string} url This will replace the complete url after the base endpoint
   * @returns {(ng.IPromise<IAbstractModel | IAbstractModel[]>)}
   */
  public findCustom(url: string): ng.IPromise<J | J[]> {
    return this.customGet(url);
  }

  /**
   * A generic request method
   *
   * @param {string} method The http verb
   * @param {string} url The url without the base endpoint
   * @param params The request params
   * @param data The request data
   * @param headers The request headers
   * @param {boolean} skipAuth Shoud the authorization be skiped
   * @returns {(ng.IPromise<IAbstractModel | IAbstractModel[] | void>)} Return a promise
   */
  public customRequest(method: string, url: string, params, data, headers, skipAuth: boolean)
  : ng.IPromise<J | J[] | void> {
    return this.customRequestCall(method, url, params, data, headers, skipAuth);
  }

  /**
   * Saves the actin model
   *
   * @returns {ng.IPromise<IAbstractModel>}
   */
  public save(): ng.IPromise<J> {
    return this.isNew() ?
      this.create(this.convertToHttpData(this.toArray())) : this.update(this.convertToHttpData(this.toArray()));
  }

  /**
   * Destories the actin model
   *
   * @returns {ng.IPromise<void>}
   */
  public destroy(): ng.IPromise<void> {
    return this.delete(this.original[this.identifier]);
  }

  /**
   * Resets the attribtes from the original
   *
   * @returns {IModelAttributes}
   */
  public resetAttributes(): K { return this.attributes = angular.copy(this.original); }

  /**
   * Convert the actin model to an array
   *
   * @returns {IModelAttributes}
   */
  public toArray(): K { return this.attributes; }

  /**
   * You can update multipe attributes at once
   *
   * @param {IModelAttributes} list
   * @returns {IModelAttributes}
   */
  public bulkUpdateAttrs(list: Object): K {
    Object.keys(list).map(key => this.attributes[key] = list[key]);
    return this.attributes;
  }

  /**
   * Get the identifier attribute value
   *
   * @returns {IModelIdentifier}
   */
  public getId(): IModelIdentifier { return <IModelIdentifier>this.attributes[this.identifier]; }

  /**
   * Find a specific model
   *
   * @protected
   * @param {IModelIdentifier} id
   * @returns {ng.IPromise<IAbstractModel>}
   */
  protected get(id: IModelIdentifier): ng.IPromise<J> {
    return AbstractModel.httpService.read(`/${this.rootUrl}/${id}`).then(r => this.newModel(r));
  }

  /**
   * Find all models
   *
   * @protected
   * @returns {ng.IPromise<IAbstractModel[]>}
   */
  protected getAll(): ng.IPromise<J[]> {
    return AbstractModel.httpService.read(`/${this.rootUrl}`).then(r => this.newModel(r));
  }

  /**
   * Find a specific related model from the actin model
   *
   * @public
   * @param {IModelIdentifier} localId
   * @param {string} relation
   * @param {IModelIdentifier} foreignId
   * @returns {ng.IPromise<IAbstractModel>}
   */
  public findRelation (
    localId: IModelIdentifier,
    relation:  { new(): IAbstractModel<any> },
    foreignId: IModelIdentifier,
    parent: boolean = false
  ): ng.IPromise<J> {
    let relationModel = new relation();
    if (parent) {
      return AbstractModel.httpService.read(`/${relationModel.rootUrl}/${foreignId}/${this.rootUrl}/${localId}`)
        .then(r => this.newModel(r));
    } else {
      return AbstractModel.httpService.read(`/${this.rootUrl}/${localId}/${relationModel.rootUrl}/${foreignId}`)
        .then(r => this.newModel(r, relation));
    }
  }

  /**
   * Find all related models form the actin model
   *
   * @public
   * @param {string} localId
   * @param {string} relation
   * @returns {ng.IPromise<IAbstractModel[]>}
   */
  public allRelation (
      localId: IModelIdentifier,
      relation: { new(): IAbstractModel<any> },
      parent: boolean = false
  ): ng.IPromise<J[]> {
    let relationModel = new relation();
    if (parent) {
      return AbstractModel.httpService.read(`/${relationModel.rootUrl}/${localId}/${this.rootUrl}`).then(r => this.newModel(r));
    } else {
      return AbstractModel.httpService.read(`/${this.rootUrl}/${localId}/${relationModel.rootUrl}`).then(r => this.newModel(r, relation));
    }
  }

  /**
   * Here is a mighty custom reader
   *
   * @protected
   * @param {string} url
   * @returns {(ng.IPromise<IAbstractModel | IAbstractModel[]>)}
   */
  protected customGet(url: string): ng.IPromise<J | J[]> {
    return AbstractModel.httpService.read(url).then(r => this.newModel(r));
  }

  /**
   * Here is a mighty custom request method
   *
   * @protected
   * @param {string} method The http verb
   * @param {string} url The url without the base endpoint
   * @param params The request params
   * @param data The request data
   * @param headers The request headers
   * @param {boolean} skipAuth Shoud the authorization be skiped
   * @returns {(ng.IPromise<IAbstractModel | IAbstractModel[] | void>)} Return a promise
   */
  protected customRequestCall(method: string, url: string, params, data, headers, skipAuth: boolean)
  : ng.IPromise<J | J[] | void> {
    return AbstractModel.httpService.custom(method, url, params, data, headers, skipAuth);
  }

  /**
   * Create a model
   *
   * @protected
   * @param {IModelAttributes} data
   * @returns {ng.IPromise<IAbstractModel>}
   */
  protected create(data: K): ng.IPromise<J> {
    return AbstractModel.httpService.create(`/${this.rootUrl}`, data).then(r => this.newModel(r));
  }

  /**
   * Update a model
   *
   * @protected
   * @param {IModelAttributes} data
   * @returns {ng.IPromise<IAbstractModel>}
   */
  protected update(data: K): ng.IPromise<J> {
    return AbstractModel.httpService.update(`/${this.rootUrl}/${this.getId()}`, data).then(r => this.newModel(r));
  }

  /**
   * Destories a model
   *
   * @protected
   * @param {IModelIdentifier} id
   * @returns {ng.IPromise<void>}
   */
  protected delete(id: IModelIdentifier): ng.IPromise<void> {
    return AbstractModel.httpService.destroy(`/${this.rootUrl}/${id}`).then(r => void 0);
  }

  /**
   * You have to define fillAbles, these are your attributes
   *
   * @protected
   * @abstract
   * @returns {IModelFillAbles}
   */
  protected abstract fillAbles(): IModelFillAbles;

  /**
   * Converts attributes to HTTP data
   *
   * @private
   * @param {IModelAttributes} attrs
   * @returns {IModelAttributes}
   */
  private convertToHttpData(attrs: K): K {
    let tempHttpData = {};
    Object.keys(this.fillAbles())
      .forEach(key => {
        if (angular.isDefined(attrs[key])) {
          tempHttpData[key] = this.convertToHttpType(attrs[key], this.fillAbles()[key]);
        }
      });
    if (!this.httpSendIdentifier) {
      delete tempHttpData[this.identifier];
    }
    this.httpNotSendData.forEach(i => delete tempHttpData[i]);
    return <K>tempHttpData;
  };

  /**
   * This will create a new model(s) no matter what happens
   *
   * @private
   * @param {*} data
   * @returns {(IAbstractModel | IAbstractModel[])}
   */
  private newModel(data: Array<Object> | Object, otherModel?: any): J | J[] {
    let model = otherModel ? otherModel : this.constructor;
    return data && Array.isArray(data) && data.map(e => new model(e)) ||
    data && Object.keys(data).length > 0 && new model(data) ||
    data && Array.isArray(data) && [] ||
    data && {} ||
    undefined;
  }

  /**
   * Fill up your model with attributes
   *
   * @private
   * @param {IModelAttributes} attrs
   * @returns {IModelAttributes}
   */
  private fill(attrs: Object): K {
    return attrs && Object.keys(this.fillAbles())
      .map(key => angular.isDefined(attrs[key]) && (this.original[key] = this.convertToType(attrs[key], this.fillAbles()[key]))) &&
      this.resetAttributes();
  }

  /**
   * Create an empty model
   *
   * @private
   * @returns {IModelAttributes}
   */
  private fillEmpty(): void {
    Object.keys(this.fillAbles()).map(key => this.attributes[key] = undefined);
  }

  /**
   * Convert values to specific types
   *
   * @private
   * @template T
   * @param {*} value
   * @param {IModelFillAblesTypes} type
   * @returns {T}
   */
  private convertToType<T>(value: any, type: IModelFillAblesTypes): T {
    let returnValue;
    switch (type) {
      case IModelFillAblesTypes.NUMBER:
        returnValue = parseInt(value);
        break;
      case IModelFillAblesTypes.FLOAT:
        returnValue = parseFloat(value);
        break;
      case IModelFillAblesTypes.STRING:
        returnValue = value.toString();
        break;
      case IModelFillAblesTypes.BOOL:
        returnValue = !!value;
        break;
      case IModelFillAblesTypes.DATE:
        returnValue = moment(value);
        break;
      case IModelFillAblesTypes.OBJECT:
        returnValue = JSON.parse(value);
        break;
      default:
        returnValue = value;
    }
    return returnValue;
  };

  /**
   * Convert HTTP data to specific attributes
   *
   * @private
   * @template T
   * @param {*} value (description)
   * @param {IModelFillAblesTypes} type (description)
   * @returns {T} (description)
   */
  private convertToHttpType<T>(value: any, type: IModelFillAblesTypes): T {
    let returnValue;
    switch (type) {
      case IModelFillAblesTypes.NUMBER:
        returnValue = parseInt(value);
        break;
      case IModelFillAblesTypes.FLOAT:
        returnValue = parseFloat(value);
        break;
      case IModelFillAblesTypes.STRING:
        returnValue = value.toString();
        break;
      case IModelFillAblesTypes.BOOL:
        returnValue = !!value;
        break;
      case IModelFillAblesTypes.DATE:
        returnValue = moment(value).format(this.httpDateFormat);
        break;
      case IModelFillAblesTypes.OBJECT:
        returnValue = JSON.stringify(value);
        break;
      default:
        returnValue = value;
    }
    return returnValue;
  };

}

export default AbstractModel;
