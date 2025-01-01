<template>
  <div class="flex flex-col justify-center items-center">
    <svg 
      version="1.1" 
      id="L6" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      x="0px" y="0px"
      viewBox="0 0 100 100" 
      xml:space="preserve"
      class="w-24 h-24"
    >
      <rect 
        fill="none" 
        class="fill-primary"
        stroke-width="4" 
        x="25" 
        y="25" 
        width="50" 
        height="50"
      >
        <animateTransform
          attributeName="transform"
          dur="0.5s"
          from="0 50 50"
          to="180 50 50"
          type="rotate"
          id="strokeBox"
          attributeType="XML"
          begin="rectBox.end"
        />
      </rect>
      <rect 
        x="27" 
        y="27" 
        class="fill-primary-100"
        width="46" 
        height="50"
      >
        <animate
          attributeName="height"
          dur="0.5s"
          attributeType="XML"
          from="50" 
          to="0"
          id="rectBox" 
          fill="freeze"
          begin="0s;strokeBox.end"
        />
      </rect>
    </svg>
    <h1 class="text-center text-lg font-light text-primary">{{ $t('loaderText') }}</h1>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
// Optional scoped styles if additional customization needed
svg {
  width: 75px;
  height: 75px;
}
h1 {
  text-transform: uppercase;
  margin: 0;
  font-weight: 100;
}
</style>
