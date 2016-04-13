import { expect } from 'chai';
import servicesModule from '../services.module.ts';
import {IHttpUtilService} from './http.service.ts';
import {httpService as httpServiceName} from '../services.module.ts';
import AppConfig from '../../app.config.ts';

describe('http.service', () => {

    let httpBackend: ng.IHttpBackendService;
    let httpService: IHttpUtilService;

    beforeEach(() => {
        angular.mock.module(servicesModule);
        angular.mock.inject(['$httpBackend', httpServiceName, ($httpBackend: ng.IHttpBackendService, _httpService_: IHttpUtilService) => {
            httpBackend = $httpBackend;
            httpService = _httpService_;
        }]);
    });

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should use base API URL from APPConfig', () => {
        expect(httpService.getBackendUrl()).to.equal(AppConfig.ENV.API_URL);
    });

    describe('read', () => {

        it('should send GET request to provided URL', () => {
            httpBackend.expect('GET', `${AppConfig.ENV.API_URL}/test`).respond({});
            httpService.read('/test');
            httpBackend.flush();
        });

        it('should send GET request with given params', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            httpBackend.expect('GET', `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`).respond({});
            httpService.read('/test', params);
            httpBackend.flush();
        });

        it('should return a promise providing the response data', () => {
            httpBackend.expect('GET', `${AppConfig.ENV.API_URL}/user/1`).respond({name: 'Jimbo'});
            httpService.read('/user/1').then((resp) => {
                expect(resp.name).to.equal('Jimbo');
            });
            httpBackend.flush();
        });

        it('should return a promise providing full response in case of an error', () => {
            httpBackend.expect('GET', `${AppConfig.ENV.API_URL}/error`).respond(
                500,
                {error: 123},
                {'THE-Token': '555'}
            );
            httpService.read('/error').then(undefined, (resp) => {
                expect(resp.status).to.equal(500);
                expect(resp.data.error).to.equal(123);
                expect(resp.headers('THE-TOKEN')).to.equal('555');
            });
            httpBackend.flush();
        });

    });

    describe('create', () => {

        it('should send POST request to provided URL with provided data', () => {
            httpBackend.expect('POST', `${AppConfig.ENV.API_URL}/test`, {name: 'Jimbo'}).respond({});
            httpService.create('/test', {name: 'Jimbo'});
            httpBackend.flush();
        });

        it('should send POST request with given params', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            httpBackend.expect(
                'POST',
                `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`,
                {name: 'Jimbo'}
            ).respond({});
            httpService.create('/test', {name: 'Jimbo'}, params);
            httpBackend.flush();
        });

        it('should return a promise providing the response data', () => {
            httpBackend.expect('POST', `${AppConfig.ENV.API_URL}/user`).respond({name: 'Jimbo'});
            httpService.create('/user', {name: 'Pippi'}).then((resp) => {
                expect(resp.name).to.equal('Jimbo');
            });
            httpBackend.flush();
        });

        it('should return a promise providing full response in case of an error', () => {
            httpBackend.expect('POST', `${AppConfig.ENV.API_URL}/error`).respond(
                500,
                {error: 123},
                {'THE-Token': '555'}
            );
            httpService.create('/error', {}).then(undefined, (resp) => {
                expect(resp.status).to.equal(500);
                expect(resp.data.error).to.equal(123);
                expect(resp.headers('THE-TOKEN')).to.equal('555');
            });
            httpBackend.flush();
        });

    });

});
