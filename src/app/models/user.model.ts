/**
 * Import dependencies
 */
import AbstractModel,
  {IModelFillAbles, IModelFillAblesTypes, IModelAttributes, IAbstractModel} from './abstract.model.ts';

export interface IUserModelAttributes {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface IUserModel extends IAbstractModel {
  attributes: IUserModelAttributes;
}

/**
 * The Task model class
 *
 * @class TaskModel
 * @extends {AbstractModel}
 * @implements {ITaskModel}
 */
class UserModel extends AbstractModel implements IUserModel {

  public static api = new UserModel();

  /* tslint:disable:no-unused-variable */
  /**
   * The base url for this model
   *
   * @private
   * @static
   */
  public rootUrl = 'users';
  /* tslint:enable:no-unused-variable */

  /**
   * Creates an instance of TaskModel.
   *
   * @param {IModelAttributes} [attrs] (description)
   */
  constructor(attrs?: IModelAttributes) {
    super(attrs);
  }

  /**
   * The available attributes for this model
   *
   * @protected
   * @returns {IModelFillAbles} (description)
   */
  protected fillAbles(): IModelFillAbles {
    return {
      id: IModelFillAblesTypes.NUMBER,
      name: IModelFillAblesTypes.STRING,
      username: IModelFillAblesTypes.STRING,
      email: IModelFillAblesTypes.STRING,
      phone: IModelFillAblesTypes.STRING
    };
  };
}

export default UserModel;
