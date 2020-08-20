const app = getApp();
const {
  logger,
  utils,
  request,
  deviceHelper,
} = app;

Component({

  properties: {

  },

  data: {

  },

  methods: {
    // ########################################
    onLoad: function (options) {
      logger.log('onLoad');
    },

    onShow: function () {
      logger.log('onLoad');
    },

    onReachBottom: function () {
      logger.log('onReachBottom');
    },

    onShareAppMessage: function () {
      logger.log('onShareAppMessage');
      return {};
    },
  }
})