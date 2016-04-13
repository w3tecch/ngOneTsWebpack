
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

//import '../app.ts';
//import 'angular-mocks';
import AbstractModel, {IModelFillAbles, IModelFillAblesTypes} from './abstract.model.ts';
import {IHttpUtilService} from '../services/utils/http.service.ts';
import {httpService as httpServiceName} from '../services/services.module.ts';
//import AppConfig from '../app.config.ts';

class TestModel extends AbstractModel {
    public static api = new TestModel();
    public rootUrl = 'users';
    protected fillAbles(): IModelFillAbles {
        return {
            name: IModelFillAblesTypes.STRING
        };
    }
}

describe('abstract.model', () => {

    let httpService: IHttpUtilService;
    let httpBackend: ng.IHttpBackendService;
    let defaultGetResponseHandler: angular.mock.IRequestHandler;

    beforeEach(() => {
        angular.mock.module('app');
        angular.mock.inject(['$httpBackend', httpServiceName, ($httpBackend: ng.IHttpBackendService, _httpService_: IHttpUtilService) => {
            httpBackend = $httpBackend;
            httpService = _httpService_;
        }]);
    });

    beforeEach(() => {
        defaultGetResponseHandler = httpBackend.when('GET', /.*/)
            .respond({name: 'userX'}, {'A-Token': 'xxx'});
    });

    it('findAll: should trigger GET request', (done) => {
        let spy = sinon.spy(httpService, 'read');
        TestModel.api.findAll();
        expect(spy).to.have.been.calledOnce;
        expect(spy).to.have.been.calledWith('/users');
    });

    //it('findAll: should return a promise', (done) => {
    //    let spy = sinon.spy(httpService, 'read');
    //    TestModel.api.findAll().then((resp) => {
    //        console.log('THE RESPONSE:', resp);
    //        done();
    //    });
    //    expect(spy).to.have.been.calledWith('/users');
    //    expect(spy).to.have.been.calledOnce;
    //    httpBackend.flush();
    //});

});
