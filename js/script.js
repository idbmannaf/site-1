const showProduct = document.querySelector("#showProduct");
const showCartItem = document.querySelector("#showCartItem");
const showAlert = document.querySelector("#showAlert");


document.addEventListener('DOMContentLoaded', showAllProduct)
document.addEventListener('DOMContentLoaded', showCart)
document.addEventListener('click', deleteCartItem)

const products = [{
        "id": "1",
        "title": "GE 3-Outlet Extender",
        "imageUrl": "https://m.media-amazon.com/images/I/81sE1T-zU7L._AC_UY327_FMwebp_QL65_.jpg",
        "price": 800
    },
    {
        "id": "2",
        "title": "Fluke ST120+",
        "imageUrl": "https://m.media-amazon.com/images/I/816n049-GKL._AC_UY327_FMwebp_QL65_.jpg",
        "price": 100
    },
    {
        "id": "3",
        "title": "Klein Tools ET310",
        "imageUrl": "https://m.media-amazon.com/images/I/61pw8oA02AL._AC_UY327_FMwebp_QL65_.jpg",
        "price": 300
    },
    {
        "id": "4",
        "title": "Leviton 3W102-E",
        "imageUrl": "https://m.media-amazon.com/images/I/81hqiZJZX4L._AC_UY327_FMwebp_QL65_.jpg",
        "price": 400
    },
]

const Cart = class {
    constructor() {

    }
    addToCart(id) {
        let cartItem = [];
        let cartItemInStorage = localStorage.getItem('carts');
        let product = products.find(p => p.id === id);
        if (cartItemInStorage) {
            cartItem = JSON.parse(cartItemInStorage);
            let hasProducInCartIndex = cartItem.findIndex(p => p.id === id);
            if (hasProducInCartIndex != -1) {
                let exestingProduct = cartItem[hasProducInCartIndex];
                exestingProduct.qty += 1;
                exestingProduct.price = exestingProduct.price + product.price;
                cartItem.splice(hasProducInCartIndex);
                cartItem.push(exestingProduct);

                var buttonElement = document.querySelector(`button[data-delete-id="${product.id}"]`);
                let parentTr = buttonElement.parentElement.parentElement;
                let qty = parentTr.querySelector('td.qty');
                qty.innerHTML = exestingProduct.qty

            } else {
                product.qty = 1;
                cartItem.push(product);
                if(document.querySelector('.noProductFound')){
                    document.querySelector('.noProductFound').remove();
                }
                this.appendProduct(product);
            }


        } else {
            product.qty = 1;
            cartItem.push(product);
            if(cartItem.length <=0){
                if(document.querySelector('.noProductFound')){
                    document.querySelector('.noProductFound').remove();
                }
                
            }
            this.appendProduct(product);
        }

        localStorage.setItem('carts', JSON.stringify(cartItem));
    }

    appendProduct(product) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.title}</td>
            <td class="price">${product.price}</td>
            <td class="qty">${product.qty}</td>
            <td><button data-delete-id="${product.id}" class="btn btn-sm btn-outline-danger">Delete</button></td>
            `;

        showCartItem.appendChild(row)
    }
    showAlert(message, type) {
        let alert = document.createElement('div');
        alert.classList = `alert alert-${type}`;
        alert.appendChild(document.createTextNode(message))
        showAlert.appendChild(alert);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000)

    }
}


function showAllProduct() {
    let col = '';
    products.forEach(product => {
        col += `
        <div class="col col-12 col-md-4">
        <div class="img"><img style="whidth:100px; height:100px;" src="${product.imageUrl}"></div>
        <p>${product.title}</p>
        <p>${product.price}</p>
        <button onClick="addToCart(event,'${product.id}')" class="btn btn-sm btn-outline-warning">Add To Cart</button>
        </div>
        `;

        showProduct.innerHTML = col;
    })
}


function addToCart(event, id) {
    event.preventDefault();
    let cart = new Cart();
    cart.addToCart(id);
    cart.showAlert('Product Added In Cart', 'success')
}

function showCart() {
    let cartItem;
    let cartItemInStorage = localStorage.getItem('carts');
    if (cartItemInStorage) {
        cartItem = JSON.parse(cartItemInStorage);
    } else {
        cartItem = [];
    }

    if (cartItem.length > 0) {
        let html = '';
        cartItem.forEach(product => {
            html += `
            <tr><td>${product.title}</td>
            <td class="price">${product.price}</td>
            <td class="qty">${product.qty}</td>
            <td><button data-delete-id="${product.id}" class="btn btn-sm btn-outline-danger">Delete</button></td>
            </tr>`;
        })
        showCartItem.innerHTML = html

    } else {
        html = `
        <tr><td colspan="4" align="center" class="text-danger noProductFound" >No Product Found in Cart</td>
        </tr>`;

        showCartItem.innerHTML = html
    }

}

function deleteCartItem(e) {
    e.preventDefault();
    if (e.target.hasAttribute('data-delete-id')) {

        let productId = e.target.getAttribute('data-delete-id');
        let cartItem;
        let cartItemInStorage = localStorage.getItem('carts');
        if (cartItemInStorage) {
            cartItem = JSON.parse(cartItemInStorage);
        } else {
            cartItem = [];
        }

        //Remove form Local Stora
        let cartProductIndex = cartItem.findIndex(p => p.id === productId);
        if (cartProductIndex != -1) {
            cartItem.splice(cartProductIndex, 1);
        }


        let motherElement = e.target.parentElement.parentElement;
        motherElement.remove();

        if (cartItem.length <= 0) {
            html = `
            <tr><td colspan="4" align="center" class="text-danger noProductFound" >No Product Found in Cart</td>
            </tr>`;

            showCartItem.innerHTML = html
        }

        //Update Local Stora

        localStorage.setItem('carts', JSON.stringify(cartItem))


        let cart = new Cart();
        cart.showAlert('Product Remove From Cart !!!', 'warning')
    }


}