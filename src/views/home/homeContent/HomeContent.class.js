import Utils from '@/module/utils/Utils.module';

export default {
  name: 'homeContent',

  components: {},
  data() {
    return {};
  },
  mounted() {
    this.bindEvent();
    this.handelrScrollbarStyle();
  },
  methods: {
    bindEvent() {},
    handelrScrollbarStyle() {
      this.$nextTick(() => {
        let $$iScrollHorizontalScrollbar = document.querySelector('.iScrollHorizontalScrollbar');
        let $$iScrollIndicator = document.querySelector('.home-content--scrollbar .iScrollHorizontalScrollbar .iScrollIndicator');

        if ($$iScrollIndicator.style.display === 'none') {
          $$iScrollHorizontalScrollbar.classList.add('hidden-scrollbar');
        }

        let throttle = Utils.of().throttle(mutations => {
          mutations.map(mutation => {
            if (mutation.type === 'attributes') {
              if (mutation.target.style.display === 'none') {
                $$iScrollHorizontalScrollbar.classList.add('hidden-scrollbar');
              } else {
                $$iScrollHorizontalScrollbar.classList.remove('hidden-scrollbar');
              }
            }
          });
        }, 500);
        let mobserver = new MutationObserver(throttle);

        mobserver.observe($$iScrollIndicator, { attributes: true, attributeFilter: ['style'] });
      });
    }
  },

  render(h) {
    return (
      <div class="home-content">
        <pageScrollbar options={{ mouseWheel: false, scrollY: false }} customClassName="home-content--scrollbar">
          <div class="home-content--container"></div>
        </pageScrollbar>
      </div>
    );
  }
};
