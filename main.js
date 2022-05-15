const form = document.getElementById('bookForm');
const bookDisplay = document.querySelector('.book-display');
let library = [];

// Display entries on page load
window.addEventListener('DOMContentLoaded', () => {
    // Check if book data is in localStorage then populate array
    const isBook = localStorage.getItem('newBookData');
    if(!isBook) {
        library = []
    } else {
        library = JSON.parse(localStorage.getItem('newBookData'))
    }

    // Display book data
    const stored = localStorage.getItem('library');
    if(stored) {
        bookDisplay.innerHTML = stored;
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
                    <h4 id="nameOfAuthor" class="'book-author">${book.author}r</h4>
                    <p id="reviewOfBook" class="book-review">${book.review}</p>
                    </div>
                </div>
                <div class="book-controls">
                    <button id="remove" class="ctrl-btn">Remove</button>
                    <button id="edit" class="ctrl-btn">Edit</button>
                </div>
            </article>`
        })

        displayBooks = displayBooks.join('');
        bookDisplay.innerHTML = displayBooks;
    } else console.log('nothing here');
}