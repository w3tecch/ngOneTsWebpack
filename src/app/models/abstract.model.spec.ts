/* tslint:disable:no-null-keyword */
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import * as moment from 'moment';
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

    describe('identifier', () => {

        describe('exclusion from requests', () => {

            class IdentifierModel extends TestModel {
                constructor (attrs?: Object) {
                    super(attrs);
                    this.identifier = 'name';
                }
            }

            it('should happen by default for identifier "id"', () => {
                const updateMethod = sinon.spy(httpService, 'update');
                const model = new TestModel({id: 55, name: 'Pippi'});
                model.save();
                expect(updateMethod).to.have.been.calledOnce;
                expect(updateMethod).to.have.been.calledWith('/users/55', {name: 'Pippi'});
            });

            it('should be done for configured identifier', () => {
                const updateMethod = sinon.spy(httpService, 'update');
                const model = new IdentifierModel({name: 'Pippi', num: 55});
                model.save();
                expect(updateMethod).to.have.been.calledOnce;
                expect(updateMethod).to.have.been.calledWith('/users/Pippi', {num: 55});
            });

        });

        it('should be included in requests when configured', () => {
            class SendIdentifierModel extends TestModel {
                constructor (attrs?: Object) {
                    super(attrs);
                    this.httpSendIdentifier = true;
                }
            }
            const updateMethod = sinon.spy(httpService, 'update');
            const model = new SendIdentifierModel({id: 69, name: 'Pippi'});
            model.save();
            expect(updateMethod).to.have.been.calledOnce;
            expect(updateMethod).to.have.been.calledWith('/users/69', {id: 69, name: 'Pippi'});
        });

    });

    describe('httpNotSendData', () => {

        class HttpNoSendDataModel extends TestModel {
            constructor (attrs?: Object) {
                super(attrs);
                this.httpNotSendData = this.httpNotSendData.concat(['name', 'active']);
            }
        }

        it('exclude properties "createdAt", "updatedAt" by default', () => {
            const createMethod = sinon.spy(httpService, 'create');
            const model = new TestModel({
                name: 'Pippi', num: 25,
                createdAt: 'just now', updatedAt: 'never'
            });
            model.save();
            expect(createMethod).to.have.been.calledOnce;
            expect(createMethod).to.have.been.calledWith('/users', {name: 'Pippi', num: 25});
        });

        it('exclude specified properties when sending a request via update', () => {
            const updateMethod = sinon.spy(httpService, 'update');
            const model = new HttpNoSendDataModel({
                id: 1, name: 'Pippi', num: 25, active: true, floatNum: 99.9
            });
            model.save();
            expect(updateMethod).to.have.been.calledOnce;
            expect(updateMethod).to.have.been.calledWith('/users/1', {floatNum: 99.9, num: 25});
        });

        it('exclude specified properties when sending a request via save', () => {
            const createMethod = sinon.spy(httpService, 'create');
            const model = new HttpNoSendDataModel({
                name: 'Pippi', num: 25, active: true, floatNum: 99.9
            });
            model.save();
            expect(createMethod).to.have.been.calledOnce;
            expect(createMethod).to.have.been.calledWith('/users', {floatNum: 99.9, num: 25});
        });

    });

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

    describe('conversion', () => {

        interface IComplexModelAttrs {
            name: string;
            config: {
                env: string;
            };
            languages: Array<string>;
            num: number;
            active: boolean;
            floatNum: number;
            date: moment.Moment;
        }
        interface IComplexModel extends IAbstractModel<IComplexModelAttrs> {};
        class ComplexModel extends AbstractModel<IComplexModelAttrs, IComplexModel> {
            public rootUrl = 'complex';
            public static api = new ComplexModel();
            protected fillAbles(): IModelFillAbles {
                return {
                    name: IModelFillAblesTypes.STRING,
                    config: IModelFillAblesTypes.OBJECT,
                    languages: IModelFillAblesTypes.ARRAY,
                    num: IModelFillAblesTypes.NUMBER,
                    active: IModelFillAblesTypes.BOOL,
                    floatNum: IModelFillAblesTypes.FLOAT,
                    date: IModelFillAblesTypes.DATE
                };
            }
        }

        describe('to type', () => {

            describe('of nullable values', () => {
                const testData = [
                    ['name', IModelFillAblesTypes.STRING],
                    ['config', IModelFillAblesTypes.OBJECT],
                    ['languages', IModelFillAblesTypes.ARRAY],
                    ['num', IModelFillAblesTypes.NUMBER],
                    ['active', IModelFillAblesTypes.BOOL],
                    ['floatNum', IModelFillAblesTypes.FLOAT],
                    ['date', IModelFillAblesTypes.DATE]
                ];

                testData.forEach((data) => {
                    const [prop, type] = data;
                    it(`should convert null-${IModelFillAblesTypes[type]} to undefined`, () => {
                        const model = new ComplexModel({}[prop] = null);
                        expect(model.attributes).to.have.property(<string>prop, undefined);
                    });
                });

            });

            describe('String', () => {

                const testData = [
                    ['boolean', true, 'true'],
                    ['string', 'some-string', 'some-string'],
                    ['number', 55, '55']
                ];

                testData.forEach((data) => {
                    const [fromType, given, expected] = data;
                    it(`should support String from ${fromType}`, () => {
                        const model = new ComplexModel({name: given});
                        expect(model.attributes).to.have.property('name', expected);
                        expect(model.attributes.name).to.be.a('string');
                    });
                });

            });

            describe('Number', () => {

                const validTypes = [22, 22.5, '22', '22.5'];

                validTypes.forEach((validType) => {
                    it(`should create 22 from value ${validType} of type ${typeof validType}`, () => {
                        const model = new ComplexModel({num: validType});
                        expect(model.attributes).to.have.property('num', 22);
                        expect(model.attributes.num).to.be.a('number');
                    });
                });

                const invalidTypes = [
                    [true, 'boolean'], [{}, 'object'],
                    ['test', 'NaN string'], [[], 'array']
                ];

                invalidTypes.forEach((invalidType) => {
                    const [value, type] = invalidType;
                    it(`should throw error if the input type is ${type}`, () => {
                        expect(() => new ComplexModel({num: value})).to.throw(TypeError);
                    });
                });

            });

            describe('Boolean', () => {

                const validTypes = [
                    [true, 'boolean', true], [false, 'boolean', false],
                    ['true', 'string', true], ['false', 'string', false],
                    [1, 'number', true], [0, 'number', false]
                ];

                validTypes.forEach((validType) => {
                    const [input, type, output] = validType;
                    it(`should create boolean ${output} from value ${input} of type ${type}`, () => {
                        const model = new ComplexModel({active: input});
                        expect(model.attributes.active).to.be.a('boolean');
                        expect(model.attributes).to.have.property('active', output);
                    });
                });

                const invalidTypes = [[{}, 'object'], [[], 'Array']];

                invalidTypes.forEach((invalidType) => {
                    const [value, type] = invalidType;
                    it(`should throw Error if input type is ${type}`, () => {
                        expect(() => new ComplexModel({active: value})).to.throw(TypeError);
                    });
                });

            });

            describe('Float', () => {

                const validTypes = [[22, 22], [22.5, 22.5], ['22', 22], ['22.5', 22.5]];

                validTypes.forEach((validType) => {
                    const [input, output] = validType;
                    it(`should create ${output} from value ${input} of type ${typeof input}`, () => {
                        const model = new ComplexModel({floatNum: validType});
                        expect(model.attributes).to.have.property('floatNum', output);
                        expect(model.attributes.floatNum).to.be.a('number');
                    });
                });

                const invalidTypes = [
                    [true, 'boolean'], [{}, 'object'],
                    ['test', 'NaN string'], [[], 'array']
                ];

                invalidTypes.forEach((invalidType) => {
                    const [value, type] = invalidType;
                    it(`should throw error if the input type is ${type}`, () => {
                        expect(() => new ComplexModel({num: value})).to.throw(TypeError);
                    });
                });

            });

            describe('Object', () => {

                const testData = [
                    ['object', {env: 'dev-testing'}],
                    ['json-string', '{"env": "dev-testing"}']
                ];

                testData.forEach((data) => {
                    const [fromType, given] = data;
                    it(`should support Object from ${fromType}`, () => {
                        const model = new ComplexModel({config: given});
                        expect(model.attributes.config).to.be.a('object');
                        expect(model.attributes.config.env).to.be.a('string');
                        expect(model.attributes.config).to.have.property('env', 'dev-testing');
                    });
                });

                it(`should throw Error if input is not json string or object`, () => {
                    expect(() => new ComplexModel({config: 99})).to.throw(TypeError);
                });

                it(`should throw Error if input is array`, () => {
                    expect(() => new ComplexModel({config: [1, 2]})).to.throw(TypeError);
                });

            });

            describe('Array', () => {
                it('should support Array from array', () => {
                    const model = new ComplexModel({languages: ['DE', 'EN']});
                    expect(model.attributes.languages).to.be.instanceOf(Array);
                    expect(model.attributes.languages).to.have.property('length', 2);
                    expect(model.attributes.languages[0]).to.equal('DE');
                    expect(model.attributes.languages[1]).to.equal('EN');
                });

                const invalidTypes = [22, true, {}, 'test'];

                invalidTypes.forEach((invalidType) => {
                    it(`should throw error if the input type is ${typeof invalidType}`, () => {
                        expect(() => new ComplexModel({languages: invalidType})).to.throw(TypeError);
                    });
                });
            });

            describe('Date', () => {
                it('should support Date from ISO 8601 string', () => {
                    const model = new ComplexModel({date: '2016-04-17T13:29:07+00:00'});
                    const date = model.attributes.date;
                    expect(date.isValid()).to.be.true;
                });

                it('should support Date from moment object', () => {
                    const date = moment();
                    const model = new ComplexModel();
                    model.attributes.date = date;
                    expect(model.attributes.date.isValid()).to.be.true;
                });
            });

        });

        describe('to http', () => {

            describe('Date', () => {

                it('should support Date from moment object', () => {
                    const model = new ComplexModel();
                    model.attributes.date = <any>'2016-04-17T13:29:07+00:00';
                    const convertSpy = sinon.spy(model, 'convertToHttpType');
                    model.save();
                    const convertedDateString = convertSpy.returnValues[0];
                    expect(convertedDateString).to.be.a('string');
                    expect(moment(convertedDateString).isValid()).to.be.true;
                });

                it('should support Date from moment object', () => {
                    const date = moment();
                    const model = new ComplexModel();
                    model.attributes.date = date;
                    const convertSpy = sinon.spy(model, 'convertToHttpType');
                    model.save();
                    const convertedDateString = convertSpy.returnValues[0];
                    expect(convertedDateString).to.be.a('string');
                    expect(moment(convertedDateString).isValid()).to.be.true;
                });

            });

        });

        describe('nested types', () => {

            interface IDeepModelAttributes {
                id: number;
                name: string;
                level1: {
                    someBool: boolean;
                    someArr: Array<string>;
                    level2: {
                        someString: string
                        date: moment.Moment;
                    }
                };
            }

            interface IDeepModel extends IAbstractModel<IDeepModelAttributes> {}

            class DeepModel extends AbstractModel<IDeepModelAttributes, IDeepModel> {
                public static api = new DeepModel();
                public rootUrl = 'users';
                protected fillAbles(): IModelFillAbles {
                    return {
                        id: IModelFillAblesTypes.NUMBER,
                        name: IModelFillAblesTypes.STRING,
                        level1: {
                            someBool: IModelFillAblesTypes.BOOL,
                            someArr: IModelFillAblesTypes.ARRAY,
                            level2: {
                                someString: IModelFillAblesTypes.STRING,
                                date: IModelFillAblesTypes.DATE
                            }
                        }
                    };
                }
            }

            it('should convert nested objects according to fillAbles structure', () => {
                const model = new DeepModel(
                    {name: 'test',
                        level1: {
                            someBool: 'true',
                            someArr: ['a', 'b'],
                            level2: {
                                someString: 'hello'
                            }
                        }
                    }
                );
                expect(model.attributes.level1).to.have.property('someBool', true);
                expect(model.attributes.level1.someArr).to.be.instanceof(Array);
                expect(model.attributes.level1.someArr).to.have.property('0', 'a');
                expect(model.attributes.level1.someArr).to.have.property('1', 'b');
                expect(model.attributes.level1.level2).to.have.property('someString', 'hello');
            });

            it('should throw an Error if type mismatch in nested object', () => {
                expect(() =>
                    new DeepModel(
                        {
                            level1: {
                                someArr: true
                            }
                        }
                    )
                ).to.throw(TypeError);
            });

            it('should use nested conversion to http', () => {
                const date = moment();
                const model = new DeepModel(
                    {
                        level1: {
                            level2: {
                            }
                        }
                    }
                );
                model.attributes.level1.level2.date = date;
                const createSpy = sinon.spy(model, 'create');
                model.save();
                const attrObject = createSpy.args[0][0];
                expect(attrObject).to.be.a('object');
                const convertedDate = attrObject.level1.level2.date;
                expect(convertedDate).is.a('string');
                expect(moment(convertedDate).isValid()).to.be.true;
            });

            it('should create empty structure according to IModelFillAbles definition', () => {
                const model = new DeepModel();
                expect(model.attributes).to.have.property('name');
                expect(model.attributes).to.have.property('level1');
                expect(model.attributes.level1).to.have.property('someBool');
                expect(model.attributes.level1).to.have.property('someArr');
                expect(model.attributes.level1).to.have.property('level2');
                expect(model.attributes.level1.level2).to.have.property('someString');
                expect(model.attributes.level1.level2).to.have.property('date');
            });

            it('should be handled by bulkUpdateAttrs', () => {
                const model = new DeepModel({id: 25, level1: {someArr: ['a']}});
                model.bulkUpdateAttrs({name: 'example', level1: {someBool: true}});
                expect(model.attributes).to.have.property('id', 25);
                expect(model.attributes).to.have.property('name', 'example');
                expect(model.attributes.level1).to.have.property('someArr');
                expect(model.attributes.level1).to.have.property('someBool', true);
            });

        });

    });

});

describe('abstract.model-invalid response data', () => {
    let httpService: IHttpUtilService;
    let httpBackend: ng.IHttpBackendService;

    beforeEach(() => {
        angular.mock.module('app',
            // set mocked exceptionHandler mode to log, otherwise errors will be re-thrown
            // which breaks the promise chain
            $exceptionHandlerProvider => $exceptionHandlerProvider.mode('log'));
        angular.mock.inject(['$httpBackend', httpServiceName,
            ($httpBackend: ng.IHttpBackendService, _httpService_: IHttpUtilService) => {
                httpBackend = $httpBackend;
                httpService = _httpService_;
            }]);
    });

    describe('convert to type fails', () => {

        it('handle invalid response data', (done) => {
            httpBackend.when('GET', /.*\/complex\/1$/).respond({name: null});
            TestModel.api.find(1).catch(() => {
                done();
            });
            httpBackend.flush();
        });
    });
});
