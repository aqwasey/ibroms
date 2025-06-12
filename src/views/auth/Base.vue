<template>
  <main class="flex w-full h-screen">
    <!-- Left Side -->
    <section class="w-full lg:w-1/2    p-5 bg-background flex items-center justify-center">
    
   <slot/>
   
    </section>

    <!-- Right Side -->
      <section class="hidden lg:flex w-1/2    bg-background-secondary text-secondary font-semibold items-center flex-col justify-center text-white">
        <div class="text-[40px] font-bold mb-6 text-center">
           <slot name="description" />
        </div>
    </section>
  </main>
</template>
