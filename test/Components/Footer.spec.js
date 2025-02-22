import { mount } from '@vue/test-utils'
import Footer from '@/components/Footer.vue'
import beforeAllTests from '@/test/beforeAllTests';

describe('Footer', () => {
  beforeAll(async () => {
    await beforeAllTests();
  });

  it('is a Vue instance', () => {
    const wrapper = mount(Footer);
    expect(wrapper.vm).toBeTruthy();
  });

  it('should fetch a disclaimer', async () => {
    const wrapper = mount(Footer);
    const disclaimer = { body: 'disclaimer' };
    wrapper.vm.$options.$content = () => ({ fetch: () => { return disclaimer; }});
    await wrapper.vm.$options.fetch();
    expect(wrapper.vm.$options.disclaimer).toBe(disclaimer);
  });
});
