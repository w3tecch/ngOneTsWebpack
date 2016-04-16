
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import AbstractModel, {IModelFillAbles, IModelFillAblesTypes, IAbstractModel} from './abstract.model.ts';
import {IHttpUtilService} from '../common/services/utils/http.service.ts';
import {httpService as httpServiceName} from '../common/services/services.module.ts';

interface ITestModelAttributes {
    id: number;
    name: string;
    num: number;
    active: boolean;
    floatNum: number;
    some: {
        name: string;
    };
}

interface ITestModel extends IAbstractModel<ITestModelAttributes> {}

class TestModel extends AbstractModel<ITestModelAttributes, ITestModel> {
    public static api = new TestModel();
    public rootUrl = 'users';
    protected fillAbles(): IModelFillAbles {
        return {
            id: IModelFillAblesTypes.NUMBER,
            name: IModelFillAblesTypes.STRING,
            num: IModelFillAblesTypes.NUMBER,
            active: IModelFillAblesTypes.BOOL,
            floatNum: IModelFillAblesTypes.FLOAT
        };
    }
}

describe('abstract.model', () => {

    let httpService: IHttpUtilService;
    let httpBackend: ng.IHttpBackendService;

    beforeEach(() => {
        angular.mock.module('app');
        angular.mock.inject(['$httpBackend', httpServiceName,
            ($httpBackend: ng.IHttpBackendService, _httpService_: IHttpUtilService) => {
                httpBackend = $httpBackend;
                httpService = _httpService_;
        }]);
    });

    //xdescribe('identifier', () => {
    //
    //    it('should be by default "id"', () => {
    //
    //    });
    //
    //    it('should be excluded when sending requests by default', () => {
    //
    //    });
    //
    //    it('should be included in requests when configured', () => {
    //
    //    });
    //
    //});
    //
    //
    //xdescribe('httpNotSendData', () => {
    //
    //    it('should be none by default', () => {
    //
    //    });
    //
    //    it('should be excluded from requests', () => {
    //
    //    });
    //
    //});

    describe('instance creation', () => {

        it('constructor: should create model\'s attributes object', () => {
            const tModel = new TestModel({
                name: 'Some Jimbo',
                num: 22,
                active: true
            });
            expect(tModel.attributes).to.have.property('name', 'Some Jimbo');
            expect(tModel.attributes).to.have.property('num', 22);
            expect(tModel.attributes).to.have.property('active', true);
        });

        describe('isNew', () => {

            it('should return true for a newly created model instance', () => {
                const tModel = new TestModel();
                expect(tModel.isNew()).to.be.true;
            });

            it('should return false for a saved model', (done) => {
                httpBackend.expect('POST', /.*\/users/).respond({id: 1});
                const tModel = new TestModel();
                tModel.save().then((resp) => {
                    expect(resp.isNew()).to.be.false;
                    done();
                });
                httpBackend.flush();
            });

            it('should return true for falsy valid ID', (done) => {
                httpBackend.expect('POST', /.*\/users/).respond({id: 0});
                const tModel = new TestModel();
                tModel.save().then((resp) => {
                    expect(resp.isNew()).to.be.false;
                    done();
                });
                httpBackend.flush();
            });

        });

    });

    describe('CRUD', () => {

        describe('save', () => {

            it('should trigger POST request for new models', () => {
                const createMethod = sinon.spy(httpService, 'create');
                const tModel = new TestModel({name: 'Pippi', num: 25});
                tModel.save();
                expect(createMethod).to.have.been.calledOnce;
                expect(createMethod).to.have.been.calledWith('/users', {name: 'Pippi', num: 25});
            });

            it('should trigger PUSH request for existing models', () => {
                const updateMethod = sinon.spy(httpService, 'update');
                const tModel = new TestModel({id: 1, name: 'Pippi', num: 25});
                tModel.save();
                expect(updateMethod).to.have.been.calledOnce;
                expect(updateMethod).to.have.been.calledWith('/users/1', {name: 'Pippi', num: 25});
            });

            it('returns promise that resolves to model', (done) => {
                httpBackend.expect('POST', /.*\/users/).respond({id: 1});
                const tModel = new TestModel();
                tModel.save().then((resp) => {
                    expect(resp).to.be.instanceof(TestModel);
                    done();
                });
                httpBackend.flush();
            });

        });

        describe('destroy', () => {

            it('should trigger DELETE request', () => {
                const destroyMethod = sinon.spy(httpService, 'destroy');
                const tModel = new TestModel({id: 99});
                tModel.destroy();
                expect(destroyMethod).to.have.been.calledOnce;
                expect(destroyMethod).to.have.been.calledWith('/users/99');
            });

        });

        describe('find', () => {

            it('should trigger corresponding GET request', () => {
                const readMethod = sinon.spy(httpService, 'read');
                TestModel.api.find(1);
                expect(readMethod).to.have.been.calledOnce;
                expect(readMethod).to.have.been.calledWith('/users/1');
            });

            it('should deliver a model with correct type', (done) => {
                httpBackend.expect('GET', /.*\/users\/1$/)
                    .respond({name: 'userX'});
                TestModel.api.find(1).then((resp) => {
                    expect(resp).to.be.instanceof(TestModel);
                    done();
                });
                httpBackend.flush();
            });

            it('should model with data from the response', (done) => {
                httpBackend.expect('GET', /.*\/users\/1$/)
                    .respond({name: 'userY'});
                TestModel.api.find(1).then((resp) => {
                    expect(resp.attributes).to.have.property('name', 'userY');
                    done();
                });
                httpBackend.flush();
            });

        });

        describe('findAll', () => {

            it('should trigger corresponding GET request', () => {
                const readMethod = sinon.spy(httpService, 'read');
                TestModel.api.findAll();
                expect(readMethod).to.have.been.calledOnce;
                expect(readMethod).to.have.been.calledWith('/users');
            });

            it('should return a promise that resolves to an array of models', (done) => {
                httpBackend.expect('GET', /.*\/users$/)
                    .respond([{name: 'userX'}, {name: 'userY'}], {'A-Token': 'xxx'});
                TestModel.api.findAll().then((resp) => {
                    expect(resp).to.be.instanceof(Array);
                    expect(resp[0]).to.be.instanceof(TestModel);
                    done();
                });
                httpBackend.flush();
            });

            it('should return all models from the response', (done) => {
                httpBackend.expect('GET', /.*\/users$/)
                    .respond([{name: 'userX'}, {name: 'userY'}], {'A-Token': 'xxx'});
                TestModel.api.findAll().then((resp) => {
                    expect(resp).to.have.property('length', 2);
                    expect(resp[0].attributes).to.have.property('name', 'userX');
                    expect(resp[1].attributes).to.have.property('name', 'userY');
                    done();
                });
                httpBackend.flush();
            });

        });

    });

    describe('relations', () => {

        interface IRelationModelAttributes {
            id: string;
            text: string;
        }

        interface IRelationModel extends IAbstractModel<IRelationModelAttributes> {}

        class RelationModel extends AbstractModel<IRelationModelAttributes, IRelationModel> {
            public rootUrl: string = 'posts';
            protected fillAbles (): IModelFillAbles {
                return {
                    id: IModelFillAblesTypes.STRING,
                    text: IModelFillAblesTypes.STRING
                };
            }
        }

        describe('allRelation', () => {

            it('should trigger corresponding GET request', () => {
                const readMethod = sinon.spy(httpService, 'read');
                TestModel.api.allRelation(12, RelationModel);
                expect(readMethod).to.have.been.calledOnce;
                expect(readMethod).to.have.been.calledWith('/users/12/posts');
            });

            it('should return promise that resolves to relation models', (done) => {
                httpBackend.expect('GET', /.*\/users\/12\/posts$/)
                    .respond([{text: 'bla'}, {text: 'blob'}]);
                TestModel.api.allRelation(12, RelationModel).then((resp) => {
                    expect(resp).to.be.instanceof(Array);
                    expect(resp[0]).to.be.instanceof(RelationModel);
                    done();
                });
                httpBackend.flush();
            });

            it('parent=true: should trigger corresponding GET request', () => {
                const readMethod = sinon.spy(httpService, 'read');
                TestModel.api.allRelation(12, RelationModel, true);
                expect(readMethod).to.have.been.calledOnce;
                expect(readMethod).to.have.been.calledWith('/posts/12/users');
            });

            it('parent=true: should return promise that resolves to models', (done) => {
                httpBackend.expect('GET', /.*\/posts\/12\/users$/)
                    .respond([{name: 'userX'}, {name: 'userY'}]);
                TestModel.api.allRelation(12, RelationModel, true).then((resp) => {
                    expect(resp).to.be.instanceof(Array);
                    expect(resp[0]).to.be.instanceof(TestModel);
                    done();
                });
                httpBackend.flush();
            });

        });

        describe('findRelation', () => {

            it('should trigger corresponding GET request', () => {
                const readMethod = sinon.spy(httpService, 'read');
                TestModel.api.findRelation(12, RelationModel, 66);
                expect(readMethod).to.have.been.calledOnce;
                expect(readMethod).to.have.been.calledWith('/users/12/posts/66');
            });

            it('should return promise that resolves to relation model', (done) => {
                httpBackend.expect('GET', /.*\/users\/12\/posts\/66$/)
                    .respond({text: 'bla'});
                TestModel.api.findRelation(12, RelationModel, 66).then((resp) => {
                    expect(resp).to.be.instanceof(RelationModel);
                    done();
                });
                httpBackend.flush();
            });

            it('parent=true: should trigger corresponding GET request', () => {
                const readMethod = sinon.spy(httpService, 'read');
                TestModel.api.findRelation(12, RelationModel, 66, true);
                expect(readMethod).to.have.been.calledOnce;
                expect(readMethod).to.have.been.calledWith('/posts/66/users/12');
            });

            it('parent=true: should return promise that resolves to model', (done) => {
                httpBackend.expect('GET', /.*\/posts\/66\/users\/12$/)
                    .respond({name: 'userX'});
                TestModel.api.findRelation(12, RelationModel, 66, true).then((resp) => {
                    expect(resp).to.be.instanceof(TestModel);
                    done();
                });
                httpBackend.flush();
            });

        });

    });

    describe('conversation to type', () => {

        describe('String', () => {

            const testData = [
                ['boolean', true, 'true'],
                ['string', 'some-string', 'some-string'],
                ['number', 55, '55']
            ];

            testData.forEach((data) => {
                const [fromType, given, expected] = data;
                it(`should support String from ${fromType}`, () => {
                    const tModel = new TestModel({name: given});
                    tModel.attributes.num = 3.33;
                    expect(tModel.attributes).to.have.property('name', expected);
                    expect(tModel.attributes.name).to.be.a('string');
                });
            });

            //TODO FIX: null could appear
            xit(`should support String from null`, () => {
                /* tslint:disable no-null-keyword*/
                const tModel = new TestModel({name: null});
                /* tslint:enable */
                expect(tModel.attributes).to.have.property('name', '');
                expect(tModel.attributes.name).to.be.a('string');
            });

        });

        it('should support Number', () => {
            const tModel = new TestModel({num: '22'});
            expect(tModel.attributes).to.have.property('num', 22);
            expect(tModel.attributes.num).to.be.a('number');
        });

        it('should support Boolean', () => {
            const tModel = new TestModel({active: 'true'});
            expect(tModel.attributes).to.have.property('active', true);
            expect(tModel.attributes.active).to.be.a('boolean');
        });

        it('should support Float', () => {
            const tModel = new TestModel({floatNum: '1.23'});
            expect(tModel.attributes).to.have.property('floatNum', 1.23);
            expect(tModel.attributes.floatNum).to.be.a('number');
        });

    });

});
