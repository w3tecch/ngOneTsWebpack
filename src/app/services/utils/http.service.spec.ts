import { expect } from 'chai';
import servicesModule from '../services.module.ts';
import {IHttpUtilService} from './http.service.ts';
import {httpService} from '../services.module.ts';
import AppConfig from '../../app.config.ts';

describe('http.service', () => {

    let httpBackend: ng.IHttpBackendService;
    let http_service: IHttpUtilService;

    beforeEach(() => {
        angular.mock.module(servicesModule);
        angular.mock.inject(['$httpBackend', httpService, ($httpBackend: ng.IHttpBackendService, httpService: IHttpUtilService) => {
            httpBackend = $httpBackend;
            http_service = httpService;
        }]);
    });

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should use base API from APPConfig', () => {
        expect(http_service.getBackendUrl()).to.equal(AppConfig.ENV.API_URL);
    });

});
