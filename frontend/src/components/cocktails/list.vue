<template>
  <div id="cocktails-list">
    <h1>Cocktails List</h1>
    <div v-if="loading" id="loading">
      <LoaderComponent />
    </div>
    <div v-else-if="error" id="error">{{ error }}</div>
    <div v-else>
      <div class="search-container">
        <label for="search">Search by description:</label>
        <input type="text" id="search" v-model="input" placeholder="Type to search..." />
        <button v-if="input" @click="clearSearch">Clear</button>
      </div>
      <div class="cocktail-list-container">
        <ul class="cocktail-list">
          <li v-if="data.length === 0" class="no-cocktails">
            No cocktails available.
          </li>
          <li v-for="item in data" :key="item.id" class="cocktail-item">
            <a :href="item.id">
              <span class="cocktail-title">{{ item.title }}</span>,
              <span class="cocktail-price">{{ item.price }}€</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import LoaderComponent from '../loader.vue';

export default {
  name: 'ListCocktail',
  components: {
    LoaderComponent,
  },
  setup() {
    const data = ref([]);
    const loading = ref(true);
    const error = ref(null);
    let input = ref('');

    const fetchData = async (url) => {
      try {
        const response = await fetch(
          url
        );
        if (!response.ok) {
          const text = await response.text();

          throw new Error(JSON.parse(text).message);
        }

        const jsonData = await response.json();
        data.value = jsonData;
      } catch (error) {
        error.value = error.message;
      } finally {
        loading.value = false;
      }
    };


    const fetchAllCocktails = async () => fetchData('http://localhost:3000/cocktails');



    const onSearchInput = () => {
      fetchData(`http://localhost:3000/cocktails/search?q=${input.value}`)
    };

    const clearSearch = () => {
      input.value = '';
      fetchData();
    };

    const debounce = (func, delay) => {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    };

    const debouncedSearch = debounce(onSearchInput, 500);

    watch(input, (newTerm) => {
      debouncedSearch(newTerm);
    });

    onMounted(fetchAllCocktails);

    return {
      input,
      data,
      loading,
      error,
      onSearchInput,
      clearSearch,
      LoaderComponent,
    };
  },
};
</script>

<style scoped>
#cocktails-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #3498db;
}

#error {
  color: #e74c3c;
  margin: 10px 0;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

}

label {
  margin-right: 10px;
  font-weight: bold;

}

input[type='text'] {
  flex: 1;
  padding: 10px;
  border: 1px solid #3498db;
  border-radius: 4px;
  font-size: 1rem;
  margin-right: 10px;
  transition: border-color 0.3s;

}

input[type='text']:focus {
  border-color: #2980b9;
  outline: none;

}

button {
  padding: 10px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

}

button:hover {
  background-color: #c0392b;

}

.cocktail-list-container {
  max-height: 400px;
  overflow-x: auto;
  white-space: nowrap;
  border: 1px solid #3498db;
  border-radius: 4px;
  padding: 10px;

}

.cocktail-list {
  display: flex;

  flex-direction: column;
  list-style-type: none;
  padding: 0;
  margin: 0;

}

.cocktail-item {
  display: inline-block;
  padding: 10px;
  border-right: 1px solid #eee;

}

.cocktail-item a {
  text-decoration: none;
}

.cocktail-item:last-child {
  border-right: none;

}

.cocktail-title {
  font-weight: bold;
  color: #3498db;

}

.cocktail-price {
  color: #e67e22;

}
</style>
