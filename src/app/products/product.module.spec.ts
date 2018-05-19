import { ProductModule } from './product.module';

describe('WelcomeModule', () => {
  let productmodule: ProductModule;

  beforeEach(() => {
    productmodule = new ProductModule();
  });

  it('should create an instance', () => {
    expect(productmodule).toBeTruthy();
  });
});
