/**
 * Import dependencies
 */
import AbstractModel,
  {IModelFillAbles, IModelFillAblesTypes, IModelAttributes, IAbstractModel} from './abstract.model.ts';

export interface ITodoModelAttributes {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

export interface ITodoModel extends IAbstractModel {
  attributes: ITodoModelAttributes;
}

/**
 * The Task model class
 *
 * @class TaskModel
 * @extends {AbstractModel}
 * @implements {ITaskModel}
 */
class TodoModel extends AbstractModel implements ITodoModel {

  public static api = new TodoModel();

  /* tslint:disable:no-unused-variable */
  /**
   * The base url for this model
   *
   * @private
   * @static
   */
  public rootUrl = 'todos';
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
      title: IModelFillAblesTypes.STRING,
      userId: IModelFillAblesTypes.NUMBER,
      completed: IModelFillAblesTypes.BOOL
    };
  };
}

export default TodoModel;
