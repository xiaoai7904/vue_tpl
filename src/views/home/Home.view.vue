<template>
  <Layout class="home">
    <Header>
      <HomeHeader />
    </Header>
    <Layout>
      <Sider width="280">
        <HomeSiderLeft />
      </Sider>
      <Content>
        <HomeContent />
      </Content>
      <Sider width="280">
        <HomeSiderRight />
      </Sider>
    </Layout>
  </Layout>
</template>

<script>
import Home from './Home.class';
export default Home
</script>

<style lang="less">
@import "../../styles/var.less";
@import "../../styles/mixins.less";
.home {

}
</style>