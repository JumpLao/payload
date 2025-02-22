"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mimeTypeValidator_1 = require("./mimeTypeValidator");
const getBaseUploadFields = ({ config, collection }) => {
    const uploadOptions = typeof collection.upload === 'object' ? collection.upload : {};
    const mimeType = {
        name: 'mimeType',
        label: 'MIME Type',
        type: 'text',
        admin: {
            readOnly: true,
            disabled: true,
        },
    };
    const url = {
        name: 'url',
        label: 'URL',
        type: 'text',
        admin: {
            readOnly: true,
            disabled: true,
        },
    };
    const width = {
        name: 'width',
        label: 'Width',
        type: 'number',
        admin: {
            readOnly: true,
            disabled: true,
        },
    };
    const height = {
        name: 'height',
        label: 'Height',
        type: 'number',
        admin: {
            readOnly: true,
            disabled: true,
        },
    };
    const filesize = {
        name: 'filesize',
        label: 'File Size',
        type: 'number',
        admin: {
            readOnly: true,
            disabled: true,
        },
    };
    const filename = {
        name: 'filename',
        label: 'File Name',
        type: 'text',
        index: true,
        unique: true,
        admin: {
            readOnly: true,
            disabled: true,
        },
    };
    let uploadFields = [
        {
            ...url,
            hooks: {
                afterRead: [
                    ({ data }) => {
                        if (data === null || data === void 0 ? void 0 : data.filename) {
                            return `${config.serverURL}${uploadOptions.staticURL}/${data.filename}`;
                        }
                        return undefined;
                    },
                ],
            },
        },
        filename,
        mimeType,
        filesize,
    ];
    if (uploadOptions.mimeTypes) {
        mimeType.validate = (0, mimeTypeValidator_1.mimeTypeValidator)(uploadOptions.mimeTypes);
    }
    if (uploadOptions.imageSizes) {
        uploadFields = uploadFields.concat([
            width,
            height,
            {
                name: 'sizes',
                label: 'Sizes',
                type: 'group',
                admin: {
                    disabled: true,
                },
                fields: uploadOptions.imageSizes.map((size) => ({
                    label: size.name,
                    name: size.name,
                    type: 'group',
                    admin: {
                        disabled: true,
                    },
                    fields: [
                        {
                            ...url,
                            hooks: {
                                afterRead: [
                                    ({ data }) => {
                                        var _a, _b;
                                        const sizeFilename = (_b = (_a = data === null || data === void 0 ? void 0 : data.sizes) === null || _a === void 0 ? void 0 : _a[size.name]) === null || _b === void 0 ? void 0 : _b.filename;
                                        if (sizeFilename) {
                                            return `${config.serverURL}${uploadOptions.staticURL}/${sizeFilename}`;
                                        }
                                        return undefined;
                                    },
                                ],
                            },
                        },
                        width,
                        height,
                        mimeType,
                        filesize,
                        {
                            ...filename,
                            unique: false,
                        },
                    ],
                })),
            },
        ]);
    }
    return uploadFields;
};
exports.default = getBaseUploadFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QmFzZUZpZWxkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91cGxvYWRzL2dldEJhc2VGaWVsZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwyREFBd0Q7QUFReEQsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBVyxFQUFXLEVBQUU7SUFDdkUsTUFBTSxhQUFhLEdBQXVCLE9BQU8sVUFBVSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUV6RyxNQUFNLFFBQVEsR0FBVTtRQUN0QixJQUFJLEVBQUUsVUFBVTtRQUNoQixLQUFLLEVBQUUsV0FBVztRQUNsQixJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFLElBQUk7U0FDZjtLQUNGLENBQUM7SUFFRixNQUFNLEdBQUcsR0FBVTtRQUNqQixJQUFJLEVBQUUsS0FBSztRQUNYLEtBQUssRUFBRSxLQUFLO1FBQ1osSUFBSSxFQUFFLE1BQU07UUFDWixLQUFLLEVBQUU7WUFDTCxRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7S0FDRixDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQVU7UUFDbkIsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsT0FBTztRQUNkLElBQUksRUFBRSxRQUFRO1FBQ2QsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsSUFBSTtTQUNmO0tBQ0YsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFVO1FBQ3BCLElBQUksRUFBRSxRQUFRO1FBQ2QsS0FBSyxFQUFFLFFBQVE7UUFDZixJQUFJLEVBQUUsUUFBUTtRQUNkLEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFLElB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