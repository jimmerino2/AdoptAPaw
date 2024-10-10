<script>

export default{
    props:{
        category: {
            type: String,
            required: true
        },
        selections:{
            type: Array,
            required: true
        }
    }
}
</script>

<template>
<div class="flex justify-center w-full flex-col p-4 gap-4 border ring-zinc-200 ring-2 border-shadow-md rounded-md mb-5">
    <div class="text-lg text-center">{{ category }}</div>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Any"/>
      </SelectTrigger>
      <SelectContent>
        <div v-for="selection in selections" :key="selection">
            <Checkbox id="selection"class="m-2 text-md"></Checkbox>{{selection}} 
        </div>
      </SelectContent>
    </Select>
</div>
</template>