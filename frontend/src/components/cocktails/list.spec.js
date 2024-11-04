import { mount } from '@vue/test-utils';
import ListCocktail from './list.vue';
import flushPromises from 'flush-promises';

global.fetch = jest.fn();

jest.spyOn(global, 'setTimeout');

describe('list.vue', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders cocktails list when data is fetched', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, title: 'Mojito', price: 5 },
                { id: 2, title: 'Martini', price: 10 },
            ],
        });
        const wrapper = mount(ListCocktail);

        await flushPromises();

        expect(wrapper.find('h1').text()).toBe('Cocktails List');
        expect(wrapper.findAll('li')).toHaveLength(2);
        expect(wrapper.find('li').text()).toContain('Mojito, 5€');
    });

    it('updates the search input and clears it', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, title: 'Mojito', price: 5 },
                { id: 2, title: 'Martini', price: 10 },
            ],
        });

        const wrapper = mount(ListCocktail);

        await flushPromises();

        await wrapper.find('input#search').setValue('test');

        expect(wrapper.vm.input).toBe('test');

        expect(wrapper.find('button').exists()).toBe(true);

        await wrapper.find('button').trigger('click');

        expect(wrapper.vm.input).toBe('');
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('calls fetchData when the search input changes', async () => {
        jest.useFakeTimers();

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 1, title: 'Mojito', price: 5 }],
        });

        const wrapper = mount(ListCocktail);

        await flushPromises();

        await wrapper.find('input#search').setValue('Mojito');

        jest.advanceTimersByTime(500);

        await flushPromises();

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/cocktails?search=Mojito',
        );

        const cocktailTitles = wrapper
            .findAll('.cocktail-title')
            .map((el) => el.text());

        expect(cocktailTitles).toContain('Mojito');
    });
});
