<template >
    <!-- Medium Screen-->
    <div class="sticky top-0 flex hidden md:flex z-0">
        <div class="flex-1 border border-black ">
            <div class="profbar flex items-center h-16 px-8 bg-slate-500">
                <div class="w-20"></div>
                <div class="flex-[8] flex items-center justify-between">
                    <div class="logo">
                        <div class="rounded-full border border-black p-2">Logo</div>
                    </div>
                    <div class="profile">
                        <div class="rounded-full border border-black p-2">Profile</div>
                    </div>
                </div>
                <div class="w-20"></div>
            </div>

            <div class="flex items-center navbar bg-slate-200">
                <div class="w-20"></div>
                
                <div class="flex-[8]">
                    <ul class="flex justify-around"> 
                    <li class="text-lg py-4">Homepage</li>

                    <li class="text-lg py-4 group relative">
                        Adoptions
                        <div class="border border-black hidden group-hover:block absolute top-full hover:block bg-slate-200 px-2 shadow-lg rounded-md w-fit z-1">
                            <p class="py-4 w-48">Find a Pet</p> 
                            <p class="py-4 w-48">Browse Shelters</p>
                            <p class="py-4 w-48">Tips for Adopting</p>
                        </div>
                    </li>

                    <li class="text-lg py-4 group relative">
                        Support
                        <div class="border border-black hidden group-hover:block absolute top-full hover:block bg-slate-200 px-2 shadow-lg rounded-md w-fit z-1">
                            <p class="py-4 w-44">FAQ Section</p> 
                            <p class="py-4 w-44">Contact Us</p>
                            <p class="py-4 w-44">Tips on Adopting</p>
                        </div>
                    </li>
                    <li class="text-lg py-4 group relative">
                        Donations
                        <div class="border border-black hidden group-hover:block absolute top-full hover:block bg-slate-200 px-2 shadow-lg rounded-md w-fit z-1">
                            <p class="py-4 w-48">Make a Donation</p> 
                            <p class="py-4 w-48">My Donations</p>
                        </div>
                    </li>
                        
                    <li class="text-lg py-4">Bookings</li>
                </ul>
                </div>
                <div class="w-20"></div>
            </div>
        </div>
    </div>
</template>

