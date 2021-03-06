// <!----------- APP CODE <!-----------
const form = document.getElementById('bookForm');
const bookDisplay = document.querySelector('.book-display');
const inputs = document.querySelectorAll('.form-input');

// Display entries on page load
window.addEventListener('DOMContentLoaded', () => {
    // Check if book data is in localStorage then populate arrays
    const isBook = localStorage.getItem('newBookData');
    if(!isBook) {
        library = [];
        codeToDisplay = [];
    } else {
        library = JSON.parse(localStorage.getItem('newBookData'));
    }

    // Display book data
    if(localStorage.length > 1) {
        codeToDisplay = JSON.parse(localStorage.getItem('HTML'));
        codeToDisplay.forEach((entry) => {
            bookDisplay.innerHTML = entry;
        })

        // Remove
        const removeBtn = document.querySelectorAll('.removeBtn');
        removeBook(removeBtn);

        // Edit
        const editBtn = document.querySelectorAll('.editBtn');
        editReview(editBtn);
    }
})


form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const data = Object.fromEntries(new FormData(e.target).entries());

    // Validate entry then display
    validateEntry(library, data);
})

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

        // Stored HTML code
        pushToArr(codeToDisplay, displayBooks, 'HTML');

        clearInputs();
    } else console.log('nothing here');
}

function removeBook(remove) {
    remove.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            // Iterate over array to match target book name with object key name stored in array
            if(library.length > 0) {
                entryHandler(e, removeEntry);
            } else return;
        })
    })
}

function editReview(edit) {
    edit.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            // Create modal upon clicking
            createModal();

            // Close modal
            const closeBtn = document.querySelector('.modal-close-btn');
            const modalParent = document.querySelector('.book-data');
            const aside = document.querySelector('.modal-show');
            closeBtn.addEventListener('click', () => {
                modalParent.removeChild(aside);
            })

            // Edit review
            entryHandler(e, editEntry);
        })
    })
}

// <!----------- Helper functions <!-----------

// Push data to array
function pushToArr(arr, data, key) {
    arr.push(data);
    localStorage.setItem(key, JSON.stringify(arr));
}

// Match and remove
function removeEntry(entry) {
    // Remove item from array & storage
    const index = library.indexOf(entry);
    library.splice(index, 1);
    codeToDisplay.splice(index, 1);

    // Update storage after splice
    localStorage.setItem('newBookData', JSON.stringify(library));
    localStorage.setItem('HTML', JSON.stringify(codeToDisplay));

    location.reload();
}

// Match and edit
function editEntry() {
    console.log('matched')

    // Get updated form data
    const form = document.getElementById('modalForm');
    const modalParent = document.querySelector('.book-data');
    const aside = document.querySelector('.modal-show');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedData = Object.fromEntries(new FormData(e.target).entries());
        if(updatedData) {
            // Map over arr and change key value
            library.map((storedBook) => {
                if(storedBook.hasOwnProperty('review')) {
                    storedBook.review = updatedData.review;
                    localStorage.setItem('newBookData', JSON.stringify(library));

                    // TODO: replace html code with new edited entry
                } else console.log('no such thing')
            })

            modalParent.removeChild(aside);
        }
    })
}

// Match and handle book
function entryHandler(e, callback) {
    const matchedEl = domTraversal(e);
    library.forEach((book) => {
        if(book.name === matchedEl) {
            callback(book);
        } else console.log('error');
    })
}

// Clear inputs
function clearInputs() {
    inputs.forEach((input) => {
        return input.value = '';
    })

    location.reload();
}

// Validate inputs
function validateEntry(library, data) {
    inputs.forEach((input) => {
        if(!input.value || input.value === '') {
            return
        } else {
            // Push to array
            pushToArr(library, data, 'newBookData');

            // Display on page
            addBook(library);
        };
    })
}

// Traverse DOM
function domTraversal(e) {
    const a = e.target.parentElement.parentElement;
    const b = a.children[0].children[1].children[0];
    const c = b.textContent;
    return c;
}

// Create edit modal
function createModal() {
    // Init aside HTML element
    const aside = document.createElement('aside');
    aside.classList.add('modal-show');

    // Init h5
    const h5 = document.createElement('h5');
    h5.classList.add('modal-heading');
    h5.textContent = 'update review';

    // Init span and close btn
    const span = document.createElement('span');
    const closeBtn = document.createElement('button');
    span.classList.add('h5-close');
    closeBtn.classList.add('modal-close-btn');
    closeBtn.textContent = 'X';

    // Init form
    const form = document.createElement('form');
    form.classList.add('modal-form');
    form.id = 'modalForm'

    // Init label
    const label = document.createElement('label');
    label.classList.add('modal-label');
    label.htmlFor = 'newReview';

    // Init textarea
    const textarea = document.createElement('textarea');
    textarea.classList.add('form-review');
    textarea.classList.add('modal-review');
    textarea.id = 'newReview';
    textarea.form = 'modalForm';
    textarea.name = 'review';
    textarea.placeholder = 'Update your review?';

    // Init submit form button
    const submit = document.createElement('button');
    submit.classList.add('form-btn');
    submit.id = 'update';
    submit.type = 'submit';
    submit.textContent = 'update';

    // Make nodelist of children
    span.append(closeBtn);
    h5.append(span);
    form.append(label, textarea, submit);
    aside.append(h5, form);

    // Hook children to parent
    const modalParent = document.querySelector('.book-data');
    modalParent.appendChild(aside);
}