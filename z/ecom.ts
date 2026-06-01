interface Product<T> {
  id: T;
  name: string;
  basePrice: number;
  category: string;

  getDiscountedPrice(discount: number): number;
}

interface PaymentMethod {
  processPayment(
    amount: number
  ): Promise<boolean>;

  validatePayment(): boolean;

  getTransactionId(): string;
}

class BaseProduct
  implements Product<string>
{
  constructor(
    public id: string,
    public name: string,
    public basePrice: number,
    public category: string
  ) {}

  getDiscountedPrice(
    discount: number
  ): number {
    return (
      this.basePrice -
      (this.basePrice * discount) / 100
    );
  }
}

class ElectronicsProduct extends BaseProduct {
  getDiscountedPrice(
    discount: number
  ): number {
    const finalDiscount = Math.min(
      discount,
      20
    );

    let price =
      this.basePrice -
      (this.basePrice * finalDiscount) /
        100;

    if (this.basePrice > 50000) {
      price -= 1000;
    }

    return Math.max(price, 0);
  }
}

class ClothingProduct extends BaseProduct {
  getDiscountedPrice(
    discount: number
  ): number {
    const finalDiscount = Math.min(
      discount,
      40
    );

    let price =
      this.basePrice -
      (this.basePrice * finalDiscount) /
        100;

    if (price > 2000) {
      price *= 0.95;
    }

    return Math.max(price, 0);
  }
}

class Inventory<T extends { id: string }> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(id: string): boolean {
    const index = this.items.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);

    return true;
  }

  findById(id: string): T | undefined {
    return this.items.find(
      (item) => item.id === id
    );
  }

  getAllItems(): T[] {
    return this.items;
  }
}

class CreditCardPayment
  implements PaymentMethod
{
  private transactionId: string;

  constructor(
    private cardNumber: string
  ) {
    this.transactionId =
      "CC-" +
      Math.random()
        .toString(36)
        .substring(2, 10);
  }

  validatePayment(): boolean {
    return this.cardNumber.length === 16;
  }

  async processPayment(
    amount: number
  ): Promise<boolean> {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    return (
      this.validatePayment() &&
      amount > 0
    );
  }

  getTransactionId(): string {
    return this.transactionId;
  }
}

class PayPalPayment
  implements PaymentMethod
{
  private transactionId: string;

  constructor(private email: string) {
    this.transactionId =
      "PP-" +
      Math.random()
        .toString(36)
        .substring(2, 10);
  }

  validatePayment(): boolean {
    return this.email.includes("@");
  }

  async processPayment(
    amount: number
  ): Promise<boolean> {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    return (
      this.validatePayment() &&
      amount > 0
    );
  }

  getTransactionId(): string {
    return this.transactionId;
  }
}

class Order {
  private products: {
    product: Product<string>;
    quantity: number;
  }[] = [];

  constructor(
    private paymentMethod: PaymentMethod
  ) {}

  addProduct(
    product: Product<string>,
    quantity: number
  ): void {
    this.products.push({
      product,
      quantity,
    });
  }

  calculateSubtotal(): number {
    return this.products.reduce(
      (total, item) =>
        total +
        item.product.getDiscountedPrice(
          10
        ) *
          item.quantity,
      0
    );
  }

  async checkout(): Promise<{
    success: boolean;
    transactionId: string;
  }> {
    let total =
      this.calculateSubtotal();

    total = total * 0.95;

    const success =
      await this.paymentMethod.processPayment(
        total
      );

    return {
      success,
      transactionId:
        this.paymentMethod.getTransactionId(),
    };
  }
}

async function main() {
  const laptop =
    new ElectronicsProduct(
      "E101",
      "Gaming Laptop",
      70000,
      "Electronics"
    );

  const mobile =
    new ElectronicsProduct(
      "E102",
      "Smartphone",
      30000,
      "Electronics"
    );

  const tshirt =
    new ClothingProduct(
      "C101",
      "T-Shirt",
      2500,
      "Clothing"
    );

  const inventory =
    new Inventory<Product<string>>();

  inventory.addItem(laptop);
  inventory.addItem(mobile);
  inventory.addItem(tshirt);

  console.log(
    "Inventory Products:"
  );
  console.log(
    inventory.getAllItems()
  );

  const payment =
    new CreditCardPayment(
      "1234567812345678"
    );

  const order = new Order(
    payment
  );

  order.addProduct(laptop, 1);
  order.addProduct(tshirt, 2);

  console.log(
    "Subtotal:",
    order.calculateSubtotal()
  );

  const result =
    await order.checkout();

  console.log(
    "Payment Result:"
  );
  console.log(result);
}

main();