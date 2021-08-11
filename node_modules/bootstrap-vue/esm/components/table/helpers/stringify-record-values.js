import { isObject } from '../../../utils/inspect';
import { stringifyObjectValues } from '../../../utils/stringify-object-values';
import { sanitizeRow } from './sanitize-row'; // Stringifies the values of a record, ignoring any special top level field keys
// TODO: Add option to stringify `scopedSlot` items

export var stringifyRecordValues = function stringifyRecordValues(row, ignoreFields, includeFields, fieldsObj) {
  return isObject(row) ? stringifyObjectValues(sanitizeRow(row, ignoreFields, includeFields, fieldsObj)) :
  /* istanbul ignore next */
  '';
};