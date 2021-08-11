// --- General ---
export var RX_ARRAY_NOTATION = /\[(\d+)]/g;
export var RX_BV_PREFIX = /^(BV?)/;
export var RX_DIGITS = /^\d+$/;
export var RX_EXTENSION = /^\..+/;
export var RX_HASH = /^#/;
export var RX_HASH_ID = /^#[A-Za-z]+[\w\-:.]*$/;
export var RX_HTML_TAGS = /(<([^>]+)>)/gi;
export var RX_HYPHENATE = /\B([A-Z])/g;
export var RX_LOWER_UPPER = /([a-z])([A-Z])/g;
export var RX_NUMBER = /^[0-9]*\.?[0-9]+$/;
export var RX_PLUS = /\+/g;
export var RX_REGEXP_REPLACE = /[-/\\^$*+?.()|[\]{}]/g;
export var RX_SPACES = /[\s\uFEFF\xA0]+/g;
export var RX_SPACE_SPLIT = /\s+/;
export var RX_STAR = /\/\*$/;
export var RX_START_SPACE_WORD = /(\s|^)(\w)/g;
export var RX_TRIM_LEFT = /^\s+/;
export var RX_TRIM_RIGHT = /\s+$/;
export var RX_UNDERSCORE = /_/g;
export var RX_UN_KEBAB = /-(\w)/g; // --- Date ---
// Loose YYYY-MM-DD matching, ignores any appended time inforation
// Matches '1999-12-20', '1999-1-1', '1999-01-20T22:51:49.118Z', '1999-01-02 13:00:00'

export var RX_DATE = /^\d+-\d\d?-\d\d?(?:\s|T|$)/; // Used to split off the date parts of the YYYY-MM-DD string

export var RX_DATE_SPLIT = /-|\s|T/; // Time string RegEx (optional seconds)

export var RX_TIME = /^([0-1]?[0-9]|2[0-3]):[0-5]?[0-9](:[0-5]?[0-9])?$/; // --- URL ---
// HREFs must end with a hash followed by at least one non-hash character

export var RX_HREF = /^.*(#[^#]+)$/;
export var RX_ENCODED_COMMA = /%2C/g;
export var RX_ENCODE_REVERSE = /[!'()*]/g;
export var RX_QUERY_START = /^(\?|#|&)/; // --- Aspect ---

export var RX_ASPECT = /^\d+(\.\d*)?[/:]\d+(\.\d*)?$/;
export var RX_ASPECT_SEPARATOR = /[/:]/; // --- Grid ---

export var RX_COL_CLASS = /^col-/; // --- Icon ---

export var RX_ICON_PREFIX = /^BIcon/; // --- Locale ---

export var RX_STRIP_LOCALE_MODS = /-u-.+/;