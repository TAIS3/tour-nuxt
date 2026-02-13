<template>
  <div class="skeleton-wrapper">
    <div class="skeleton-header">
      <div class="skeleton-item logo"></div>
      <div class="skeleton-item link"></div>
    </div>
    <div class="skeleton-body">
      <div class="skeleton-main">
        <div class="skeleton-item hero"></div>
        <div class="skeleton-item-group">
          <div class="skeleton-item card"></div>
          <div class="skeleton-item card"></div>
          <div class="skeleton-item card"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* A more subtle and modern pulse animation */
@keyframes pulse-bg {
  0% {
    background-color: #f0f2f5;
  }
  50% {
    background-color: #e6e8eb;
  }
  100% {
    background-color: #f0f2f5;
  }
}

.skeleton-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 9999;
  overflow: hidden;
}

.skeleton-item {
  animation: pulse-bg 1.8s infinite ease-in-out;
  border-radius: 8px;
}

.skeleton-header {
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e8eb;
}

.skeleton-header .logo {
  width: 150px;
  height: 35px;
}

.skeleton-header .link {
  width: 100px;
  height: 25px;
}

.skeleton-body {
  padding: 40px;
}

.skeleton-main .hero {
  width: 100%;
  height: 250px;
  margin-bottom: 30px;
}

.skeleton-item-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.skeleton-main .card {
  height: 180px;
}
</style>
