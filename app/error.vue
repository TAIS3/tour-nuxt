<template>
  <div class="error-page">
    <div class="error-content">
      <div class="status-code">
        {{ error.statusCode }}
      </div>

      <div class="text-area">
        <h2 class="title">
          {{ error.statusCode === 404 ? 'NOT FOUND' : 'SERVER ERROR' }}
        </h2>
        <p class="description">{{ error.message || 'Please try again later or contact support.' }}</p>
      </div>

      <div class="decoration">
        <span class="cloud cloud-1"></span>
        <span class="cloud cloud-2"></span>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" @click="handleBack">
          BACK
        </button>
        <button class="btn btn-primary" @click="handleHome">
          HOME
        </button>
      </div>
    </div>
    
    <div class="footer-tip">
      Xilutour &copy; 陪伴你的每一次旅行
    </div>
  </div>
</template>

<script setup>
// 定义 props 接收 Nuxt 传递的 error 对象
const props = defineProps({
  error: Object
})

const router = useRouter()

// 处理：清除错误并跳转首页
const handleHome = () => {
  clearError({ redirect: '/' })
}

// 处理：返回上一页 (如果是 404 这种客户端错误，通常可以直接 router.back)
const handleBack = () => {
  clearError() // 先清除错误状态
  router.back()
}
</script>

<style scoped lang="scss">
@forward 'assets/css/variables.scss';
// ====== 🎨 这里配置你的主题色 ======
$primary-color: $mainColor;  // 你的主色调 (比如旅游绿或海洋蓝)
$primary-hover: $primaryColor;
$bg-color: #f0fdfa;       // 极淡的背景色
$text-main: #2c3e50;
$text-sub: #7f8c8d;
// =================================

.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: $bg-color;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.error-content {
  background: white;
  padding: 60px 40px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
  position: relative;
  z-index: 10;
  animation: slideUp 0.5s ease-out;
}

.status-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  color: rgba($primary-color, 0.15); // 半透明的大数字背景
  user-select: none;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;
}

.text-area {
  margin-top: 40px;
  
  .title {
    font-size: 24px;
    color: $text-main;
    margin-bottom: 12px;
    font-weight: 700;
  }
  
  .description {
    font-size: 16px;
    color: $text-sub;
    line-height: 1.6;
    margin-bottom: 30px;
  }
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  
  .btn {
    padding: 12px 30px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    
    &:active {
      transform: scale(0.98);
    }
  }

  .btn-primary {
    background-color: $primary-color;
    color: white;
    box-shadow: 0 4px 15px rgba($primary-color, 0.3);
    
    &:hover {
      background-color: $primary-hover;
      box-shadow: 0 6px 20px rgba($primary-color, 0.4);
      transform: translateY(-2px);
    }
  }

  .btn-secondary {
    background-color: #f5f7fa;
    color: $text-sub;
    
    &:hover {
      background-color: #e4e7ed;
      color: $text-main;
    }
  }
}

.footer-tip {
  margin-top: 40px;
  font-size: 12px;
  color: rgba($text-sub, 0.5);
}

// 简单的云朵装饰动画
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  
  .cloud {
    position: absolute;
    background: white;
    border-radius: 50px;
    opacity: 0.6;
  }
  
  .cloud-1 {
    width: 100px;
    height: 40px;
    top: 10%;
    left: -100px;
    animation: float 25s linear infinite;
  }
  
  .cloud-2 {
    width: 60px;
    height: 25px;
    top: 20%;
    right: -60px;
    animation: float 35s linear infinite reverse;
  }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  from { transform: translateX(-100px); }
  to { transform: translateX(100vw); }
}

// 移动端适配
@media (max-width: 600px) {
  .error-content {
    padding: 40px 20px;
  }
  .status-code {
    font-size: 80px;
    top: -20px;
  }
}
</style>