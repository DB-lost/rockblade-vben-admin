# @vben-core/form-ui

## OVERVIEW

Schema-driven form system built on VeeValidate + Zod. Part of @vben-core/ui-kit foundation. Zero workspace deps outside @vben-core/\*.

## STRUCTURE

```
src/
├── index.ts                  # Public exports: setupVbenForm, useVbenForm, z, types
├── types.ts                  # FormSchema, VbenFormProps, FormCommonConfig, dependencies
├── config.ts                 # COMPONENT_MAP, COMPONENT_BIND_EVENT_MAP, setupVbenForm adapter
├── form-api.ts               # FormApi class: Store-backed state, validation, schema CRUD
├── use-vben-form.ts          # useVbenForm composable: returns [FormComponent, api]
├── vben-form.vue             # Template component wrapping Form render + actions
├── vben-use-form.vue         # Internal component mounted by useVbenForm
├── use-form-context.ts       # provide/inject for form props and initial state
├── components/
│   └── form-actions.vue      # Submit, reset, collapse buttons
└── form-render/              # 8 files: core rendering engine
    ├── form.vue              # Grid wrapper, schema computation, collapsible logic
    ├── form-field.vue        # Individual field wrapper with VeeValidate binding
    ├── form-label.vue        # Label + required mark + colon
    ├── context.ts            # provideFormRenderProps
    ├── dependencies.ts       # Dynamic rule/prop/render recomputation
    ├── expandable.ts         # Collapsed rows measurement
    ├── helper.ts             # Zod rule extraction, default value resolution
    └── index.ts              # Form, FormField, FormLabel exports
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Add a new base component | `src/config.ts` | Register in COMPONENT_MAP and COMPONENT_BIND_EVENT_MAP |
| Change form layout/grid | `src/form-render/form.vue` | wrapperClass, formItemClass computed |
| Dynamic field rules | `src/types.ts` | FormItemDependencies with triggerFields |
| Programmatic form API | `src/form-api.ts` | setValues, validate, submitForm, updateSchema |
| Adapter registration | `src/config.ts` `setupVbenForm()` | Injected components from globalShareState |
| App v-model mapping | `apps/web-antdv-next/src/adapter/form.ts` | baseModelPropName, modelPropNameMap |
| Custom validation rules | `src/config.ts` `defineRules` | required, selectRequired via vee-validate defineRule |
| Form state store | `src/form-api.ts` | Store<VbenFormProps> with subscribe |

## CONVENTIONS

- Two entry patterns: `<VbenForm>` template or `useVbenForm()` returning `[Form, api]`
- FormApi state mutations go through `store.setState()`; never mutate `api.state` directly
- Schema arrays merged with `mergeWithArrayOverride`; object values override arrays
- Zod rules drive defaults via `zod-defaults`; extract with `getDefaultValueInZodStack`
- Component refs tracked in `componentRefMap` for focus and scroll-to-error
- Grid classes use Tailwind: `grid-cols-1`, `sm:grid-cols-2`, etc.
- FormField props inherit from FormCommonConfig; schema-level props override common config

## ANTI-PATTERNS

- DO NOT import @vben/\* or effects packages in this package. Foundation restriction.
- DO NOT mutate `formApi.state` directly. Use `formApi.setState()` or Store methods.
- DO NOT forget `fieldName` when calling `updateSchema()`. Every item must have it.
- DO NOT use Zod `ZodNullable` or `ZodOptional` to mean optional UI. They flip `required` flag.
- DO NOT skip `setupVbenForm()` in app bootstrap. Forms break without registered component map.
- DO NOT rely on template-based forms. All fields must be declared in `schema` array.
- DO NOT ignore `emptyStateValue` mismatch. Ant Design Vue uses `null`, others use `undefined`.
