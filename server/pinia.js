import {ref} from "vue";

export const storesStore = defineStore('Store', {
    state: () => ({
        store: ref([])
    }),
    actions:
    {
        setActiveStore(data) {
            this.store = data
            return this.store
        },
    }
});

export const basketStore = defineStore('Basket', {
    state: () => ({
        basket: JSON.parse(localStorage.getItem('basket')) || []
    }),
    actions: {
        updateBasket(products){
            this.basket = products;
            localStorage.setItem('basket', JSON.stringify(this.basket));
        },
        updateProductQuantity(id, quantity) {
            const product = this.basket.find(item => item.id === id);
            if (product) {
                product.quantity = quantity;
                this.updateBasket(this.basket);
            }
        },
        addToBasket(product) {
            const existingProduct = this.basket.find(item => {
                if (product.isPizza) {
                    return item.id === product.id && item.pizzaVariants.some(variant => variant.id === product.pizzaVariants[0].id);
                } else {
                    return item.id === product.id && item.variants.some(variant => variant.id === product.variants[0].id);
                }
            });
            console.log(existingProduct)
            if (existingProduct) {
                existingProduct.quantity += 1; // Увеличиваем количество на 1
            } else {
                this.basket.push(product); // Добавляем новый товар
            }
            this.updateBasket(this.basket);
        },
        removeFromBasket(product) {
            const existingProduct = this.basket.find(item => {
                if (product.isPizza) {
                    return item.id === product.id && item.pizzaVariants.some(variant => variant.id === product.pizzaVariants[0].id);
                } else {
                    return item.id === product.id && item.variants.some(variant => variant.id === product.variants[0].id);
                }
            });

            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1; // Уменьшаем количество на 1
                } else {
                    const index = this.basket.indexOf(existingProduct);
                    if (index !== -1) {
                        this.basket.splice(index, 1); // Удаляем товар из корзины
                    }
                }
                this.updateBasket(this.basket);
            }
        }
    }
})