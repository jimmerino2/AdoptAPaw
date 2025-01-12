<script setup>
import { useFormValidation } from "~/composables/useFormValidation";
import { useWindowSize } from "@vueuse/core";
import { useFetchData } from "~/composables/useFetchData";
const {
  valContact,
  valName,
  valEmail,
  valCity,
  valAddress,
  valDesc,
  valPassNo,
} = useFormValidation();
const { fetchData } = useFetchData();
const { width } = useWindowSize();
const client = useSupabaseClient();

definePageMeta({
  layout: "forms",
});

const errorMsg = ref(null);
const successMsg = ref(null);
const formData = ref({});
const agentData = ref({
  workinghrs: [{}, {}, {}],
});

const isAgent = ref(false);
async function toggleAgentForm() {
  // Toggle values
  isAgent.value = !isAgent.value;
  agentData.value = {
    type: "",
    workinghrs: [{}, {}, {}],
  };

  // Change Button Text
  const button = document.getElementById("toggle");
  isAgent.value
    ? (button.innerHTML = "Sign Up as User")
    : (button.innerHTML = "Sign Up as Agent");
}

async function toggleType() {
  agentData.value.workinghrs = [{}, {}, {}];
  agentData.value.passno = undefined;
}

const isOpen = ref([true, true, true]);

async function toggleOpen(i) {
  agentData.value.workinghrs[i] = {};
  const button = document.getElementById("button_" + i);
  const selection = document.getElementById("selection_" + i);
  // Closing
  if (isOpen.value[i]) {
    button.style.backgroundColor = "#b91c1c";
    button.innerHTML = "Closed";
    selection.style.display = "none";
  }
  // Opening
  else {
    button.style.backgroundColor = "#16a34a";
    button.innerHTML = "Open";
    selection.style.display = "flex";
  }
  isOpen.value[i] = !isOpen.value[i];
}

async function signUp() {
  try {
    // Reset any previous messages
    errorMsg.value = null;
    successMsg.value = null;
    let isValid = true;

    // Get users with same email
    const { data: existingUser } = await client
      .from("users")
      .select("*")
      .eq("email", formData.value.email)
      .single();

    // #region Validation
    if (
      // Check for empty fields
      ["name", "email", "password", "contact"].some(
        (field) => formData.value[field] === undefined
      ) ||
      (["city", "address", "description", "type"].some(
        (field) => agentData.value[field] === undefined
      ) &&
        isAgent.value)
    ) {
      errorMsg.value = "Please fill in all required fields.";
      isValid = false;
    } else if (existingUser) {
      // Check if email has already applied
      errorMsg.value =
        "Email is already registered or pending for verification.";
      isValid = false;
    } else if (!valName(formData.value.name)) {
      // Check for input formats
      errorMsg.value = "Name must be 6 to 15 characters long.";
      isValid = false;
    } else if (!valEmail(formData.value.email)) {
      errorMsg.value = "Invalid email format.";
      isValid = false;
    } else if (!valContact(formData.value.contact)) {
      errorMsg.value = "Invalid Malaysian contact format.";
      isValid = false;

      // Agent Values
    } else if (isAgent.value) {
      if (!valCity(agentData.value.city)) {
        errorMsg.value = "Invalid city format.";
        isValid = false;
      } else if (!valAddress(agentData.value.address)) {
        errorMsg.value = "Invalid Malaysian address format.";
        isValid = false;
      } else if (!valDesc(agentData.value.desc)) {
        errorMsg.value = "Description must only have up to 300 characters.";
        isValid = false;

        // Agent Specifics
      } else if (agentData.value.type === "Shelter") {
        let counter = 0;
        let errorDetected = false;
        agentData.value.workinghrs.forEach((i) => {
          if (
            ((i.am > 12 ||
              i.am < 1 ||
              i.pm > 12 ||
              i.pm < 1 ||
              i.am === undefined ||
              i.pm === undefined) &&
              isOpen.value[counter]) ||
            isOpen.value.every((val) => !val)
          ) {
            errorDetected = true;
          }
          counter++;
        });

        if (errorDetected) {
          errorMsg.value = "Invalid schedule provided.";
          isValid = false;
        }
      } else if (agentData.value.type === "Agent") {
        if (!valPassNo(agentData.value.passno)) {
          errorMsg.value = "Invalid Passport/IC No. format.";
          isValid = false;
        }
      } else {
        errorMsg.value = "Invalid agent type selected.";
      }
    }
    // #endregion

    // #region Submission
    if (isValid) {
      // Account Creation
      const { error } = await client.auth.signUp({
        email: formData.value.email,
        password: formData.value.password,
        options: {
          emailRedirectTo: "http://localhost:3000/auth/email_verification",
        },
      });
      if (error) throw error;

      // Data insertion
      await storeUnverifiedUserData();
    }
  } catch (error) {
    errorMsg.value = error.message;
  }
}

