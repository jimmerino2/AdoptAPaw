<script setup lang="ts">
import HoverCard from '~/components/ui/hover-card/HoverCard.vue';
import HoverCardContent from '~/components/ui/hover-card/HoverCardContent.vue';
import HoverCardTrigger from '~/components/ui/hover-card/HoverCardTrigger.vue';
</script>

<template>
    <NuxtLink to="/petDetails">
        <HoverCard>
            <HoverCardTrigger>
                <div class="border border-black rounded-md w-fit h-fit pb-4">
                    <img src="" alt="pet_image" class="bg-slate-100 size-[13rem] rounded-md">
                    <div class="flex flex-col items-center p-2">
                        <div class="text-lg font-bold pb-2">Pet Name</div>
                        <div class="text-sm">Age | Breed</div>
                    </div>
                </div>
            </HoverCardTrigger>

            <HoverCardContent class="bg-zinc-300">
                <div class="size-fit">
                    <div class="flex flex-row items-center">
                        <img src="" alt="pet_icon" class="size-[3rem] border border-black">
                        <div class="text-lg m-2">Pet Name</div> 
                    </div>
                    <div class="text-md m-2">Gender</div> 
                    <div class="text-md m-2">Breed</div> 

                </div>
            </HoverCardContent>
        </HoverCard>
    </NuxtLink>
</template>