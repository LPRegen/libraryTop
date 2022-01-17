// Selectors.
const bookList = document.querySelector('.book-list');
const modalBg = document.querySelector('.modal-bg');
const displayModal = document.getElementById('display-modal');
const closeModal = document.querySelector('.modal-close');
const readBtns = Array.from(document.querySelectorAll('.read-btn'));
const addBookBtn = document.querySelector('.add-new-book');

// Variables.
let storedBooks = [];
let bookCount = 0;

let library = {
  // Creates Html element.
  createHTML(title, author, pages, read) {
    let divElement = document.createElement('div');

    // Create inner HTML.
    divElement.innerHTML = `
    <p class="list-title">${title}</p>
    <p class="list-author">${author}</p>
    <p class="list-pages">${pages}</p>
    <p class="list-read">${read === true ? 'Yes' : 'No'}</p>
    <button class="list-delete">Delete</button>
    `;

    // Add class and dataset
    divElement.classList.add('stored-book');
    divElement.dataset.bookNumber = bookCount;
    // Append element.
    bookList.appendChild(divElement);

    // Update bookCount
    bookCount++;
  },

  // Check if there is localStorage, otherwise creates it
  storage() {
    if (localStorage.getItem('library')) {
      storedBooks = JSON.parse(localStorage.getItem('library'));
      // Create html elements.
      for (let i = 0; i < storedBooks.length; i++) {
        this.createHTML(
          storedBooks[i].title,
          storedBooks[i].author,
          storedBooks[i].pages,
          storedBooks[i].read
        );
      }
    } else {
      localStorage.setItem('library', JSON.stringify(storedBooks));
    }
  },

  deleteBook(bookIdx) {
    // Delete with given index.
    storedBooks.splice(bookIdx, 1);
    // Update localStorage.
    localStorage.setItem('library', JSON.stringify(storedBooks));
    // Delete list.
    bookList.innerHTML = '';

    bookCount = 0;
    // Iterate over storedBooks.
    for (let i = 0; i < storedBooks.length; i++) {
      this.createHTML(
        storedBooks[i].title,
        storedBooks[i].author,
        storedBooks[i].pages,
        storedBooks[i].read
      );
    }
  },
};

library.storage();

// Create book.
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  // Store book.
  storeThisBook() {
    storedBooks.push(this);
    localStorage.setItem('library', JSON.stringify(storedBooks));
  }
}

// Delete book.
const deleteBookBtn = Array.from(document.querySelectorAll('.list-delete'));

deleteBookBtn.forEach((delBtn) => {
  delBtn.addEventListener('click', function (e) {
    console.log(e.target);
    let bookIdx = +e.target.parentElement.dataset.bookNumber;
    console.log(bookIdx);
    library.deleteBook(bookIdx);
  });
});

// Check pressed readBtn and add "active" class.
readBtns.forEach((btn) => {
  btn.addEventListener('click', function (e) {
    for (let i = 0; i < readBtns.length; i++) {
      readBtns[i].classList.remove('active');
      e.target.classList.add('active');
    }
  });
});

// Add new book.
addBookBtn.addEventListener('click', function () {
  // Select Input Fields.
  let titleIF = document.querySelector('#new-title');
  let authorIF = document.querySelector('#new-author');
  let pagesIF = document.querySelector('#new-pages');
  let hasBeenRead = document
    .querySelector('#yes-btn')
    .classList.contains('active')
    ? true
    : false;

  // Create book.
  let newBook = new Book(
    titleIF.value,
    authorIF.value,
    pagesIF.value,
    hasBeenRead
  );

  // Create html.
  library.createHTML(titleIF.value, authorIF.value, pagesIF.value, hasBeenRead);

  // Store book.
  newBook.storeThisBook();

  // Clear IF
  // titleIF.value = '';
  // authorIF.value = '';
  // pagesIF.value = '';
});

// Display modal window
displayModal.addEventListener('click', function () {
  modalBg.classList.add('bg-active');
});

// Close modal window.
closeModal.addEventListener('click', function () {
  modalBg.classList.remove('bg-active');
});
