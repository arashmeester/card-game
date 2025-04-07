  <template>
  <div class="w-5/6 mx-auto">
    <div class="grid grid-cols-2 gap-2">
      <div class="p-10 border border-black rounded mt-10 shadow-lg">
        <div class="text-center text-2xl font-bold">Card Game</div>
        <div class="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-20 my-10">
          <div v-for="(player, idx) in players" :key="idx" class="text-center">
            <div>
              {{ get(player, "name", `Player ${idx + 1}`) }}
            </div>
            <div
              class="grid grid-cols-5 gap-2 mt-5 border rounded p-4"
              :class="`bg-${get(player, 'color', 'white')}-200`"
            >
              <div
                v-for="(card, index) in get(player, 'cards')"
                :key="index"
                class="border rounded px-3 py-4 shadow w-12 text-center"
              >
                {{ card }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <button
            @click="shuffleNDistribute"
            class="mt-6 px-4 py-2 text-black hover:text-white bg-blue-200 rounded hover:bg-blue-600 transition"
          >
            Shuffle & Distribute
          </button>
        </div>
      </div>
      <div class="p-10 border border-black rounded mt-10 shadow-lg">
        <div class="text-center text-2xl font-bold">Deck</div>
        <div class="grid grid-cols-10 gap-2 mt-5">
          <div
            v-for="(card, index) in availableCards"
            :key="index"
            class="border rounded px-4 py-5 shadow-sm"
          >
            {{ card }}
          </div>
        </div>
      </div>
    </div>
    <dialog-box :show="showWinner" :winnerInfo="winner" :results="results" :players="players" @close="showWinner = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  groupBy,
  map,
  maxBy,
  values,
  flatMap,
  get,
  shuffle,
  max,
  size,
  indexOf,
} from "lodash";
import DialogBox from "@/components/general/dialogBox.vue";

const allSymbols = ["@", "#", "^", "*"];
const allAlphanumeric = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const showWinner = ref(false);
const availableCards = ref([]);
const results = ref([]);
const winner = ref({});
const players = ref([
  {
    name: "Player 1",
    color: "sky",
    cards: [],
  },
  {
    name: "Player 2",
    color: "red",
    cards: [],
  },
  {
    name: "Player 3",
    color: "orange",
    cards: [],
  },
  {
    name: "Player 4",
    color: "pink",
    cards: [],
  },
]);

// generate cards with [character][symbol] format (sorted ascending)
onMounted(() => {
  availableCards.value = flatMap(allAlphanumeric, (num) =>
    map(allSymbols, (char) => num + char)
  ).sort();
});

function getSymbolValue(symbol) {
  return allSymbols.indexOf(symbol);
}

const shuffleDeck = () => {
  availableCards.value = shuffle(availableCards.value);
};

const distributeCard = () => {
  players.value.forEach((player, index) => {
    players.value[index].cards = [];
  });

  availableCards.value.forEach((card, i) => {
    players.value[i % 4].cards.push(card);
  });
};

const findWinner = () => {
  const playersIndex = map(results.value, (item, index) => index);

  return maxBy(
    playersIndex,
    (i) => {
      const result = results.value[i];
      const card = result.bestGroup[0];
      const value = card.match(/^\d+|[JQKA]/)[0];

      return [
        result.count, // number of cards with same alphanumeric part
        parseInt(indexOf(allAlphanumeric, value)), // alphanumeric part with higher value (higher index)
        getSymbolValue(card.slice(-1)), // symbol part with higher value (higher index)
      ];
    },
    (a, b) => {
      // I need to do this cause the indexOf is comparing indices e.g index 11 (for K) and 3 (for 5), to be '11' vs '3', '3' will win
      if (a[0] !== b[0]) return a[0] - b[0];
      if (a[1] !== b[1]) return a[1] - b[1];
      return a[2] - b[2];
    }
  );
};

const evaluate = (cards) => {
  if (!cards || cards.length === 0) return { bestGroup: [], count: 0 };

  const grouped = groupBy(cards, (card) => card.match(/^(\d+|[JQKA])/)[0]);

  const bestGroup = maxBy(Object.values(grouped), (group) => {
    const value = group[0].match(/^(\d+|[JQKA])/)[0];
    const alphanumeric = indexOf(allAlphanumeric, value);
    const symbolRank = max(group.map((card) => getSymbolValue(card.slice(-1))));
    return [group.length, alphanumeric, symbolRank];
  });

  return {
    bestGroup: bestGroup || [],
    count: bestGroup ? bestGroup.length : 0,
  };
};

const shuffleNDistribute = () => {
  shuffleDeck();
  distributeCard();

  results.value = map(players.value, (p) => evaluate(p.cards));
  winner.value = {
    playerInfo: players.value[findWinner()],
    result: results.value[findWinner()]
  }

  showWinner.value = true
};

</script>
<style scoped>
</style>