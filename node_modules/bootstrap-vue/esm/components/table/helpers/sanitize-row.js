import { arrayIncludes } from '../../../utils/array';
import { isArray, isFunction } from '../../../utils/inspect';
import { clone, keys, pick } from '../../../utils/object';
import { IGNORED_FIELD_KEYS } from './constants'; // Return a copy of a row after all reserved fields have been filtered out

export var sanitizeRow = function sanitizeRow(row, ignoreFields, includeFields) {
  var fieldsObj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // We first need to format the row based on the field configurations
  // This ensures that we add formatted values for keys that may not
  // exist in the row itself
  var formattedRow = keys(fieldsObj).reduce(function (result, key) {
    var field = fieldsObj[key];
    var filterByFormatted = field.filterByFormatted;
    var formatter = isFunction(filterByFormatted) ?
    /* istanbul ignore next */
    filterByFormatted : filterByFormatted ?
    /* istanbul ignore next */
    field.formatter : null;

    if (isFunction(formatter)) {
      result[key] = formatter(row[key], key, row);
    }

    return result;
  }, clone(row)); // Determine the allowed keys:
  //   - Ignore special fields that start with `_`
  //   - Ignore fields in the `ignoreFields` array
  //   - Include only fields in the `includeFields` array

  var allowedKeys = keys(formattedRow).filter(function (key) {
    return !IGNORED_FIELD_KEYS[key] && !(isArray(ignoreFields) && ignoreFields.length > 0 && arrayIncludes(ignoreFields, key)) && !(isArray(includeFields) && includeFields.length > 0 && !arrayIncludes(includeFields, key));
  });
  return pick(formattedRow, allowedKeys);
};