'use strict'

const attributes = require('./attributes')

/**
 * A `[key, value]` pair of strings describing a text attribute.
 *
 * @typedef {[string, string]} Attribute
 */

/**
 * A concatenated sequence of zero or more attribute identifiers, each one represented by an
 * asterisk followed by a base-36 encoded attribute number.
 *
 * Examples: '', '*0', '*3*j*z*1q'
 *
 * @typedef {string} AttributeString
 */

/**
 * Convenience class to convert an Op's attribute string to/from a Map of key, value pairs.
 */
class AttributeMap extends Map {
	/**
	 * Converts an attribute string into an AttributeMap.
	 *
	 * @param {AttributeString} str - The attribute string to convert into an AttributeMap.
	 * @param {AttributePool} pool - Attribute pool.
	 * @returns {AttributeMap}
	 */
	static fromString(str, pool) {
		return new AttributeMap(pool).updateFromString(str)
	}

	/**
	 * @param {AttributePool} pool - Attribute pool.
	 */
	constructor(pool) {
		super()
		/** @public */
		this.pool = pool
	}

	/**
	 * @param {string} k - Attribute name.
	 * @param {string} v - Attribute value.
	 * @returns {AttributeMap} `this` (for chaining).
	 */
	set(k, v) {
		k = k == null ? '' : String(k)
		v = v == null ? '' : String(v)
		this.pool.putAttrib([k, v])
		return super.set(k, v)
	}

	toString() {
		return attributes.attribsToString(attributes.sort([...this]), this.pool)
	}

	/**
	 * @param {Iterable<Attribute>} entries - [key, value] pairs to insert into this map.
	 * @param {boolean} [emptyValueIsDelete] - If true and an entry's value is the empty string, the
	 *     key is removed from this map (if present).
	 * @returns {AttributeMap} `this` (for chaining).
	 */
	update(entries, emptyValueIsDelete = false) {
		for (let [k, v] of entries) {
			k = k == null ? '' : String(k)
			v = v == null ? '' : String(v)
			if (!v && emptyValueIsDelete) {
				this.delete(k)
			} else {
				this.set(k, v)
			}
		}
		return this
	}

	/**
	 * @param {AttributeString} str - The attribute string identifying the attributes to insert into
	 *     this map.
	 * @param {boolean} [emptyValueIsDelete] - If true and an entry's value is the empty string, the
	 *     key is removed from this map (if present).
	 * @returns {AttributeMap} `this` (for chaining).
	 */
	updateFromString(str, emptyValueIsDelete = false) {
		return this.update(
			attributes.attribsFromString(str, this.pool),
			emptyValueIsDelete
		)
	}
}

module.exports = AttributeMap
