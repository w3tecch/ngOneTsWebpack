/**
 * Import dependencies
 */
import {httpService} from './../common/services/services.module.ts';
import AbstractModel from './../models/abstract.model.ts';

const angularModel = (httpService) => {
  AbstractModel.httpService = httpService;
};
angularModel.$inject = [httpService];

export default angularModel;
