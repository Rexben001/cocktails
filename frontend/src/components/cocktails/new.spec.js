import { mount } from '@vue/test-utils';
import NewCocktail from './new.vue';

global.fetch = jest.fn();

describe('new.vue', () => {
    afterEach(() => {
        fetch.mockClear();
    });

    it('renders the form with title, price, and description fields', () => {
        const wrapper = mount(NewCocktail);

        expect(wrapper.find('#title').exists()).toBe(true);
        expect(wrapper.find('#price').exists()).toBe(true);
        expect(wrapper.find('#description').exists()).toBe(true);
    });

    it('displays a success message and clears form on successful submission', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const wrapper = mount(NewCocktail);

        await wrapper.find('#title').setValue('Mocktail');
        await wrapper.find('#price').setValue(10);
        await wrapper.find('#description').setValue('A mocktail description');

        await wrapper.find('form').trigger('submit.prevent');

        await wrapper.vm.$nextTick();

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/cocktails',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Mocktail',
                    price: 10,
                    description: 'A mocktail description',
                }),
            }),
        );

        expect(wrapper.find('#title').element.value).toBe('');
        expect(wrapper.find('#price').element.value).toBe('');
        expect(wrapper.find('#description').element.value).toBe('');
    });
});
