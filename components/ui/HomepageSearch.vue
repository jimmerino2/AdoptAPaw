<template>
    <div class="absolute flex items-center justify-center w-[60rem]">
    <Command class="rounded-lg border shadow-md m-20">

        <div class="relative group focus-within:block">
            <CommandInput placeholder="Search for Adoption Listings..." class="text-md"/>

            <CommandList>
                <!-- No Results -->
                <CommandEmpty>No results found.</CommandEmpty>

                <!-- Suggestions -->
                <CommandGroup heading="Suggestions" class="hidden group-focus-within:block">

                <NuxtLink to="/adoptions">
                    <CommandItem value="Adopt a pet|dog|cat|find|listings|browse">
                        <icon class="mr-2 h-4 w-4" />
                        <span>Adopt or browse through our pet listings.</span>
                    </CommandItem>
                </NuxtLink>

                <NuxtLink to="/shelters">
                    <CommandItem value="Shelters|browse|visit">
                        <icon class="mr-2 h-4 w-4" />
                        <span>Browse through the featured shelters.</span>
                    </CommandItem>
                </NuxtLink>

                <NuxtLink to="/faq">
                    <CommandItem value="Help|Support|Question|Application|Apply|Process|Adoption|Frequently|Ask">
                        <icon class="mr-2 h-4 w-4" />
                        <span>Ask any questions regarding the adoption process.</span>
                    </CommandItem>
                </NuxtLink>

                <NuxtLink to="/tips">
                    <CommandItem value="Help|Support|Question|Application|Apply|Process|Adoption|FAQ|Frequently|Ask|FAQ|Health|Diet|Care|Take|Tips">
                        <icon class="mr-2 h-4 w-4" />
                        <span>Browse through our recomemndations and tips on how to care for pets.</span>
                    </CommandItem>
                </NuxtLink>

                <NuxtLink to="/donation">
                    <CommandItem value="Donate|Support|Make|Money|Finance|Provide|Assist|Cash|Donation">
                        <icon class="mr-2 h-4 w-4" />
                        <span>Make a donation to our website.</span>
                    </CommandItem>
                </NuxtLink>

                </CommandGroup>
            </CommandList>
        </div>
        </Command>
        </div>
  </template>
