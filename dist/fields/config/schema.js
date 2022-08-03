"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ui = exports.date = exports.richText = exports.blocks = exports.relationship = exports.point = exports.checkbox = exports.upload = exports.array = exports.group = exports.tabs = exports.collapsible = exports.row = exports.radio = exports.select = exports.code = exports.email = exports.textarea = exports.number = exports.text = exports.idField = exports.baseField = exports.baseAdminFields = void 0;
const joi_1 = __importDefault(require("joi"));
const componentSchema_1 = require("../../utilities/componentSchema");
exports.baseAdminFields = joi_1.default.object().keys({
    description: joi_1.default.alternatives().try(joi_1.default.string(), componentSchema_1.componentSchema),
    position: joi_1.default.string().valid('sidebar'),
    width: joi_1.default.string(),
    style: joi_1.default.object().unknown(),
    className: joi_1.default.string(),
    readOnly: joi_1.default.boolean().default(false),
    hidden: joi_1.default.boolean().default(false),
    disabled: joi_1.default.boolean().default(false),
    condition: joi_1.default.func(),
    components: joi_1.default.object().keys({
        Cell: componentSchema_1.componentSchema,
        Field: componentSchema_1.componentSchema,
        Filter: componentSchema_1.componentSchema,
    }).default({}),
});
exports.baseField = joi_1.default.object().keys({
    label: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.valid(false)),
    required: joi_1.default.boolean().default(false),
    saveToJWT: joi_1.default.boolean().default(false),
    unique: joi_1.default.boolean().default(false),
    localized: joi_1.default.boolean().default(false),
    index: joi_1.default.boolean().default(false),
    hidden: joi_1.default.boolean().default(false),
    validate: joi_1.default.func(),
    access: joi_1.default.object().keys({
        create: joi_1.default.func(),
        read: joi_1.default.func(),
        update: joi_1.default.func(),
    }),
    hooks: joi_1.default.object()
        .keys({
        beforeValidate: joi_1.default.array().items(joi_1.default.func()).default([]),
        beforeChange: joi_1.default.array().items(joi_1.default.func()).default([]),
        afterChange: joi_1.default.array().items(joi_1.default.func()).default([]),
        afterRead: joi_1.default.array().items(joi_1.default.func()).default([]),
    }).default(),
    admin: exports.baseAdminFields.default(),
}).default();
exports.idField = exports.baseField.keys({
    name: joi_1.default.string().valid('id'),
    type: joi_1.default.string().valid('text', 'number'),
    required: joi_1.default.not(false, 0).default(true),
    localized: joi_1.default.invalid(true),
});
exports.text = exports.baseField.keys({
    type: joi_1.default.string().valid('text').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.func()),
    minLength: joi_1.default.number(),
    maxLength: joi_1.default.number(),
    admin: exports.baseAdminFields.keys({
        placeholder: joi_1.default.string(),
        autoComplete: joi_1.default.string(),
    }),
});
exports.number = exports.baseField.keys({
    type: joi_1.default.string().valid('number').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.func()),
    min: joi_1.default.number(),
    max: joi_1.default.number(),
    admin: exports.baseAdminFields.keys({
        placeholder: joi_1.default.string(),
        autoComplete: joi_1.default.string(),
        step: joi_1.default.number(),
    }),
});
exports.textarea = exports.baseField.keys({
    type: joi_1.default.string().valid('textarea').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.func()),
    minLength: joi_1.default.number(),
    maxLength: joi_1.default.number(),
    admin: exports.baseAdminFields.keys({
        placeholder: joi_1.default.string(),
        rows: joi_1.default.number(),
    }),
});
exports.email = exports.baseField.keys({
    type: joi_1.default.string().valid('email').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.func()),
    minLength: joi_1.default.number(),
    maxLength: joi_1.default.number(),
    admin: exports.baseAdminFields.keys({
        placeholder: joi_1.default.string(),
        autoComplete: joi_1.default.string(),
    }),
});
exports.code = exports.baseField.keys({
    type: joi_1.default.string().valid('code').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.func()),
    admin: exports.baseAdminFields.keys({
        language: joi_1.default.string(),
    }),
});
exports.select = exports.baseField.keys({
    type: joi_1.default.string().valid('select').required(),
    name: joi_1.default.string().required(),
    options: joi_1.default.array().items(joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.object({
        value: joi_1.default.string().required().allow(''),
        label: joi_1.default.string().required(),
    }))).required(),
    hasMany: joi_1.default.boolean().default(false),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.string().allow(''), joi_1.default.array().items(joi_1.default.string().allow('')), joi_1.default.func()),
    admin: exports.baseAdminFields.keys({
        isClearable: joi_1.default.boolean().default(false),
    }),
});
exports.radio = exports.baseField.keys({
    type: joi_1.default.string().valid('radio').required(),
    name: joi_1.default.string().required(),
    options: joi_1.default.array().items(joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.object({
        value: joi_1.default.string().required().allow(''),
        label: joi_1.default.string().required(),
    }))).required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.string().allow(''), joi_1.default.func()),
    admin: exports.baseAdminFields.keys({
        layout: joi_1.default.string().valid('vertical', 'horizontal'),
    }),
});
exports.row = exports.baseField.keys({
    type: joi_1.default.string().valid('row').required(),
    fields: joi_1.default.array().items(joi_1.default.link('#field')),
    admin: exports.baseAdminFields.default(),
});
exports.collapsible = exports.baseField.keys({
    label: joi_1.default.string().required(),
    type: joi_1.default.string().valid('collapsible').required(),
    fields: joi_1.default.array().items(joi_1.default.link('#field')),
    admin: exports.baseAdminFields.default(),
});
exports.tabs = exports.baseField.keys({
    type: joi_1.default.string().valid('tabs').required(),
    fields: joi_1.default.forbidden(),
    tabs: joi_1.default.array().items(joi_1.default.object({
        label: joi_1.default.string().required(),
        fields: joi_1.default.array().items(joi_1.default.link('#field')).required(),
        description: joi_1.default.alternatives().try(joi_1.default.string(), componentSchema_1.componentSchema),
    })).required(),
    admin: exports.baseAdminFields.keys({
        description: joi_1.default.forbidden(),
    }),
});
exports.group = exports.baseField.keys({
    type: joi_1.default.string().valid('group').required(),
    name: joi_1.default.string().required(),
    fields: joi_1.default.array().items(joi_1.default.link('#field')),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.object(), joi_1.default.func()),
    admin: exports.baseAdminFields.keys({
        hideGutter: joi_1.default.boolean().default(true),
        description: joi_1.default.string(),
    }),
});
exports.array = exports.baseField.keys({
    type: joi_1.default.string().valid('array').required(),
    name: joi_1.default.string().required(),
    minRows: joi_1.default.number(),
    maxRows: joi_1.default.number(),
    fields: joi_1.default.array().items(joi_1.default.link('#field')),
    labels: joi_1.default.object({
        singular: joi_1.default.string(),
        plural: joi_1.default.string(),
    }),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.object()), joi_1.default.func()),
});
exports.upload = exports.baseField.keys({
    type: joi_1.default.string().valid('upload').required(),
    relationTo: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    maxDepth: joi_1.default.number(),
    filterOptions: joi_1.default.alternatives().try(joi_1.default.object(), joi_1.default.func()),
});
exports.checkbox = exports.baseField.keys({
    type: joi_1.default.string().valid('checkbox').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.func()),
});
exports.point = exports.baseField.keys({
    type: joi_1.default.string().valid('point').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.number()).max(2).min(2), joi_1.default.func()),
});
exports.relationship = exports.baseField.keys({
    type: joi_1.default.string().valid('relationship').required(),
    hasMany: joi_1.default.boolean().default(false),
    relationTo: joi_1.default.alternatives().try(joi_1.default.string().required(), joi_1.default.array().items(joi_1.default.string())),
    name: joi_1.default.string().required(),
    maxDepth: joi_1.default.number(),
    filterOptions: joi_1.default.alternatives().try(joi_1.default.object(), joi_1.default.func()),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.func()),
});
exports.blocks = exports.baseField.keys({
    type: joi_1.default.string().valid('blocks').required(),
    minRows: joi_1.default.number(),
    maxRows: joi_1.default.number(),
    name: joi_1.default.string().required(),
    labels: joi_1.default.object({
        singular: joi_1.default.string(),
        plural: joi_1.default.string(),
    }),
    blocks: joi_1.default.array().items(joi_1.default.object({
        slug: joi_1.default.string().required(),
        imageURL: joi_1.default.string(),
        imageAltText: joi_1.default.string(),
        labels: joi_1.default.object({
            singular: joi_1.default.string(),
            plural: joi_1.default.string(),
        }),
        fields: joi_1.default.array().items(joi_1.default.link('#field')),
    })),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.object()), joi_1.default.func()),
});
exports.richText = exports.baseField.keys({
    type: joi_1.default.string().valid('richText').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.object()), joi_1.default.func()),
    admin: exports.baseAdminFields.keys({
        placeholder: joi_1.default.string(),
        hideGutter: joi_1.default.boolean().default(true),
        elements: joi_1.default.array().items(joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.object({
            name: joi_1.default.string().required(),
            Button: componentSchema_1.componentSchema,
            Element: componentSchema_1.componentSchema,
            plugins: joi_1.default.array().items(componentSchema_1.componentSchema),
        }))),
        leaves: joi_1.default.array().items(joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.object({
            name: joi_1.default.string().required(),
            Button: componentSchema_1.componentSchema,
            Leaf: componentSchema_1.componentSchema,
            plugins: joi_1.default.array().items(componentSchema_1.componentSchema),
        }))),
        upload: joi_1.default.object({
            collections: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.object().keys({
                fields: joi_1.default.array().items(joi_1.default.link('#field')),
            })),
        }),
    }),
});
exports.date = exports.baseField.keys({
    type: joi_1.default.string().valid('date').required(),
    name: joi_1.default.string().required(),
    defaultValue: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.func()),
    admin: exports.baseAdminFields.keys({
        placeholder: joi_1.default.string(),
        date: joi_1.default.object({
            displayFormat: joi_1.default.string(),
            pickerAppearance: joi_1.default.string(),
            minDate: joi_1.default.date(),
            maxDate: joi_1.default.date(),
            minTime: joi_1.default.date(),
            maxTime: joi_1.default.date(),
            timeIntervals: joi_1.default.number(),
            timeFormat: joi_1.default.string(),
            monthsToShow: joi_1.default.number(),
        }),
    }),
});
exports.ui = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    label: joi_1.default.string(),
    type: joi_1.default.string().valid('ui').required(),
    admin: joi_1.default.object().keys({
        position: joi_1.default.string().valid('sidebar'),
        width: joi_1.default.string(),
        condition: joi_1.default.func(),
        components: joi_1.default.object().keys({
            Cell: componentSchema_1.componentSchema,
            Field: componentSchema_1.componentSchema,
        }).default({}),
    }).default(),
});
const fieldSchema = joi_1.default.alternatives()
    .try(exports.text, exports.number, exports.textarea, exports.email, exports.code, exports.select, exports.group, exports.array, exports.row, exports.collapsible, exports.tabs, exports.radio, exports.relationship, exports.checkbox, exports.upload, exports.richText, exports.blocks, exports.date, exports.point, exports.ui)
    .id('field');
exports.default = fieldSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZpZWxkcy9jb25maWcvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFzQjtBQUN0QixxRUFBa0U7QUFFckQsUUFBQSxlQUFlLEdBQUcsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztJQUMvQyxXQUFXLEVBQUUsYUFBRyxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FDakMsYUFBRyxDQUFDLE1BQU0sRUFBRSxFQUNaLGlDQUFlLENBQ2hCO0lBQ0QsUUFBUSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ3ZDLEtBQUssRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO0lBQ25CLEtBQUssRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFO0lBQzdCLFNBQVMsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO0lBQ3ZCLFFBQVEsRUFBRSxhQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUN0QyxNQUFNLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDcEMsUUFBUSxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ3RDLFNBQVMsRUFBRSxhQUFHLENBQUMsSUFBSSxFQUFFO0lBQ3JCLFVBQVUsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQzVCLElBQUksRUFBRSxpQ0FBZTtRQUNyQixLQUFLLEVBQUUsaUNBQWU7UUFDdEIsTUFBTSxFQUFFLGlDQUFlO0tBQ3hCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0NBQ2YsQ0FBQyxDQUFDO0FBRVUsUUFBQSxTQUFTLEdBQUcsYUFBRyxDQUFDLE1B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