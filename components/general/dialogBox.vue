<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full"
    v-if="show"
  >
    <div class="border rounded bg-white p-10 w-1/5 relative">
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        aria-label="Close dialog"
      >
        <font-awesome-icon icon="times" class="h-5 w-5 text-gray-600" />
      </button>
      <div class="text-xl font-bold mb-6">
        Congratulations {{ get(winnerInfo, ["playerInfo", "name"]) }} !!
      </div>
      <div v-for="(player, idx) in players" :key="idx">
        <div class="my-3">
          {{ player.name }}
        </div>
        <div class="grid grid-cols-8 gap-1">
          <div
            v-for="(card, index) in get(results, [idx, 'bestGroup'])"
            :key="index"
            class="border rounded px-3 py-4 shadow w-12 text-center"
          >
            {{ card }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { get } from "lodash";

defineEmits(["close"]);

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  winnerInfo: {
    type: Object,
    default: () => ({}),
  },
  results: {
    type: Array,
    default: () => [],
  },
  players: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
</style>