//DOM ELEMENTS
let paginationContainer = document.getElementById("pages-container");
let paginationHTMLPages = [];
let paginationBack = document.getElementById("back-arrow");
let paginationForward = document.getElementById("forward-arrow");

//Products Elements 
let productsPerPageNum = document.getElementById("items-per-page");
let itemsContainer = document.getElementById("items-container");
let emptyCartContent = document.getElementById("empty-cart");

//Product Search Inputs
let form = document.getElementById("price-form");
let productPriceInput = document.getElementById("product-price-input");
let productNameInput = document.getElementById("product-name")


//State Objects Declarations
let pagination = {
    NumitemsPerPage: 10,
    maxNumOfPages: 0,
    window: [],
    curPage: 1,

    setPaginationWindow: () => {
        pagination.maxNumOfPages = Math.ceil(items.products.length / pagination.NumitemsPerPage);
        (pagination.maxNumOfPages >= 3) ? pagination.window = [1, 2, 3] : pagination.window = range(2, pagination.maxNumOfPages);
    },

    isThereMoreItems: (page) => page <= pagination.maxNumOfPages,

    checkOverFrame: (direction) => {
        return (direction == "right") ? pagination.curPage > pagination.window.at(-1) : pagination.curPage < pagination.window[0];
    },

    shiftWindowLeft: () => {
        pagination.window.pop();
        pagination.window.unshift(pagination.curPage);
    },

    shiftWindowRight: () => {
        pagination.window.shift();
        pagination.window.push(pagination.curPage);
    },

    checkOverPages: () => pagination.curPage <= 1,

    render: (def = true) => {
        paginationContainer.innerHTML = '';

        (!items.products.length) ? emptyCartContent.classList.remove("d-none") : emptyCartContent.classList.add("d-none")

        pagination.window.forEach((page, index) => {
            let windowPage = `<p class="page" data-pageNum=${page}>${page}</p>`;
            paginationContainer.innerHTML += windowPage;
            pagination.setPaginationEvents();
        })

        paginationContainer.firstElementChild.classList.add("active");
    },

    setPaginationEvents: () => {
        let paginationPages = Array.from(paginationContainer.children);
        paginationPages.forEach((page, index) => {
            page.addEventListener('click', (e) => {
                let activePage = paginationPages.find((page) => page.classList.contains("active"));
                (activePage != undefined) ? activePage.classList.remove("active") : null;

                e.target.classList.add("active");
                pagination.curPage = parseInt(page.dataset.pagenum);
                items.render();
                if (!pagination.isThereMoreItems(pagination.window.at(-1) + 1) && pagination.curPage == pagination.window.at(-1)) paginationForward.style.display = "none";
            })
        })
    }
}

let items = {
    products,

    render: () => {
        itemsContainer.innerHTML = " ";
        let start = (pagination.curPage - 1) * pagination.NumitemsPerPage;
        let end = start + pagination.NumitemsPerPage;
        let products = items.products.slice(start, end);

        products.forEach((product) => {
            let HTMLItem = items.setItemInHTMLForm(product);
            itemsContainer.innerHTML += HTMLItem;
        })
    },

    setItemInHTMLForm: (itemData) => {
        return (`<div class="col-md-4 col-sm-6 col-lg-3 mb-4">
        <div class="card product | border border-light">
            <div
                class="bk | d-flex justify-products-center align-items-center bg-light"
            >
                <img
                    src="${itemData.img}"
                    alt="product"
                    class="w-100"
                />
            </div>
            <div class="card-body | border border-top-0">
                <p>
                    <span class="bg-danger circle"></span>
                    <span class="bg-warning circle"></span>
                    <span class="bg-success circle"></span>
                    <span class="bg-primary circle"></span>
                </p>
                <a href="shopItem.html" class="text-clr-primary">
                    <h5 class="card-title product-card-heading">
                        ${itemData.name}
                    </h5>
                </a>
                <p class="card-text">
                    <span class="current-price price">$${itemData.price}</span>
                    <span class="old-price price text-black-50"
                    >$${itemData.oldPrice}</span
                    >
                </p>
                <button class="btn bttn">
                    <img
                        src="imgs/icons/shopping-bag-line.svg"
                        alt="shopping bag"
                    />
                    Add to Cart
                </button>
            </div>
        </div>
    </div>`)
    },
}

//EVENTS
window.addEventListener('load', () => {
    pagination.setPaginationWindow();
    pagination.render(true);
    items.render();
})

form.onsubmit = (e) => e.preventDefault();

paginationForward.addEventListener("click", () => {
    pagination.curPage++;
    if (pagination.checkOverFrame("right")) pagination.shiftWindowRight();
    pagination.render();
    Array.from(paginationContainer.children).find((page) => page.dataset.pagenum == pagination.curPage).click();
})

paginationBack.addEventListener("click", () => {
    if (pagination.checkOverPages()) return;

    pagination.curPage--
    if (pagination.checkOverFrame("left")) pagination.shiftWindowLeft();
    pagination.render();
    Array.from(paginationContainer.children).find((page) => page.dataset.pagenum == pagination.curPage).click();

    paginationForward.style.display = "block";
})

productNameInput.addEventListener("input", (e) => productsFilter());

productPriceInput.addEventListener("input", (e) => productsFilter());

//General Functions
let productsFilter = () => {
    let filteredDate = (!productNameInput.value && !productPriceInput.value) ? products :
        products.filter((item) => {
            return (
                (productPriceInput.value ? item.price == productPriceInput.value : true) &&
                (productNameInput.value ? item.name.toLowerCase().includes(productNameInput.value.trim().toLowerCase()) : true)
            )
        })

    items.products = filteredDate
    items.render();

    pagination.setPaginationWindow();
    pagination.curPage = 1;
    pagination.render(false);
}

let range = (start, end) => {
    let arr = [1];
    for (let x = start; x <= end; x++) {
        arr.push(x);
    }
    return arr;
}