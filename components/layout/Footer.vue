<script setup lang="ts">
import Button from '../ui/button/Button.vue';
</script>

<template>
    <!-- Navigation -->
    <div class="flex bg-zinc-400 px-10">
        <div class="flex-grow p-2">

            <!-- Logo -->
            <div class="flex flex-row text-lg items-center">
                <img src="" alt ="logo" class="size-16 border border-black mr-4">
                AdoptAPaw
            </div>

            <!-- Content -->
            <div class="border border-black my-2 grid grid-cols-5 items-center px-4">
                <div class="col-span-3 flex flex-row">
                    <div class="flex-grow text-md">
                    <p class="text-lg">Title</p>
                    <ul>
                        <li>Test1</li>
                        <li>Test1</li>
                        <li>Test1</li>
                        <li>Test1</li>
                    </ul>
                </div>
                <div class="flex-grow text-md">
                    <p class="text-lg">Title</p>
                    <ul>
                        <li>Test1</li>
                        <li>Test1</li>
                        <li>Test1</li>
                        <li>Test1</li>
                    </ul>
                </div>
                <div class="flex-grow text-md">
                    <p class="text-lg">Title</p>
                    <ul>
                        <li>Test1</li>
                        <li>Test1</li>
                        <li>Test1</li>
                        <li>Test1</li>
                    </ul>
                </div>
                </div>
                <div class="bg-zinc-200 col-span-2 rounded-lg mx-10 px-5 flex items-center justify-center flex-col">
                    <div class="text-lg m-2">Make a donation to the website today!</div>
                    <div class="text-md text-center">Help our website find their forever homes by donating to our organzation!</div>
                    <div class="m-5"><Button>To Donate Page</Button></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Copyright and Links-->
    <div class="flex bg-zinc-500 px-40">
        <div class="flex-grow flex justify-between px-2">
            <div class="">Copyright yada yada</div>
            <div class=""><a href="https://github.com/jimmerino2/AdoptAPaw"><div>Github</div></a></div>
        </div>
    </div>
</template>