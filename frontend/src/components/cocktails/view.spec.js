import { mount } from '@vue/test-utils';
import CocktailDetails from './view.vue';
import flushPromises from 'flush-promises';
import { useRoute } from 'vue-router';

jest.mock('vue-router', () => ({
    useRoute: jest.fn(),
}));

global.fetch = jest.fn();

describe('view.vue', () => {
    beforeEach(() => {
        useRoute.mockReturnValue({
            params: { id: '1' },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    it('displays cocktail details after successful fetch', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                title: 'Margarita',
                price: 12,
                description: 'A refreshing cocktail with lime and tequila.',
            }),
        });

        const wrapper = mount(CocktailDetails);

        await flushPromises();

        expect(wrapper.text()).toContain('Margarita');
        expect(wrapper.text()).toContain('12€');
        expect(wrapper.text()).toContain(
            'A refreshing cocktail with lime and tequila.',
        );
    });
});
