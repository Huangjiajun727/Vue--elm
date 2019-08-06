import {getStyle} from "../../config/mUtils";

export const loadMore = {
  directives: {
    'load-more': {
      bind:(el,binding) => {
        let windowHeight = window.screen.height;
        let scrollEl = document.body;               //外卖主页 滚动元素父级，用来判断滚动高度(网页被卷去的高)，只能为document.body
        let heightEl = el;                          //外卖主页 的滚动元素，用来判断滚动页面的‘内容实际高度’
        let height;
        let setTop;
        let paddingBottom;
        let marginBottom;
        let oldScroll;
        let requestFram;


        document.body.addEventListener('scroll',() => {
          loadStart();
        }, false);

        //运动开始时获取元素 高度 和 offseTop, pading, margin
        el.addEventListener('touchstart',() => {
          height = heightEl.clientHeight;
          setTop = el.offsetTop;
          paddingBottom = getStyle(el,'paddingBottom');
          marginBottom = getStyle(el,'marginBottom');
        },{passive: true});
        //运动过程中保持监听 scrollTop 的值判断是否到达底部
        el.addEventListener('touchmove',() => {
          loadStart();
        },{passive: true});
        //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
        el.addEventListener('touchend',() => {
          oldScroll = scrollEl.scrollTop;
          moveEnd();
        },{passive: true});

        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => {
            if (scrollEl.scrollTop != oldScroll){
              oldScroll = scrollEl.scrollTop;
              moveEnd();
            }else {
              cancelAnimationFrame(requestFram);
              //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
              height = heightEl.clientHeight;
              loadStart();
            }
          });
        };

        const loadStart = () => {
          if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
            binding.value();
          }
        }

      }
    }
  }
};

export const getImgPath = {
  methods: {
    //传递过来的图片地址需要处理后才能正常使用
    getImgPath(path) {
      let suffix;
      if (!path) {
        return '//elm.cangdu.org/img/default.jpg'
      }
      if (path.indexOf('jpeg') !== -1) {
        suffix = '.jpeg'
      } else {
        suffix = '.png'
      }
      let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
      return 'https://fuss10.elemecdn.com' + url
    },
  }

};
