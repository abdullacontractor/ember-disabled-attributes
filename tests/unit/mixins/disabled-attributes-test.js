import EmberObject from '@ember/object';
import DisabledAttributesMixin from 'ember-disabled-attributes/mixins/disabled-attributes';
import { module, test } from 'qunit';
import { get, computed } from '@ember/object';

module('Unit | Mixin | disabled-attributes', function() {
  // Replace this with your real tests.
  test('undefined disabled specification', function (assert) {
    let DisabledAttributesObject = EmberObject.extend(DisabledAttributesMixin);
    let subject = DisabledAttributesObject.create();
    assert.ok(subject);
    assert.notOk(get(subject, 'disabledAttributes'));
  });

  test('empty disabled specification', function (assert) {
    let DisabledAttributesObject = EmberObject.extend(DisabledAttributesMixin);
    let subject = DisabledAttributesObject.create({
      disabled: {},
    });
    assert.ok(subject);
    assert.deepEqual(get(subject, 'disabledAttributes'), {});
  });

  test('basic is matcher test', function (assert) {
    let DisabledAttributesObject = EmberObject.extend(DisabledAttributesMixin);
    let subject = DisabledAttributesObject.create({
      name: 'Tom',
      status: 'archived',
      disabled: {
        name: {
          status: {
            is: 'archived',
            message: 'Cannot change name when status is archived',
          },
        },
      },
    });
    assert.ok(subject);
    assert.deepEqual(get(subject, 'disabledAttributes'), {
      name: 'Cannot change name when status is archived',
    });
  });

  test('basic not matcher test', function (assert) {
    let DisabledAttributesObject = EmberObject.extend(DisabledAttributesMixin);
    let subject = DisabledAttributesObject.create({
      name: 'Tom',
      status: 'archived',
      disabled: {
        name: {
          status: {
            not: 'active',
            message: 'Cannot change name when status is not active',
          },
        },
      },
    });
    assert.ok(subject);
    assert.deepEqual(get(subject, 'disabledAttributes'), {
      name: 'Cannot change name when status is not active',
    });
  });

  test('basic in matcher test', function (assert) {
    let DisabledAttributesObject = EmberObject.extend(DisabledAttributesMixin);
    let subject = DisabledAttributesObject.create({
      name: 'Tom',
      status: 'archived',
      disabled: {
        name: {
          status: {
            in: ['archived', 'void'],
          },
        },
      },
    });
    assert.ok(subject);
    assert.deepEqual(get(subject, 'disabledAttributes'), {
      name: 'This field is disabled',
    });
  });

  test('basic not in matcher test', function (assert) {
    let DisabledAttributesObject = EmberObject.extend(DisabledAttributesMixin);
    let subject = DisabledAttributesObject.create({
      name: 'Tom',
      status: 'archived',
      disabled: {
        name: {
          status: {
            not_in: ['active', 'disabled'],
          },
        },
      },
    });
    assert.ok(subject);
    assert.deepEqual(get(subject, 'disabledAttributes'), {
      name: 'This field is disabled',
    });
  });

  test('and matcher test', function (assert) {
    let DisabledAttributesObject = EmberObject.extend(DisabledAttributesMixin);
    let subject = DisabledAttributesObject
    .extend({
      isActivePublished: computed('status', 'published', function() {
        return this.get('status') === 'active' && this.get('published');
      }),
    })
    .create({
      name: 'Tom',
      status: 'active',
      published: true,

      disabled: {
        name: {
          isActivePublished: {
            is: true,
          },
        },
      },
    });
    assert.ok(subject);
    assert.deepEqual(get(subject, 'disabledAttributes'), {
      name: 'This field is disabled',
    });
  });
});
