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
      <h2 class="text-5xl font-bold mb-6">
        Sign in to explore what <br> we have to offer!
      </h2>
    </section>
  </main>
</template>
