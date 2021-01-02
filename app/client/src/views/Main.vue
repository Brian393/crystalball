<template>
  <v-app id="wg-app" data-app :class="{ 'wg-app': true }">
    <v-expand-transition>
      <v-navigation-drawer
        v-model="drawer"
        :width="!selectedCoorpNetworkEntity ? 460 : 600"
        class="elevation-6"
        :color="$appConfig.app.sideBar.backgroundColor"
        stateless
        app
        clipped
        right
      >
        <side-panel></side-panel>
      </v-navigation-drawer>
    </v-expand-transition>

    <v-app-bar app clipped-right height="60" :color="color.primary" dark>
      <v-toolbar-title
        @click="goToHome()"
        flat
        :style="`background-color:${color.primary};text-color:white;`"
        class="logo headline font-weight-bold gray--text mr-3 dark"
        >{{ $appConfig.app.title }}</v-toolbar-title
      >
      <!--       <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            small
            depressed
            fab
            color="rgb(228, 76, 107)"
            class="ml-0"
            @click="openWebsite()"
            ><v-icon medium>fas fa-question</v-icon></v-btn
          > </template
        ><span>Open Website</span>
      </v-tooltip>                 -->

      <v-spacer></v-spacer>
      <div v-for="(navbarGroup, index) in navbarGroups" :key="index">
        <v-btn
          min-width="200"
          class="mx-10"
          :dark="
            activeLayerGroup.navbarGroup === navbarGroup.name ? false : true
          "
          @click="changeNavbarGroup(navbarGroup)"
          :color="
            activeLayerGroup.navbarGroup === navbarGroup.name
              ? 'white'
              : color.primary
          "
          :class="{
            'elevation-0': activeLayerGroup.navbarGroup !== navbarGroup.name,
            'font-weight-bold black--text':
              activeLayerGroup.navbarGroup === navbarGroup.name,
            'elevation-6': activeLayerGroup.navbarGroup === navbarGroup.name
          }"
        >
          {{ navbarGroup.title }}
        </v-btn>
      </div>
      <v-spacer></v-spacer><v-spacer></v-spacer>

      <!--      <span class="title pr-5">before it's too late</span>  -->
      <v-btn icon @click.stop="drawer = !drawer"
        ><v-icon medium>{{ drawer ? '$close' : '$menu' }}</v-icon></v-btn
      >
    </v-app-bar>

    <v-content>
      <v-container style="max-height: 100%;" fluid fill-height class="pa-0">
        <app-viewer />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { EventBus } from '../EventBus.js';
import Viewer from '../components/viewer/viewer';
import SidePanel from '../components/core/SidePanel';
//Store imports
import { mapMutations, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export default {
  name: 'wg-app',
  props: ['navbarGroup', 'region'],
  computed: {
    ...mapFields('map', {
      selectedCoorpNetworkEntity: 'selectedCoorpNetworkEntity',
      isEditingPost: 'isEditingPost',
      isEditingHtml: 'isEditingHtml',
      navbarGroups: 'navbarGroups',
      regions: 'regions',
      geoserverWorkspace: 'geoserverWorkspace'
    }),
    ...mapGetters('map', {
      activeLayerGroup: 'activeLayerGroup'
    })
  },
  components: {
    'app-viewer': Viewer,
    'side-panel': SidePanel
  },
  data() {
    return {
      drawer: this.$appConfig.app.sideBar.isVisible,
      color: this.$appConfig.app.color
    };
  },
  methods: {
    goToHome() {
      if (this.$router.currentRoute.name === 'urban_ecology') {
        EventBus.$emit('resetMap');
      }
      this.$router.push({ name: 'urban_ecology' });
    },
    openWebsite() {
      window.open('https://its.timetochange.today', '_blank');
    },
    zoomToLocation() {
      if (this.region === 'local') {
        EventBus.$emit('zoomToLocation');
      }
    },
    changeNavbarGroup(navbarGroup) {
      this.$router.push({ path: `/${navbarGroup.name}` });
      EventBus.$emit('noMapReset');
    },
    ...mapMutations('map', {
      setActiveLayerGroup: 'SET_ACTIVE_LAYERGROUP'
    })
  },
  created() {
    // Navgroups
    const groups = this.$appConfig.map.groups;
    const groupTitles = this.$appConfig.map.groupTitles;
    const navbarGroups = [];
    Object.keys(groups).forEach(groupName => {
      navbarGroups.push({
        name: groupName,
        title: groupTitles[groupName] || groupName
      });
    });
    this.navbarGroups = navbarGroups;
    // Regions
    const regionTitles = this.$appConfig.map.regionTitles;
    Object.keys(regionTitles).forEach(regionName => {
      this.regions.push({
        name: regionName,
        title: regionTitles[regionName]
      });
    });
    console.log(this.regions);
    console.log(this.navbarGroups);
    // Geoserver workspace
    this.geoserverWorkspace = this.$appConfig.map.geoserverWorkspace;
    // Set active layer group
    this.setActiveLayerGroup({
      navbarGroup: this.navbarGroup,
      region: this.region
    });
  },
  watch: {
    $route(newValue, oldValue) {
      if (oldValue.path === newValue.path) {
        return;
      }
      this.setActiveLayerGroup({
        navbarGroup: this.navbarGroup,
        region: this.region
      });
      this.zoomToLocation();
    }
  },
  mounted() {
    // inform registered cmps that the app is mounted and the dynamic
    // components are available
    EventBus.$emit('app-mounted');
  }
};
</script>