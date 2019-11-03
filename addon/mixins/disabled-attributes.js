import Mixin from '@ember/object/mixin';
import { computed, defineProperty } from '@ember/object';
import { isEmpty } from '@ember/utils';

/**
 * disabled-attributes consumes a `disabled` specification hash defined on a model,
 * and generates a `disabledAttributes` hash which is just a hash with model properties as keys
 * and string messages as values. A `null` value for a key in `disabledAttributes` means it is not disabled.
 *
 * `disabled` specification hash structure:
 * {
 *   propertyToDisable: {
 *     dependantProperty: {
 *       matcher: propertyValue,
 *       message: "Your Message here",
 *     },
 *   },
 * }
 *
 * `dependantProperty` must be of a primitive data type
 *
 * Supported Matchers:
 * - is: Accepts string propertyValue
 * - not: Accepts string propertyValue
 * - in: Accepts [] propertyValue
 * - not_in: Accepts [] propertyValue
 */
export default Mixin.create({
  disabled: null,

  init() {
    this._super(...arguments);
    if (isEmpty(this.get('disabled'))) { return }

    const dependantProperties = `${this.get('keysToObserve').join(',')}`;
    const computedDisabledAttributes = computed(dependantProperties, 'disabled', function() {
      let disableSpecifications = this.get('disabled');
      let disabledHash = {};
      for (var property in disableSpecifications) {
        if (disableSpecifications.hasOwnProperty(property)) {
          let propertyDisabledConditions = disableSpecifications[property];
          for (var condition in propertyDisabledConditions) {
            if (propertyDisabledConditions.hasOwnProperty(condition)) {
              disabledHash[property] = disabledHash[property]
                || this.evaluateDisabledCondition(condition, propertyDisabledConditions[condition]);
            }
          }
        }
      }
      return disabledHash;
    });

    return defineProperty(this, 'disabledAttributes', computedDisabledAttributes);
  },

  keysToObserve: computed('disabled', function() {
    let keys = Object.values(this.get('disabled'))
      .map((value) => Object.keys(value))
      .reduce(function(a, b) {
        if (b in a) {
          return a;
        } else {
          return a.concat(b);
        }
      }, []);
    return Array.from(new Set(keys));
  }),

  evaluateDisabledCondition(property, specifications) {
    let value = this.get(property);

    if (
      (specifications.hasOwnProperty('in') && specifications.in.includes(value))
      || (specifications.hasOwnProperty('not_in') && !specifications.not_in.includes(value))
      || (specifications.hasOwnProperty('not') && specifications.not !== value)
      || (specifications.hasOwnProperty('is') && specifications.is === value)
    ) {
      return specifications.message || 'This field is disabled';
    } else {
      return null;
    }
  },
});
