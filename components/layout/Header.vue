<template>
  <div class="sticky top-0 flex z-20 flex-col">
    <div
      class="profbar flex items-center h-16 bg-slate-500 custom-lg:px-[10vw] custom-md:px-[4vw] custom-sm:px-[4vw]"
    >
      <div class="flex-grow flex items-center justify-between">
        <div class="logo">
          <div class="rounded-full border border-black p-2">Logo</div>
        </div>
        <div class="profile flex justify-end custom-sm:justify-between">
          <div class="rounded-full border border-black p-2 ml-2">Profile</div>
          <div
            class="rounded-full border border-black p-2 ml-2 custom-md:hidden"
            v-on:click="toggleMenu"
          >
            Menu
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center bg-slate-200 custom-lg:px-[10vw] custom-md:px-[2vw] custom-md:flex"
      :class="menuDiv"
    >
      <div class="flex-[8]">
        <ul class="flex justify-between" :class="menuList">
          <NuxtLink to="homepage"
            ><li
              class="text-lg p-4 hover:bg-slate-300 cursor-pointer"
              :class="menuListItem"
            >
              Homepage
            </li></NuxtLink
          >

          <li
            class="text-lg group relative cursor-pointer"
            :class="menuListItem"
          >
            <NuxtLink to="/adoptionSearch"
              ><div class="group-hover:bg-slate-300 hover:bg-slate-500 p-4">
                Adoptions
              </div></NuxtLink
            >
            <div
              class="hidden group-hover:block absolute hover:block bg-slate-200 shadow-lg rounded-md w-fit z-1"
              :class="menuDropdown"
            >
              <NuxtLink to="/adoptionSearch"
                ><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">
                  Find a Pet
                </div>
              </NuxtLink>
              <NuxtLink to="/shelters"
                ><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">
                  Browse Shelters
                </div></NuxtLink
              >
              <NuxtLink to="/tips"
                ><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">
                  Tips for Adopting
                </div></NuxtLink
              >
            </div>
          </li>

          <NuxtLink to="/bookings"
            ><li
              class="text-lg p-4 hover:bg-slate-300 cursor-pointer"
              :class="menuListItem"
            >
              Bookings
            </li></NuxtLink
          >

          <li
            class="text-lg group relative cursor-pointer"
            :class="menuListItem"
          >
            <NuxtLink to="/donation"
              ><div class="group-hover:bg-slate-300 hover:bg-slate-500 p-4">
                Donations
              </div></NuxtLink
            >
          </li>

          <li
            class="text-lg group relative cursor-pointer"
            :class="menuListItem"
          >
            <NuxtLink to="/faq"
              ><div class="group-hover:bg-slate-300 hover:bg-slate-500 p-4">
                Support
              </div></NuxtLink
            >
            <div
              class="hidden group-hover:block absolute hover:block bg-slate-200 shadow-lg rounded-md w-fit z-1"
              :class="menuDropdown"
            >
              <NuxtLink to="/faq"
                ><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">
                  FAQ Section
                </div>
              </NuxtLink>
              <NuxtLink to="/contact"
                ><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">
                  Contact Us
                </div></NuxtLink
              >
              <NuxtLink to="/tips"
                ><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">
                  Tips for Adopting
                </div></NuxtLink
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
      isMobile: false,
    };
  },
  computed: {
    menuDiv() {
      if (!this.isMobile) {
        return "";
      } else if (this.isMenuOpen) {
        return "flex absolute flex-col top-full h-[100vh]";
      } else {
        return "hidden";
      }
    },
    menuList() {
      if (!this.isMobile) {
        return "";
      } else if (this.isMenuOpen) {
        return "flex flex-col";
      } else {
        return "hidden";
      }
    },
    menuListItem() {
      if (!this.isMobile) {
        return "";
      } else if (this.isMenuOpen) {
        return "flex w-fit";
      } else {
        return "hidden";
      }
    },
    menuDropdown() {
      if (!this.isMobile) {
        return "";
      } else if (this.isMenuOpen) {
        return "left-full top-0";
      } else {
        return "hidden";
      }
    },
  },
  methods: {
    checkWindowSize() {
      this.isMobile = window.innerWidth < 576;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
  mounted() {
    this.checkWindowSize();

    window.addEventListener("resize", this.checkWindowSize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkWindowSize);
  },
};
</script>
