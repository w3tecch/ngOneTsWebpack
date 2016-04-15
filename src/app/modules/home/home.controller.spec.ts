/**
 * Import dependencies
 */
import { expect } from 'chai';
import HomeController from './home.controller.ts';

/**
 * Tests
 */
describe('app.home.HomeController', () => {

  let homeController: HomeController;

  beforeEach(() => {
    angular.mock.module('app');
    angular.mock.inject();
  });

  beforeEach(() => {
    homeController = new HomeController();
  });

  it('homeController', () => {
    expect(homeController instanceof <any>HomeController).to.equal(true);
  });

});
