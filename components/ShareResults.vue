<template>
  <div class="margin-bottom-4 print:display-none">
    <h3>Sharing and printing</h3>
    <p class="usa-prose">
      Copy a link to this page with the criteria you
      selected above. Make sure to share it only with
      those you trust as your answers will be visible.
    </p>
    <div class="margin-bottom-1">
      <span :class="{ 'usa-tooltip': alert, 'display-inline-block': true, 'width-full': true }">
        <input class="usa-input" type="text" readonly
          aria-label="URL of website with responses saved"
          :value="url" data-position="top"
          @click="copy"
          @blur="blur"/>
          <span :class="{ 'usa-tooltip__body': true, 'is-set': alert, 'usa-tooltip__body--top':true, 'is-visible': alert }" role="tooltip" :aria-hidden="!alert"
            style="left: 15%; top: -4rem;">
            Link with my selections is copied
          </span>
        </span>
    </div>
    <div class="margin-bottom-1">
      <button class="usa-button usa-button--outline width-card-lg bg-white" @click="copy">
        <svg class="usa-icon text-middle" aria-hidden="true" focusable="false"
          role="img">
          <use xlink:href="~/assets/img/sprite.svg#share"/>
        </svg>
        <span class="text-middle">Copy my selections</span>
      </button>
    </div>
    <div class="margin-bottom-1">
      <print :show-selections="true" @print="$emit('print')" />
    </div>
    <div class="margin-bottom-1">
      <button class="usa-button usa-button--outline width-card-lg bg-white" @click="email">
        <svg class="usa-icon text-middle" aria-hidden="true" focusable="false"
          role="img">
          <use xlink:href="~/assets/img/sprite.svg#mail"/>
        </svg>
        <span class="text-middle">Email my selections</span>
      </button>
    </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      alert: false,
    };
  },
  computed: {
    /* eslint vue/return-in-computed-property: "off" */
    url () {
      /* istanbul ignore next */ if (process.client ||
        process.env.NODE_ENV === 'test') {
        const params = new URLSearchParams();
        const responses = this.$store.getters['criteria/getHashResponses'];

        for (const criteriaKey in responses) {
          if (responses[criteriaKey]) {
            const valueMap = {
              [responses[criteriaKey]]: responses[criteriaKey],
              true: 1,
              false: 0,
            };
            params.append(criteriaKey, valueMap[responses[criteriaKey]]);
          }
        }
        const baseUrl = window.location.href.replace(window.location.search, '');
        const diredBaseUrl = baseUrl.endsWith('/') || baseUrl.endsWith('?') ? baseUrl : `${baseUrl}/`;
        return `${diredBaseUrl}?${params.toString()}`;
      }
    },
  },
  watch: {
    url (value) {
      const url = value || /* istanbul ignore next */ window.location.href.replace(window.location.search, '');
      history.replaceState(null, document.title, url);
    },
  },
  beforeMount () {
    const params = new URLSearchParams(this.search || window.location.search);
    /* eslint prefer-const: "OFF" */
    for (let [key, value] of params) {
      value = value || true;
      const valueMap = {
        [value]: value,
        // eslint-disable-next-line quote-props
        "true": true,
        // eslint-disable-next-line quote-props
        "false": false,
        1: true,
        0: false,
      };
      this.$store.commit("criteria/preloadedResponse", {
        criteriaKeyHash: key.toLowerCase(),
        response: valueMap[value],
      });
    }
  },
  methods: {
    blur () {
      this.alert = false;
    },
    async copy () {
      await navigator.clipboard.writeText(this.url);
      this.alert = true;
      /* istanbul ignore next */
      setTimeout(() => {
        this.alert = false;
      }, 30 * 1000)
    },
    /* istanbul ignore next */
    email () {
      window.location.href = `mailto:?subject=Results%20from%20benefits%20elibibility%20awareness%20resource&body=Results%20${encodeURIComponent(this.url)}`;
    },
  },
};
</script>
