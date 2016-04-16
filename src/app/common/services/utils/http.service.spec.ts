import { expect } from 'chai';
import servicesModule from '../services.module.ts';
import {IHttpUtilService} from './http.service.ts';
import {httpService as httpServiceName} from '../services.module.ts';
import AppConfig from '../../../app.config.ts';

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

    describe('update', () => {

        it('should send PUT request to provided URL with provided data', () => {
            httpBackend.expect('PUT', `${AppConfig.ENV.API_URL}/test`, {name: 'Jimbo'}).respond({});
            httpService.update('/test', {name: 'Jimbo'});
            httpBackend.flush();
        });

        it('should send PUT request with given params', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            httpBackend.expect(
                'PUT',
                `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`,
                {name: 'Jimbo'}
            ).respond({});
            httpService.update('/test', {name: 'Jimbo'}, params);
            httpBackend.flush();
        });

        it('should return a promise providing the response data', () => {
            httpBackend.expect('PUT', `${AppConfig.ENV.API_URL}/user`).respond({name: 'Jimbo'});
            httpService.update('/user', {name: 'Pippi'}).then((resp) => {
                expect(resp.name).to.equal('Jimbo');
            });
            httpBackend.flush();
        });

        it('should return a promise providing full response in case of an error', () => {
            httpBackend.expect('PUT', `${AppConfig.ENV.API_URL}/error`).respond(
                500,
                {error: 123},
                {'THE-Token': '555'}
            );
            httpService.update('/error', {}).then(undefined, (resp) => {
                expect(resp.status).to.equal(500);
                expect(resp.data.error).to.equal(123);
                expect(resp.headers('THE-TOKEN')).to.equal('555');
            });
            httpBackend.flush();
        });
    });

    describe('destroy', () => {

        it('should send DELETE request to provided URL', () => {
            httpBackend.expect('DELETE', `${AppConfig.ENV.API_URL}/user/99`).respond({});
            httpService.destroy('/user/99');
            httpBackend.flush();
        });

        it('should send DELETE request with given params', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            httpBackend.expect(
                'DELETE',
                `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`
            ).respond({});
            httpService.destroy('/test', params);
            httpBackend.flush();
        });

        it('should return a promise providing the response data', () => {
            httpBackend.expect('DELETE', `${AppConfig.ENV.API_URL}/user`).respond({name: 'Jimbo'});
            httpService.destroy('/user').then((resp) => {
                expect(resp.name).to.equal('Jimbo');
            });
            httpBackend.flush();
        });

        it('should return a promise providing full response in case of an error', () => {
            httpBackend.expect('DELETE', `${AppConfig.ENV.API_URL}/error`).respond(
                500,
                {error: 123},
                {'THE-Token': '555'}
            );
            httpService.destroy('/error').then(undefined, (resp) => {
                expect(resp.status).to.equal(500);
                expect(resp.data.error).to.equal(123);
                expect(resp.headers('THE-TOKEN')).to.equal('555');
            });
            httpBackend.flush();
        });
    });

    describe('custom', () => {

        it('should send GET request with given URL', () => {
            httpBackend.expect('GET', `${AppConfig.ENV.API_URL}/test`).respond({});
            httpService.custom('GET', '/test');
            httpBackend.flush();
        });

        it('should send GET request with given URL, params and header', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            const headers = {
                'SOME-HEADER': 'X-123-X'
            };
            httpBackend.expect(
                'GET',
                `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`,
                undefined,
                (headers: any) => {
                    return headers['SOME-HEADER'] === 'X-123-X';
                }
            ).respond({});
            httpService.custom('GET', '/test', params, undefined, headers);
            httpBackend.flush();
        });

        it('should send POST request with given URL, params, data, headers', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            const headers = {
                'SOME-HEADER': 'X-123-X'
            };
            httpBackend.expect(
                'POST',
                `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`,
                {name: 'Jimbo'},
                (headers: any) => {
                    return headers['SOME-HEADER'] === 'X-123-X';
                }
            ).respond({});
            httpService.custom('POST', '/test', params, {name: 'Jimbo'}, headers);
            httpBackend.flush();
        });

        it('should send PUT request with given URL, params, data, headers', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            const headers = {
                'SOME-HEADER': 'X-123-X'
            };
            httpBackend.expect(
                'PUT',
                `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`,
                {name: 'Jimbo'},
                (headers: any) => {
                    return headers['SOME-HEADER'] === 'X-123-X';
                }
            ).respond({});
            httpService.custom('PUT', '/test', params, {name: 'Jimbo'}, headers);
            httpBackend.flush();
        });

        it('should send DELETE request with given URL, params, headers', () => {
            const params: any = {
                name: 'Jimbo',
                age: 55
            };
            const headers = {
                'SOME-HEADER': 'X-123-X'
            };
            httpBackend.expect(
                'DELETE',
                `${AppConfig.ENV.API_URL}/test?age=55&name=Jimbo`,
                undefined,
                (headers: any) => {
                    return headers['SOME-HEADER'] === 'X-123-X';
                }
            ).respond({});
            httpService.custom('DELETE', '/test', params, {name: 'Jimbo'}, headers);
            httpBackend.flush();
        });

        it('should return a promise providing the response data', () => {
            httpBackend.expect('GET', `${AppConfig.ENV.API_URL}/user`).respond({name: 'Jimbo'});
            httpService.custom('GET', '/user').then((resp) => {
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
            httpService.custom('GET', '/error', {}).then(undefined, (resp) => {
                expect(resp.status).to.equal(500);
                expect(resp.data.error).to.equal(123);
                expect(resp.headers('THE-TOKEN')).to.equal('555');
            });
            httpBackend.flush();
        });

    });

});
