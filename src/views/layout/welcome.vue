<template>
  <div class="welcome">
    <h1>欢迎您登录 asimplefox 后台管理系统</h1>
    <p>在这里，您可以管理所有相关信息和设置。</p>
  </div>
</template>

<script>
export default {
  name: 'WelcomeIndex'
}
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #eaedf1;
  color: #333;
  text-align: center;
}

.welcome h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.welcome p {
  font-size: 18px;
  margin: 0;
  padding: 0 20px;
}
</style>