async function storeUnverifiedUserData() {
  try {
    // Store to user
    const { error } = await client.from("users").insert([
      {
        name: formData.value.name,
        email: formData.value.email,
        contact: formData.value.contact,
        verified: false,
        role: isAgent.value ? "Agent" : "User",
        imagepath: "",
      },
    ]);
    if (error) throw error;

    // Store to agent
    if (isAgent.value) {
      // Get uid as foreign
      const users = await fetchData("users", "id", [
        "email",
        formData.value.email,
      ]);
      const user_id = users[0].id;

      // Prepare base data
      let agentDataToInsert = {
        uid: user_id,
        description: agentData.value.description,
        address: agentData.value.address,
        city: agentData.value.city,
        type: agentData.value.type,
      };

      // Determine specific data from type
      if (agentData.value.type === "Shelter") {
        let formattedWorkingHrs = [];
        let count = 0;
        let days = ["Weekdays: ", "Saturday: ", "Sunday: "];
        isOpen.value.forEach((i) => {
          if (i) {
            formattedWorkingHrs.push(
              days[count] +
                agentData.value.workinghrs[count].am +
                " AM - " +
                agentData.value.workinghrs[count].pm +
                " PM"
            );
          }
          count++;
        });
        agentDataToInsert.workinghrs = formattedWorkingHrs;
      } else {
        agentDataToInsert.passno = agentData.value.passno;
      }

      // Insert data
      const { error } = await client.from("agents").insert([agentDataToInsert]);
      if (error) {
        console.error("Error inserting agent data:", error.message);
        throw error;
      }
    }
    successMsg.value = "Check your email for verification.";
  } catch (error) {
    successMsg.value = "";
    if (
      error.message ==
      `duplicate key value violates unique constraint "users_email_key"`
    ) {
      errorMsg.value = "Email is already pending for verification.";
    } else {
      errorMsg.value = error.message;
    }
  }
}

const inputList = ref([]);
inputList.value = [
  {
    label: computed(() => (isAgent.value ? "Agent Name" : "Name")),
    type: "text",
    id: "name",
    placeholder: "Enter your name",
    model: "name",
  },
  {
    label: computed(() => (isAgent.value ? "Agent Email" : "Email")),
    type: "email",
    id: "email",
    placeholder: "Enter your email",
    model: "email",
  },
  {
    label: "Password",
    type: "password",
    id: "password",
    placeholder: "Enter your password",
    model: "password",
  },
  {
    label: computed(() => (isAgent.value ? "Agent Contact Number" : "Contact")),
    type: "tel",
    id: "contact",
    placeholder: "Enter your contact number",
    model: "contact",
  },
];

const agentInputList = ref([]);
agentInputList.value = [
  [
    {
      label: "Agent City",
      placeholder: "Enter city",
      model: "city",
    },
    {
      label: "Agent Address",
      placeholder: "Enter address",
      model: "address",
    },
  ],
  [
    {
      day: "Weekdays",
      model: 0,
    },
    {
      day: "Saturday",
      model: 1,
    },
    {
      day: "Sunday",
      model: 2,
    },
  ],
];
</script>

