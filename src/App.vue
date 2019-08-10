<template>
  <div id="app">
    <TangochoHeader />
    <router-view></router-view>
    <TangochoFooter />
  </div>
</template>

<script>
import TangochoHeader from "@/components/TheHeader";
import TangochoFooter from "@/components/TheFooter";
export default {
  name: "App",
  components: {
    TangochoHeader,
    TangochoFooter
  }
};
</script>

<style>
</style>
