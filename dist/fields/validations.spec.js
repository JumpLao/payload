"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations_1 = require("./validations");
const minLengthMessage = (length) => `This value must be longer than the minimum length of ${length} characters.`;
const maxLengthMessage = (length) => `This value must be shorter than the max length of ${length} characters.`;
const minValueMessage = (value, min) => `"${value}" is less than the min allowed value of ${min}.`;
const maxValueMessage = (value, max) => `"${value}" is greater than the max allowed value of ${max}.`;
const requiredMessage = 'This field is required.';
const validNumberMessage = 'Please enter a valid number.';
let options = {
    operation: 'create',
    data: undefined,
    siblingData: undefined,
};
describe('Field Validations', () => {
    describe('text', () => {
        it('should validate', () => {
            const val = 'test';
            const result = (0, validations_1.text)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, { ...options, required: true });
            expect(result).toBe(requiredMessage);
        });
        it('should handle undefined', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, options);
            expect(result).toBe(true);
        });
        it('should validate maxLength', () => {
            const val = 'toolong';
            const result = (0, validations_1.text)(val, { ...options, maxLength: 5 });
            expect(result).toBe(maxLengthMessage(5));
        });
        it('should validate minLength', () => {
            const val = 'short';
            const result = (0, validations_1.text)(val, { ...options, minLength: 10 });
            expect(result).toBe(minLengthMessage(10));
        });
        it('should validate maxLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, { ...options, maxLength: 5 });
            expect(result).toBe(true);
        });
        it('should validate minLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, { ...options, minLength: 10 });
            expect(result).toBe(true);
        });
    });
    describe('textarea', () => {
        options = { ...options, field: { type: 'textarea', name: 'test' } };
        it('should validate', () => {
            const val = 'test';
            const result = (0, validations_1.textarea)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, { ...options, required: true });
            expect(result).toBe(requiredMessage);
        });
        it('should handle undefined', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, options);
            expect(result).toBe(true);
        });
        it('should validate maxLength', () => {
            const val = 'toolong';
            const result = (0, validations_1.textarea)(val, { ...options, maxLength: 5 });
            expect(result).toBe(maxLengthMessage(5));
        });
        it('should validate minLength', () => {
            const val = 'short';
            const result = (0, validations_1.textarea)(val, { ...options, minLength: 10 });
            expect(result).toBe(minLengthMessage(10));
        });
        it('should validate maxLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, { ...options, maxLength: 5 });
            expect(result).toBe(true);
        });
        it('should validate minLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, { ...options, minLength: 10 });
            expect(result).toBe(true);
        });
    });
    describe('password', () => {
        options.type = 'password';
        options.name = 'test';
        it('should validate', () => {
            const val = 'test';
            const result = (0, validations_1.password)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, { ...options, required: true });
            expect(result).toBe(requiredMessage);
        });
        it('should handle undefined', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, options);
            expect(result).toBe(true);
        });
        it('should validate maxLength', () => {
            const val = 'toolong';
            const result = (0, validations_1.password)(val, { ...options, maxLength: 5 });
            expect(result).toBe(maxLengthMessage(5));
        });
        it('should validate minLength', () => {
            const val = 'short';
            const result = (0, validations_1.password)(val, { ...options, minLength: 10 });
            expect(result).toBe(minLengthMessage(10));
        });
        it('should validate maxLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, { ...options, maxLength: 5 });
            expect(result).toBe(true);
        });
        it('should validate minLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, { ...options, minLength: 10 });
            expect(result).toBe(true);
        });
    });
    describe('point', () => {
        options.type = 'point';
        options.name = 'point';
        it('should validate numbers', () => {
            const val = ['0.1', '0.2'];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should validate strings that could be numbers', () => {
            const val = ['0.1', '0.2'];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message when undefined', () => {
            const val = undefined;
            const result = (0, validations_1.point)(val, { ...options, required: true });
            expect(result).not.toBe(true);
        });
        it('should show required message when array', () => {
            const val = [];
            const result = (0, validations_1.point)(val, { ...options, required: true });
            expect(result).not.toBe(true);
        });
        it('should show required message when array of undefined', () => {
            const val = [undefined, undefined];
            const result = (0, validations_1.point)(val, { ...options, required: true });
            expect(result).not.toBe(true);
        });
        it('should handle undefined not required', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, options);
            expect(result).toBe(true);
        });
        it('should handle empty array not required', () => {
            const val = [];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should handle array of undefined not required', () => {
            const val = [undefined, undefined];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should prevent text input', () => {
            const val = ['bad', 'input'];
            const result = (0, validations_1.point)(val, options);
            expect(result).not.toBe(true);
        });
        it('should prevent missing value', () => {
            const val = [0.1];
            const result = (0, validations_1.point)(val, options);
            expect(result).not.toBe(true);
        });
    });
    describe('select', () => {
        options.type = 'select';
        options.options = ['one', 'two', 'three'];
        const optionsRequired = {
            ...options,
            required: true,
            options: [{
                    value: 'one',
                    label: 'One',
                }, {
                    value: 'two',
                    label: 'two',
                }, {
                    value: 'three',
                    label: 'three',
                }],
        };
        const optionsWithEmptyString = {
            ...options,
            options: [{
                    value: '',
                    label: 'None',
                }, {
                    value: 'option',
                    label: 'Option',
                }],
        };
        it('should allow valid input', () => {
            const val = 'one';
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input', () => {
            const val = 'bad';
            const result = (0, validations_1.select)(val, options);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow null input', () => {
            const val = null;
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should allow undefined input', () => {
            let val;
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should prevent empty string input', () => {
            const val = '';
            const result = (0, validations_1.select)(val, options);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent undefined input with required', () => {
            let val;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent empty string input with required', () => {
            const result = (0, validations_1.select)('', optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent undefined input with required and hasMany', () => {
            let val;
            options.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent empty array input with required and hasMany', () => {
            optionsRequired.hasMany = true;
            const result = (0, validations_1.select)([], optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent empty string array input with required and hasMany', () => {
            options.hasMany = true;
            const result = (0, validations_1.select)([''], optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent null input with required and hasMany', () => {
            const val = null;
            options.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow valid input with option objects', () => {
            const val = 'one';
            options.hasMany = false;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input with option objects', () => {
            const val = 'bad';
            options.hasMany = false;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow empty string input with option object', () => {
            const val = '';
            const result = (0, validations_1.select)(val, optionsWithEmptyString);
            expect(result).toStrictEqual(true);
        });
        it('should allow empty string input with option object and required', () => {
            const val = '';
            optionsWithEmptyString.required = true;
            const result = (0, validations_1.select)(val, optionsWithEmptyString);
            expect(result).toStrictEqual(true);
        });
        it('should allow valid input with hasMany', () => {
            const val = ['one', 'two'];
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input with hasMany', () => {
            const val = ['one', 'bad'];
            const result = (0, validations_1.select)(val, options);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow valid input with hasMany option objects', () => {
            const val = ['one', 'three'];
            optionsRequired.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input with hasMany option objects', () => {
            const val = ['three', 'bad'];
            optionsRequired.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
    });
    describe('number', () => {
        options.type = 'number';
        options.name = 'test';
        it('should validate', () => {
            const val = 1;
            const result = (0, validations_1.number)(val, options);
            expect(result).toBe(true);
        });
        it('should validate', () => {
            const val = 1.5;
            const result = (0, validations_1.number)(val, options);
            expect(result).toBe(true);
        });
        it('should show invalid number message', () => {
            const val = 'test';
            const result = (0, validations_1.number)(val, { ...options });
            expect(result).toBe(validNumberMessage);
        });
        it('should handle empty value', () => {
            const val = "";
            const result = (0, validations_1.number)(val, { ...options });
            expect(result).toBe(true);
        });
        it('should handle required value', () => {
            const val = "";
            const result = (0, validations_1.number)(val, { ...options, required: true });
            expect(result).toBe(validNumberMessage);
        });
        it('should validate minValue', () => {
            const val = 2.4;
            const result = (0, validations_1.number)(val, { ...options, min: 2.5 });
            expect(result).toBe(minValueMessage(val, 2.5));
        });
        it('should validate maxValue', () => {
            const val = 1.25;
            const result = (0, validations_1.number)(val, { ...options, max: 1 });
            expect(result).toBe(maxValueMessage(val, 1));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbnMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWVsZHMvdmFsaWRhdGlvbnMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUFnRjtBQUdoRixNQUFNLGdCQUFnQixHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyx3REFBd0QsTUFBTSxjQUFjLENBQUM7QUFDMUgsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMscURBQXFELE1BQU0sY0FBYyxDQUFDO0FBQ3ZILE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLDJDQUEyQyxHQUFHLEdBQUcsQ0FBQztBQUNuSCxNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQWEsRUFBRSxHQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyw4Q0FBOEMsR0FBRyxHQUFHLENBQUM7QUFDdEgsTUFBTSxlQUFlLEdBQUcseUJBQXlCLENBQUM7QUFDbEQsTUFBTSxrQkFBa0IsR0FBRyw4QkFBOEIsQ0FBQztBQUMxRCxJQUFJLE9BQU8sR0FBbUM7SUFDNUMsU0FBUyxFQUFFLFFBQVE7SUFDbkIsSUFBSSxFQUFFLFNBQVM7SUFDZixXQUFXLEVBQUUsU0FBUztDQUN2QixDQUFDO0FBRUYsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNwQixFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1lBQ3pCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztZQUNuQixNQUFNLE1BQU0sR0FBRyxJQUFBLGtCQUFJLEVBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFD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