ember-disabled-attributes
==============================================================================
[![npm version](https://badge.fury.io/js/ember-disabled-attributes.svg)](https://badge.fury.io/js/ember-disabled-attributes) 

This addon provides a straightforward syntax to specifiy criterea for disabling attributes on a model. The general idea being to offload decision making about the business logic that would disable things straight to the data layer.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-disabled-attributes
```


Usage
------------------------------------------------------------------------------
To use the addon, extend the `DisabledAttributesMixin` and include a `disabled` hash (this can be a computed property if it needs to be).
```javascript
import DS from 'ember-data';
import DisabledAttributesMixin from 'ember-disabled-attributes'
const { Model, attr } = DS;

export default Model.extend(DisabledAttributesMixin, {
  status: attr('string'),
  onlineId: attr('string'),
  firstName: attr('string'),
  lastName: attr('string'),
  birthday:  attr('date'),

  disabled: {
    onlineId: {
      status: {
        not: 'disabled',
        message: 'Please disable the user before changing online id',
      },
    },
    firstName: {
      status: {
        is: 'archived',
      },
    },
    lastName: {
      status: {
        is: 'archived',
      },
    },
    birthday: {
      status: {
        is: 'abc123',
      },
    },
  },
});
```
The mixin would then inject a computed property called `disabledAttributes` that would watch `status` and `disabled` to yield something like 
```
disabledAttributes: {
  onlineId: 'Please disable the user before changing online id',
  firstName: 'This field is disabled',
  lastName: 'This field is disabled',
  birthday: null,
}
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
