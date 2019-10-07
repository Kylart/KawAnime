import vuex from 'vuex'

/**
 * Concatenate prefix with name. Name will have its first letter set to upper case.
 *
 * @param {string} prefix prefix to use
 * @param {string} name Name to apply it to
 * @returns {string}
 */
function addPrefix (prefix, name) {
  return [
    prefix,
    name.charAt(0).toUpperCase() + name.slice(1)
  ].join('')
}

/**
 * Correctly format a method allowing aliases if needed. To make an alias,
 * simply put name = ['myRealName', 'myAlias'].
 *
 * @param {string} prefix Prefix to use
 * @param {string|[string]} name Name or name with alias
 * @returns
 */
function format (prefix, name) {
  const hasAlias = Array.isArray(name)

  const realName = hasAlias ? name[0] : name
  const alias = hasAlias && name[1]

  return {
    [addPrefix(prefix, alias || realName)]: realName
  }
}

/**
 * Helpers function to automatically format vuex store map.
 *
 * @export
 * @param {string} name Namespace of the substore
 * @param {string} prefix Prefix to use to format the name of the methods
 * @param {object} methods
 * @param {[string]} methods.actions
 * @param {[string]} methods.mutations
 * @param {[string]} methods.getters
 * @param {[string]} methods.state
 * @returns
 */
export default function (name, prefix, { actions = [], getters = [], mutations = [], state = [] }) {
  const { mapActions, mapGetters, mapMutations, mapState } = name ? vuex.createNamespacedHelpers(name) : vuex

  return {
    actions: mapActions(actions.reduce((acc, action) => Object.assign(acc, format(prefix, action)), {})),
    mutations: mapMutations(mutations.reduce((acc, mutation) => Object.assign(acc, format(prefix, mutation)), {})),
    getters: mapGetters(getters.reduce((acc, getter) => Object.assign(acc, format(prefix, getter)), {})),
    state: mapState(state.reduce((acc, value) => Object.assign(acc, format(prefix, value)), {}))
  }
}
