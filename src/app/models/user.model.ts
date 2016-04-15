/**
 * Import dependencies
 */
import AbstractModel,
  {IModelFillAbles, IModelFillAblesTypes, IAbstractModel} from './abstract.model.ts';

export interface IUserModelAttributes {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface IUserModel extends IAbstractModel<IUserModelAttributes> {}

/**
 * The Task model class
 *
 * @class TaskModel
 * @extends {AbstractModel}
 * @implements {ITaskModel}
 */
class UserModel extends AbstractModel<IUserModelAttributes, IUserModel> implements IUserModel {

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
