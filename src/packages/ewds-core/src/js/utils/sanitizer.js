/* eslint-disable */
/**
 * A simple library to help you escape HTML using template strings.
 */

const Sanitizer = {
  _entity: /[&<>"'/]/g,

  _entities: {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
    "/": "&#x2F;",
  },

  getEntity: function (s) {
    return Sanitizer._entities[s];
  },

  /**
   * Escapes HTML for all values in a tagged template string.
   */
  escapeHTML: function (strings, ...values) {
    let result = "";

    for (let i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i < values.length) {
        const value = values[i] || "";
        result += String(value).replace(Sanitizer._entity, Sanitizer.getEntity);
      }
    }

    return result;
  },

  /**
   * Escapes HTML and returns a wrapped object to be used during DOM insertion
   */
  createSafeHTML: function (strings, ...values) {
    const escaped = Sanitizer.escapeHTML(strings, ...values);
    return {
      __html: escaped,
      toString: () => "[object WrappedHTMLObject]",
      info:
        "This is a wrapped HTML object. See https://developer.mozilla.org/en-US/Firefox_OS/Security/Security_Automation for more.",
    };
  },

  /**
   * Unwrap safe HTML created by createSafeHTML or a custom replacement that
   * underwent security review.
   */
  unwrapSafeHTML: function (...htmlObjects) {
    return htmlObjects.map((obj) => obj.__html).join("");
  },
};

// ✅ Export as ES module
export default Sanitizer;
