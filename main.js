const form = document.getElementById('bookForm');
const bookDisplay = document.querySelector('.book-display');

// Display entries on page load
window.addEventListener('DOMContentLoaded', () => {
    // Check if book data is in localStorage then populate array
    const isBook = localStorage.getItem('newBookData');
    if(!isBook) {
        library = []
    } else {
        library = JSON.parse(localStorage.getItem('newBookData'))
    }

    console.log(localStorage)

    // Display book data
    if(localStorage.length > 1) {
        bookDisplay.innerHTML = localStorage.getItem(localStorage.key(0));

        // Remove
        const removeBtn = document.querySelectorAll('.removeBtn');
        removeBook(removeBtn);

        // Edit
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const data = Object.fromEntries(new FormData(e.target).entries());

    // Push to array
    pushToArr(library, data);

    // HTML Code that gets displayed with each new book entry
    addBook(library);
})

// Push data to array
function pushToArr(arr, data) {
    arr.push(data);
    localStorage.setItem('newBookData', JSON.stringify(arr));
}

// Clear inputs
function clearInputs() {
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach((input) => {
        return input.value = '';
    })

    location.reload();
}

// DOM manipulation when adding a new entry
function addBook(arr) {
    if(arr.length > 0) {
        let displayBooks = arr.map((book) => {
            return `
            <article class="book">
                <div class="book-details">
                    <div class="book-cover">
                    <img src="${book.cover}" alt="${book.name}" class="cover-img">
                    </div>
                    <div class="book-data">
                    <h3 id="nameOfBook" class="book-name">${book.name}</h3>
                    <h4 id="nameOfAuthor" class="'book-author">${book.author}</h4>
                    <p id="reviewOfBook" class="book-review">${book.review}</p>
                    </div>
                </div>
                <div class="book-controls">
                    <button id="remove" class="ctrl-btn removeBtn">Remove</button>
                    <button id="edit" class="ctrl-btn editBtn">Edit</button>
                </div>
            </article>`
        })
        displayBooks = displayBooks.join('');
        bookDisplay.innerHTML = displayBooks;

        // Store into local storage
        arr.forEach((book, i) => {
            localStorage.setItem(`${i + 1}`, displayBooks)
        })

        clearInputs();
    } else console.log('nothing here');
}

function removeBook(remove) {
    remove.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            console.log(library);

            // Traverse DOM looking for book name
            const a = e.target.parentElement.parentElement;
            const b = a.children[0].children[1].children[0];
            const c = b.textContent;

            // Iterate over array to match target book name with object key name stored in array
            if(library.length > 0) {
                library.forEach((book) => {
                    if(book.name === c) {
                        // Remove item from array & storage
                        const index = library.indexOf(book);
                        library.splice(index, 1);

                        // Remove HTML from storage
                        localStorage.removeItem(localStorage.key(index));

                        // Update storage after splice
                        localStorage.setItem('newBookData', JSON.stringify(library));
                        // bookDisplay.innerHTML = localStorage.getItem(localStorage.key(0));

                        console.log('removed', library)
                    }
                })
            }
        })
    })
}