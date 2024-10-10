<template >
    <!-- Medium Screen-->
    <div class="sticky top-0 flex hidden md:flex z-10">
        <div class="flex-1">
            <div class="profbar flex items-center h-16 px-8 bg-slate-500 px-[10rem]">
                <div class="flex-[8] flex items-center justify-between">
                    <div class="logo">
                        <div class="rounded-full border border-black p-2">Logo</div>
                    </div>
                    <div class="profile">
                        <div class="rounded-full border border-black p-2">Profile</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center navbar bg-slate-200 px-40">   
                
                <div class="flex-[8]">
                    <ul class="flex justify-between"> 

                    <NuxtLink to="homepage"><li class="text-lg p-4 hover:bg-slate-300 cursor-pointer">Homepage</li></NuxtLink>

                    <li class="text-lg group relative cursor-pointer">
                        <NuxtLink to="/adoptionSearch"><div class="group-hover:bg-slate-300 hover:bg-slate-300 p-4">Adoptions</div></NuxtLink>
                        <div class="hidden group-hover:block absolute top-full hover:block bg-slate-200 shadow-lg rounded-md w-fit z-1">
                            <NuxtLink to="/adoptionSearch"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">Find a Pet</div> </NuxtLink>
                            <NuxtLink to="/shelters"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">Browse Shelters</div></NuxtLink>
                            <NuxtLink to="/tips"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">Tips for Adopting</div></NuxtLink>
                        </div>
                    </li>

                    <NuxtLink to="/bookings"><li class="text-lg p-4 hover:bg-slate-300 cursor-pointer">Bookings</li></NuxtLink>

                    <li class="text-lg group relative cursor-pointer">
                        <NuxtLink to="/donation"><div class="group-hover:bg-slate-300 hover:bg-slate-300 p-4">Donations</div></NuxtLink>
                        <div class="hidden group-hover:block absolute top-full hover:block bg-slate-200 shadow-lg rounded-md w-fit z-1">
                            <NuxtLink to="/donation"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">Make a Donation</div> </NuxtLink>
                            <NuxtLink to="/donation"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">My Donations</div></NuxtLink>
                        </div>
                    </li>
                    
                    <li class="text-lg group relative cursor-pointer">
                        <NuxtLink to="/faq"><div class="group-hover:bg-slate-300 hover:bg-slate-300 p-4">Support</div></NuxtLink>
                        <div class="hidden group-hover:block absolute top-full hover:block bg-slate-200 shadow-lg rounded-md w-fit z-1">
                            <NuxtLink to="/faq"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">FAQ Section</div> </NuxtLink>
                            <NuxtLink to="/contact"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">Contact Us</div></NuxtLink>
                            <NuxtLink to="/tips"><div class="py-4 w-48 hover:bg-slate-300 px-2 rounded-md">Tips for Adopting</div></NuxtLink>
                        </div>
                    </li>
                </ul>
                </div>  
            </div>
        </div>
    </div>
</template>

