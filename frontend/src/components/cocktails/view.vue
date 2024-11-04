<template>
    <div>
        <h1 class="header">Cocktails Info</h1>
        <div v-if="loading">
            <LoaderComponent />
        </div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else class="cocktail-info">
            <div class="cocktail-info-title">{{ data.title }}</div>
            <div class="cocktail-info-price">price: {{ data.price }}€</div>
            <div class="cocktail-info-description">{{ data.description }}</div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LoaderComponent from '../loader.vue';

export default {
    name: 'CocktailDetails',
    components: {
        LoaderComponent,
    },
    setup() {
        const data = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const route = useRoute();

        const fetchData = async () => {
            const { id } = route.params;
            try {
                const response = await fetch(
                    `http://localhost:3000/cocktails/${id}`,
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

        onMounted(fetchData);

        return {
            data,
            loading,
            error,
            LoaderComponent,
        };
    },
};
</script>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.header {
    color: #e91e63;
    margin-bottom: 20px;
    text-align: center;
}

.cocktail-info {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    margin-top: 20px;
}

.cocktail-info div {
    margin-bottom: 10px;
}

.cocktail-info-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
}

.cocktail-info-price {
    font-size: 1.2em;
    color: #444;
}

.cocktail-info-description {
    font-size: 1em;
    color: #666;
    line-height: 1.5;
}
</style>
