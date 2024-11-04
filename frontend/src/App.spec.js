import { mount } from '@vue/test-utils';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';

const routes = [
    { path: '/', component: { template: '<div>Cocktails</div>' } },
    { path: '/new', component: { template: '<div>Add Cocktail</div>' } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('App.vue', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(App, {
            global: {
                plugins: [router],
            },
        });
        await router.isReady();
        await nextTick();
    });

    it('renders the navigation links', () => {
        const cocktailLink = wrapper.find('a[href="/"]');
        const addCocktailLink = wrapper.find('a[href="/new"]');

        expect(cocktailLink.exists()).toBe(true);
        expect(cocktailLink.text()).toBe('Cocktails');

        expect(addCocktailLink.exists()).toBe(true);
        expect(addCocktailLink.text()).toBe('Add Cocktail');
    });

    it('navigates to the Cocktails route when clicking the Cocktails link', async () => {
        const cocktailLink = wrapper.find('a[href="/"]');
        await cocktailLink.trigger('click');
        expect(wrapper.html()).toContain('Cocktails');
    });

    it('navigates to the Add Cocktail route when clicking the Add Cocktail link', async () => {
        const addCocktailLink = wrapper.find('a[href="/new"]');
        await addCocktailLink.trigger('click');
        expect(wrapper.html()).toContain('Add Cocktail');
    });
});
