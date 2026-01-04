<template>
  <section
    class="hero-section section-bg-image"
    id="sectionBottom"
    :style="`background-image: url(${bannerImg});`"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 1920 116.91"
    >
      <polygon
        fill="#ffffff"
        points="1920 29.15 1859.52 15.31 1776.48 30.33 1727.3 49.18 1681.66 42.99 1619.23 54.48 1484.94 35.63 1435.47 20.32 1334.17 58.45 1286.47 43.29 1236.4 48.88 1203.13 37.69 1142.47 48.88 1071.79 42.7 1043.52 54.77 972.55 40.34 903.35 48.88 850.34 31.8 790.86 51.53 737.56 31.8 671.89 42.7 614.17 34.16 590.91 62.72 501.97 52.12 453.68 37.1 414.22 48.88 349.73 39.75 276.11 59.78 230.47 54.18 121.51 88.34 90.29 116.91 0 88.64 0 0 1920 0 1920 29.15"
      ></polygon>
    </svg>
    <div
      class="inside-page container banner-content public-bottom"
      :class="setContainerCLass('4')"
    >
      <div class="row">
        <div class="col-lg-12 col-12 info-wrap">
          <div class="img-left">
            <img src="/static/images/public_image_1.png" alt="" />
          </div>
          <div class="info">
            <p>start travelling</p>
            <p>let's go, so pack your bags</p>
            <p>fox exiting trip</p>
          </div>
          <div class="img-right">
            <img src="/static/images/public_image_2.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const bannerImg = "/static/images/public_bannerBg.png";
</script>
<script>
export default {};
</script>
<style lang="scss" scoped>
.section-bg-image {
  padding-top: 0;
  height: calc(100vw / 1920 * 550);
  max-height: 550px;
  margin-top: 80px;
  margin-bottom: -85px;
  position: relative;
  z-index: 8;
  .public-bottom {
    padding-bottom: 20px;
    .row {
      height: 100%;
      .info-wrap {
        height: 100%;
        position: relative;
        .info {
          width: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          p {
            text-align: center;
            text-transform: uppercase;
            font-size: clamp(14px, 4vw, 28px);
            font-weight: 700;
            font-family: "AznauriSquareBold", "Microsoft YaHei", Arial,
              sans-serif;
          }
        }
        .img-left {
          position: absolute;
          float: left;
          left: 0;
          top: 0;
          height: 100%;
          img {
            width: auto;
            max-height: 100%;
          }
        }
        .img-right {
          position: absolute;
          float: right;
          right: 0;
          bottom: 0;
          height: 100%;
          display: flex;
          align-items: flex-end;
          img {
            width: auto;
            max-height: 50%;
          }
        }
      }
    }
  }
}
</style>