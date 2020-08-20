const app = getApp();
const {
  logger,
  utils,
  request,
  deviceHelper,
} = app;

const tabbarItems = [{
  id: "home",
  iconPath: "./images/home.png",
  selectedIconPath: "./images/home_hl.png",
  txt: "首页",
  dot: true,
}, {
  id: "attention",
  iconPath: "./images/attention.png",
  selectedIconPath: "./images/attention_hl.png",
  txt: "关注",
  badge: '99',
}, {
  id: "category",
  iconPath: "./images/category.png",
  selectedIconPath: "./images/category_hl.png",
  txt: "分类",
}, {
  id: "chat",
  iconPath: "./images/chat.png",
  selectedIconPath: "./images/chat_hl.png",
  txt: "聊天",
}, {
  id: "mine",
  iconPath: "./images/mine.png",
  selectedIconPath: "./images/mine_hl.png",
  txt: "个人中心",
}, ];

Page({
  data: {
    tabbarItems, // tabbar的显示数据
    curTabbarItemId: '', // 当前tabbarItem

    navTil: "",
    navBg: "rgba(255, 255, 255, 0);",
    navPlaceholder: true,
  },

  onLoad: function (options) {
    // 第一次执行时，不主动回调onShow
    this.isFirstLoad = true;

    // 默认隐藏右上角的分享菜单
    wx.hideShareMenu({});

    let curTabbarItemId = "";
    const pageType = parseInt(options.pageType, 10) || 1;
    switch (pageType) {
      case 2:
        curTabbarItemId = 'attention';
        break;
      case 3:
        curTabbarItemId = "category";
        break;
      case 4:
        curTabbarItemId = "chat";
        break;
      case 5:
        curTabbarItemId = "mine";
        break;
      case 1:
      default:
        curTabbarItemId = "home";
        break;
    }

    const uData = this.getPageNavData(curTabbarItemId);
    // 判断当前手机是否为没有实体home键的iphone
    uData.isNoHomeIphone = !!deviceHelper.getNoHomeIphone();
    deviceHelper.getDeviceParams();
    uData.curTabbarItemId = curTabbarItemId;
    this.setData(uData);

    this.onPageCompLoad(options);
  },

  onShow: function () {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    this.callHookOfPageComp("onShow");
  },

  onPullDownRefresh: function() {
    this.callHookOfPageComp("onPullDownRefresh");
  },

  onReachBottom: function () {
    this.callHookOfPageComp("onReachBottom");
  },

  onPageScroll(e) {
    // 防抖更新页面顶部nav
    const scrollTop = e.scrollTop;
    // logger.log("=========== onPageScroll ", scrollTop);
    const that = this;
    const pData = that.data;
    const uData = that.getPageNavData(pData.curTabbarItemId, scrollTop < 28);
    that.setData(uData);
  },

  onShareAppMessage: function () {
    const { pageComp } = this.getCurPageComp();
    return pageComp.onShareAppMessage();
  },

  // ########################################

  debounce(fn, duration) {
    const that = this;
    duration = parseInt(duration, 10) || 300;

    let timer = null;
    return function () {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      } else {
        timer = setTimeout(() => {
          timer = null;
          fn.call(that, ...arguments);
        }, duration);
      }
    };
  },

  getPageNavData(curTabbarItemId, isTop = true) {
    //isTop: 是否显示导航栏
    const pData = this.data;
    // 若没有指定当前tab，则使用page上的数据
    curTabbarItemId = curTabbarItemId || pData.curTabbarItemId;
    const uData = {};
    let frontColor = "";
    switch (curTabbarItemId) {
      case "attention": // 关注
        uData.navPlaceholder = false;
        if (isTop) {
          uData.navTil = "";
          uData.navBg = "rgba(255, 255, 255, 0)";
          frontColor = "#ffffff";
        } else {
          uData.navTil = "关注";
          uData.navBg = "rgba(255, 255, 255, 1)";
          frontColor = "#000000";
        }
        break;

      case "category": // 分类
        uData.navTil = "分类";
        uData.navBg = "#fff";
        uData.navPlaceholder = true;
        frontColor = "#000000";
        break;

      case "chat": // 聊天
        uData.navTil = "聊天";
        uData.navBg = "#fff";
        uData.navPlaceholder = true;
        frontColor = "#000000";
        break;

      case "mine": // 个人中心
        uData.navPlaceholder = false;
        if (isTop) {
          uData.navTil = "";
          uData.navBg = "rgba(255, 255, 255, 0)";
          frontColor = "#ffffff";
        } else {
          uData.navTil = "个人中心";
          uData.navBg = "rgba(255, 255, 255, 1)";
          frontColor = "#000000";
        }
        break;

      case "home": // 首页
      default:
        uData.navPlaceholder = false;
        if (isTop) {
          uData.navTil = "";
          uData.navBg = "rgba(255, 255, 255, 0)";
          frontColor = "#ffffff";
        } else {
          uData.navTil = "首页";
          uData.navBg = "rgba(255, 255, 255, 1)";
          frontColor = "#000000";
        }
        break;
    }

    wx.setNavigationBarColor({
      frontColor,
      backgroundColor: "#ffffff",
    });
    // logger.log("pageNavData", uData);
    return uData;
  },

  onPageCompLoad(options) {
    this.callHookOfPageComp("onLoad", options);
  },

  callHookOfPageComp(funcName, options) {
    const pData = this.data;
    // logger.warn("callHookOfPageComp: ready to call funcName");
    const {
      pageComp,
      hadLoaded
    } = this.getCurPageComp();
    if (!pageComp) {
      logger.warn(
        "callHookOfPageComp: 当前tabarItem对应的组件没有找到"
      );
      return;
    }

    if (hadLoaded && funcName === "onLoad") {
      logger.log("如果页面组件已加载过，此时需要回调的为onShow");
      funcName = "onShow";
    }
    // logger.log("----------- callHookOfPageComp", funcName);
    const lifecycleFunc = pageComp[funcName];
    if (typeof lifecycleFunc != "function") {
      logger.warn(
        `当前tabarItem：${pData.curTabbarItemId}没有定义相应的生命周期${funcName}`
      );
    } else {
      // logger.warn(`当前tabarItem：${pData.curTabbarItemId}存在定义相应的生命周期${funcName}`);
      lifecycleFunc.apply(pageComp, [options]);
    }

    if (!hadLoaded && funcName === "onLoad") {
      // compPage首次加载时，需要再次回调onShow
      this.callHookOfPageComp("onShow");
    }
  },

  getCurPageComp() {
    const pData = this.data;
    const curTabbarItemId = pData.curTabbarItemId;
    const pageKeyName = `_pageComp_${curTabbarItemId}`;
    // 是否已经加载
    let hadLoaded = false;

    // 避免同一个pageComp多次调用API：selectComponent 造成性能浪费
    let pageComp = null;
    if (this[pageKeyName]) {
      pageComp = this[pageKeyName];
      hadLoaded = true;
    } else {
      const compId = `#${curTabbarItemId}`;
      // logger.log('compId:', compId);
      pageComp = this.selectComponent(compId);
      this[pageKeyName] = pageComp;
    }
    return {
      pageComp,
      hadLoaded,
    };
  },

  changeTabbarItem(e) {
    const dataset = e.currentTarget.dataset;
    const index = parseInt(dataset.index, 10) || 0;
    const pData = this.data;
    const tabbarItem = pData.tabbarItems[index];
    const tabbarId = tabbarItem.id;
    if (pData.curTabbarItemId === tabbarId) {
      logger.log("当前tabber-item已被选中");
      return;
    }
    // 将页面滑动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
    const uData = this.getPageNavData(tabbarId);
    uData.curTabbarItemId = tabbarId;
    this.setData(uData, () => {
      this.onPageCompLoad();
    });
  },
});