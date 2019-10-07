import { createNamespacedHelpers } from 'vuex'

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
  const { mapActions, mapGetters, mapMutations, mapState } = createNamespacedHelpers(name)

  return {
    actions: mapActions(actions.reduce((acc, action) => ({ ...acc, [addPrefix(prefix, action)]: action }), {})),
    mutations: mapMutations(mutations.reduce((acc, mutation) => ({ ...acc, [addPrefix(prefix, mutation)]: mutation }), {})),
    getters: mapGetters(getters.reduce((acc, getter) => ({ ...acc, [addPrefix(prefix, getter)]: getter }), {})),
    state: mapState(state.reduce((acc, value) => ({ ...acc, [addPrefix(prefix, value)]: value }), {}))
  }
}
