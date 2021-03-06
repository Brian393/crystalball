import { getField, updateField } from 'vuex-map-fields';

const state = {
  sidebarState: true,
  sidebarHtml: {},
  postIcons: [],
  config: {}
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  toggle(state) {
    // console.log('store toggle!!')
    state.sidebarState = !state.sidebarState;
  },
  setSidebarInitialState(state, initialState) {
    state.sidebarState = initialState;
  },
  updateField
};

const actions = {
  toggle(context) {
    context.commit('toggle');
  }
};

// getters are functions
const getters = {
  sidebarState: state => state.sidebarState,
  sidebarHtml: state => state.sidebarHtml,
  postIcons: (state, getters, rootState, rootGetters) => {
    const activeGroup = rootGetters['map/activeLayerGroup'].navbarGroup;
    const filteredIcons = state.postIcons.filter(i =>
      i.group.includes(activeGroup)
    );
    return filteredIcons;
  },
  getField
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
