/**
 * Import dependencies
 */
import Logger from './../../common/services/utils/logger.service.ts';
import {mediatorService} from './../../common/services/utils/mediator.service.ts';
import UserModel from './../../models/user.model.ts';
import TodoModel from './../../models/todo.model.ts';

/**
 * An example Controller
 *
 * @class HomeController
 */
class HomeController {
  public name: string;
  private _logger: Logger;

  /**
   * static inject
   *
   * @static $inject
   */
  public static $inject = [];

  /**
   * Creates an instance of HomeController.
   */
  constructor() {

    // Example logger
    this._logger = new Logger('app.services.HomeController');
    let exampleInfoLogger = this._logger.debug('logger:example');
    exampleInfoLogger('1');
    exampleInfoLogger('2');

    // Example mediator
    let testChannelSubscriber = mediatorService.subscribe('mediator:example');
    testChannelSubscriber((a) => {
      this._logger.debug('mediator:example')(a);
    });

    let testChannelPublisher = mediatorService.publish('mediator:example');
    testChannelPublisher('gugus 1');
    testChannelPublisher('gugus 2');

    // Test models
    let userPromise = UserModel.api.find(1);
    userPromise.then(user => console.log(user) && user);

    userPromise = userPromise.then((user: UserModel) => {
      user.bulkUpdateAttrs({ name: 'Dave'});
      return user.save();
    });

    let userPromiseD = UserModel.api.find(1).then((user: UserModel) => {
      console.log(user);
      return user.destroy();
    });

    userPromiseD.then(resp => console.log(resp))
      .catch(err => console.log(err));

    let userTodo = UserModel.api.allRelation(1, TodoModel);
    userTodo.then((todos: TodoModel[]) => console.log(todos));

    let userTodo1 = UserModel.api.findRelation(1, TodoModel, 1);
    userTodo1.then((todos: TodoModel) => console.log(todos));
  }

  /**
   * An example method
   *
   * @returns {string} returns 'Hello'
   */
  public sayHello(): string {
    return 'Hello';
  }
}

export default HomeController;