<template>
  <form
    @submit.prevent="signUp"
    class="flex flex-col w-full bg-white p-4 rounded-md"
    :class="{ 'max-w-[1175px]': isAgent, 'max-w-[575px]': !isAgent }"
  >
    <div class="text-3xl w-full text-center font-bold p-4">Sign Up</div>
    <!-- Information -->
    <div
      class="flex justify-center"
      :class="{
        'flex-col': width <= 768,
      }"
    >
      <!-- Basic Info -->
      <Card class="max-w-[576px] w-full p-2 rounded-none border-none">
        <CardHeader class="px-2">
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent class="w-full px-2 pb-0">
          <div v-for="item in inputList" :key="item.id" class="my-4">
            <label :for="item.id" class="block text-sm font-medium">
              {{ item.label }}
            </label>
            <input
              v-model="formData[item.model]"
              :type="item.type"
              :id="item.id"
              :placeholder="item.placeholder"
              class="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>

          <p v-if="errorMsg" class="text-red-500 text-sm mb-4 grow">
            {{ errorMsg }}
          </p>
          <p v-if="successMsg" class="text-green-800 text-sm mb-4 grow">
            {{ successMsg }}
          </p>

          <div class="w-full flex justify-center">
            <Button id="toggle" type="button" @click="toggleAgentForm()">
              Sign Up as Agent
            </Button>
          </div>
        </CardContent>
        <CardFooter class="m-0 px-2 py-0 mt-2 w-full" v-show="!isAgent">
          <div class="justify-center flex py-2 w-full">
            <Button type="button" as-child class="w-[40%] max-w-[150px] mx-4">
              <NuxtLink to="/homepage">Cancel</NuxtLink>
            </Button>

            <Button
              type="submit"
              class="w-[40%] max-w-[150px] mx-4 bg-blue-500 hover:bg-blue-600"
            >
              Sign Up
            </Button>
          </div>
        </CardFooter>
      </Card>

      <!-- Agent Info -->
      <Card
        class="max-w-[576px] w-full p-2 rounded-none border-none"
        v-show="isAgent"
      >
        <CardHeader class="px-2" v-show="width > 768">
          <CardTitle class="text-white" v-if="isAgent">Agent Details</CardTitle>
        </CardHeader>
        <CardContent class="px-2 w-full">
          <!-- Address and City Text -->
          <div class="my-4 w-full" v-for="i in agentInputList[0]">
            <label :for="i.model" class="block text-sm font-medium">{{
              i.label
            }}</label>
            <input
              type="text"
              v-model="agentData[i.model]"
              :placeholder="i.placeholder"
              :required="isAgent"
              class="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <!-- Description Textarea-->
          <div class="my-4">
            <label for="description" class="block text-sm font-medium">
              Agent Description
            </label>
            <textarea
              id="description"
              :required="isAgent"
              v-model="agentData.description"
              class="border p-2 mt-1 border-gray-300 rounded w-full"
            ></textarea>
          </div>

          <!-- Type -->
          <div class="mt-4">
            <p class="text-sm font-medium">Agent Type</p>
            <div class="flex items-center mt-1">
              <input
                type="radio"
                id="shelter"
                value="Shelter"
                name="type"
                v-model="agentData.type"
                class="mx-2"
                :required="isAgent"
                @click="toggleType"
              />
              <label for="shelter" class="text-sm font-medium">Shelter</label>
            </div>
            <div class="flex items-center mt-1">
              <div class="flex items-center mt-1">
                <input
                  type="radio"
                  id="agent"
                  value="Agent"
                  name="type"
                  v-model="agentData.type"
                  class="mx-2"
                  :required="isAgent"
                  @click="toggleType"
                />
                <label for="agent" class="text-sm font-medium"
                  >Individual</label
                >
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="px-2 py-0">
          <!-- Specifics -->
          <div class="mb-4 w-full" v-if="agentData.type">
            <div v-if="agentData.type == 'Shelter'">
              <label class="block text-sm font-medium">Working Hours</label>
              <div class="border border-grey-300 p-2 rounded-md">
                <!-- Working Hours -->
                <div
                  class="flex items-center"
                  :class="{ 'flex-col': width <= 768 }"
                  v-for="i in agentInputList[1]"
                >
                  <div class="w-16 text-sm mr-2 font-medium inline">
                    {{ i.day }}
                  </div>
                  <div
                    class="flex min-w-[200px]"
                    :class="{ 'flex-col justify-center': width <= 768 }"
                  >
                    <div
                      class="text-sm p-2 flex items-center"
                      :id="'selection_' + i.model"
                    >
                      <input
                        type="number"
                        min="1"
                        max="12"
                        v-model="agentData.workinghrs[i.model].am"
                        class="w-12 border-b border-grey-300 h-full text-right px-2"
                      />AM to
                      <input
                        type="number"
                        min="1"
                        max="12"
                        v-model="agentData.workinghrs[i.model].pm"
                        class="w-12 border-b border-grey-300 h-full text-right px-2"
                      />PM
                    </div>
                    <Button
                      type="button"
                      class="h-3/5 my-2 p-2 bg-green-600 hover:bg-green-400"
                      :id="'button_' + i.model"
                      @click="toggleOpen(i.model)"
                      >Open</Button
                    >
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="agentData.type === 'Agent'">
              <label for="passno" class="block text-sm font-medium">
                IC Number or Passport
              </label>
              <input
                type="text"
                v-model="agentData.passno"
                id="passno"
                placeholder="Enter your IC or Passport No (No dashes)."
                :required="isAgent && agentData.type == 'Agent'"
                class="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- Buttons when Agent -->
    <div class="justify-center flex py-2 w-full" v-show="isAgent">
      <Button type="button" as-child class="w-[40%] max-w-[150px] mx-4">
        <NuxtLink to="/homepage">Cancel</NuxtLink>
      </Button>

      <Button
        type="submit"
        class="w-[40%] max-w-[150px] mx-4 bg-blue-500 hover:bg-blue-600"
      >
        Sign Up
      </Button>
    </div>
  </form>
</template>
