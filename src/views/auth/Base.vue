<template>
  <main class="flex w-full h-screen">
    <!-- Left Side -->
    <section class="w-1/2 bg-background flex items-center justify-center">
      <div class="w-full max-w-md bg-white p-8 rounded-lg shadow">
   <slot/>
      </div>
    </section>

    <!-- Right Side -->
      <section class="w-1/2 bg-background-secondary text-secondary font-semibold flex items-center flex-col justify-center text-white">
        <div class="text-[40px] font-bold mb-6 text-center">
           <slot name="description" />
        </div>
    </section>
  </main>
</template>
