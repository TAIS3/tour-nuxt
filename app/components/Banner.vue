<template>
  <div v-if="bannerData">
    <template v-if="bannerData.settype === '0'">
      <!-- 文左图右 -->
      <div class="row" :key="props.itemKey">
        <div class="col-lg-6 col-12 mb-5 mb-lg-0 aboutus-info-wrap center-left-column">
          <span v-if="infoMsg !== ''" class="info">{{ infoMsg }}</span>
          <h2 class="title" v-html="safeContent(bannerData.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content">
            <div v-html="safeContent(bannerData.content)"></div>
          </div>
          <button class="btn theme-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>

        <div class="col-lg-6 col-12 img-wrap">
          <img :src="getImageUrl(bannerData.image)" :title="bannerData.name" />
        </div>
      </div>
    </template>

    <template v-else-if="bannerData.settype === '1'">
      <!-- 文右图左 -->
      <div class="row" :key="props.itemKey">
        <div class="col-lg-6 col-12 img-wrap">
          <img :src="getImageUrl(bannerData?.image)" :title="bannerData?.name" />
        </div>
        <div class="col-lg-6 col-12 mb-5 mb-lg-0 info-wrap center-left-column">
          <h2 class="title" v-html="safeContent(bannerData?.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content" v-html="safeContent(bannerData?.content)"></div>
          <button class="btn theme-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="bannerData.settype === '2'">
      <!-- 文左图全 -->
      <div class="row" :key="props.itemKey">
        <div class="col-lg-12 col-12 mb-5 mb-lg-0 info-wrap center-left-column">
          <h2 class="title" v-html="safeContent(bannerData.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content" v-html="safeContent(bannerData.content)"></div>
          <button class="btn light-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="bannerData.settype === '3'">
      <!-- 文右图全 -->
      <div class="row justify-content-end" :key="props.itemKey">
        <div class="col-lg-12 col-12 mb-5 mb-lg-0 info-wrap center-left-column">
          <h2 class="title" v-html="safeContent(bannerData.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content" v-html="safeContent(bannerData.content)"></div>
          <button class="btn light-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="bannerData.settype === '4'">
      <!-- 文中图全 -->
      <div class="row" :key="props.itemKey">
        <div class="col-lg-12 col-12 info-wrap center-both-column">
          <h2 class="title" v-html="safeContent(bannerData.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content" v-html="safeContent(bannerData.content)"></div>
          <button class="btn light-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="bannerData.settype === '5'">
      <!-- 文左图全(非全屏) -->
      <div class="row text-left-pic-all" :key="props.itemKey">
        <div class="col-lg-12 col-12 info-wrap">
          <h2 class="title" v-html="safeContent(bannerData.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content" v-html="safeContent(bannerData.content)"></div>
          <button class="btn theme-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>
        <div class="col-lg-12 col-12">
          <img :src="getImageUrl(bannerData?.image)" :title="bannerData?.name" />
        </div>
      </div>
    </template>

    <template v-else-if="bannerData.settype === '6'">
      <!-- 文右图全(非全屏) -->
      <div class="row text-right-pic-all" :key="props.itemKey">
        <div class="col-lg-12 col-12 info-wrap">
          <h2 class="title" v-html="safeContent(bannerData.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content" v-html="safeContent(bannerData.content)"></div>
          <button class="btn theme-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>
        <div class="col-lg-12 col-12">
          <img :src="getImageUrl(bannerData?.image)" :title="bannerData?.name" />
        </div>
      </div>
    </template>

    <template v-else-if="bannerData.settype === '7'">
      <!-- 文上图下 -->
      <div class="row text-top-pic-down" :key="props.itemKey">
        <div class="col-lg-12 col-12 info-wrap">
          <h2 class="title" v-html="safeContent(bannerData.title)"></h2>
          <h3
            v-if="bannerData.subtitle && bannerData.subtitle !== ''"
            class="subtitle"
            v-html="safeContent(bannerData.subtitle)"
          ></h3>
          <div class="content" v-html="safeContent(bannerData.content)"></div>
          <button class="btn theme-btn" v-if="bannerData.link" @click="toLink(bannerData.link)">
            {{ btnMsg }}
          </button>
        </div>
        <div class="col-lg-12 col-12">
          <img :src="getImageUrl(bannerData?.image)" :title="bannerData?.name" />
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1920 116.91">
            <polygon
              fill="#ffffff"
              points="1920 29.15 1859.52 15.31 1776.48 30.33 1727.3 49.18 1681.66 42.99 1619.23 54.48 1484.94 35.63 1435.47 20.32 1334.17 58.45 1286.47 43.29 1236.4 48.88 1203.13 37.69 1142.47 48.88 1071.79 42.7 1043.52 54.77 972.55 40.34 903.35 48.88 850.34 31.8 790.86 51.53 737.56 31.8 671.89 42.7 614.17 34.16 590.91 62.72 501.97 52.12 453.68 37.1 414.22 48.88 349.73 39.75 276.11 59.78 230.47 54.18 121.51 88.34 90.29 116.91 0 88.64 0 0 1920 0 1920 29.15"
            />
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// 1. 无需任何 imports！ Nuxt 自动处理
// 2. defineProps 是宏，无需 import

const props = defineProps({
  id: { type: Number, required: true },
  itemKey: { type: String },
  bannerData: { type: Object, required: true },
  infoMsg: { type: String, default: '' },
  btnMsg: { type: String, default: '' },
})

// 3. 使用 computed 保持响应式
// 这样即使父组件是异步获取数据，这里也能正确更新
const bannerData = computed(() => props.bannerData)
</script>

<style lang="scss" scoped>
// 样式直接复用即可
.text-top-pic-down {
  svg {
    bottom: -10px;
    transform: rotateX(180deg);
  }
}
</style>