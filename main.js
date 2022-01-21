// Selectors.
const bookList = document.querySelector('.book-list');
const displayModal = document.getElementById('display-modal');
const closeModal = document.querySelector('.modal-close');
const readBtns = Array.from(document.querySelectorAll('.read-btn'));
const addBookBtn = document.querySelector('.add-new-book');
const deleteAllBtn = document.querySelector('#delete-all');

// Variables.
let storedBooks = [];

let library = {
  // Update localStorage
  updateLocalStorage() {
    localStorage.setItem('library', JSON.stringify(storedBooks));
  },

  // Add dataset.
  addDataset() {
    let displayedBooks = Array.from(document.querySelectorAll('.stored-book'));
    let dataNum = 0;
    displayedBooks.forEach((div) => {
      div.dataset.bookNumber = dataNum;
      dataNum++;
    });
  },

  // Creates Html element.
  createHTML(title, author, pages, read) {
    let divElement = document.createElement('div');

    // Create inner HTML.
    divElement.innerHTML = `
    <p class="list-title">${title}</p>
    <p class="list-author">${author}</p>
    <p class="list-pages">${pages}</p>
    <button class="list-read">${read === true ? 'Yes' : 'No'}</button>
    <button class="list-delete">Delete</button>
    `;

    // Add class and dataset
    divElement.classList.add('stored-book');

    // Append element.
    bookList.appendChild(divElement);

    // Add dataset.
    this.addDataset();
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
      this.updateLocalStorage();
    }
  },

  deleteBook(bookIdx, divEl) {
    // Delete with given index.
    storedBooks.splice(bookIdx, 1);

    // Update localStorage.
    this.updateLocalStorage();

    // Delete selected element.
    divEl.remove();

    // Add dataset att. to remaining elements.
    this.addDataset();
  },

  changeReadStatus(bookIdx, btnEl) {
    // Invert values and change text content.
    if (storedBooks[bookIdx].read === true) {
      storedBooks[bookIdx].read = false;
      btnEl.textContent = 'No';
    } else {
      storedBooks[bookIdx].read = true;
      btnEl.textContent = 'Yes';
    }

    // Update localStorage.
    this.updateLocalStorage();
  },

  deleteAllBooks() {
    // Reset storedBooks variable.
    storedBooks = [];

    // Update localStorage.
    localStorage.setItem('library', JSON.stringify(storedBooks));

    // Remove childs.
    while (bookList.lastChild) {
      bookList.removeChild(bookList.lastChild);
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
    library.updateLocalStorage();
  }
}

// Delete book.
let deleteBookBtn = Array.from(document.querySelectorAll('.list-delete'));

deleteBookBtn.forEach((delBtn) => {
  delBtn.addEventListener('click', function (e) {
    let bookIdx = +e.target.parentElement.dataset.bookNumber;
    let divEl = e.target.parentElement;

    library.deleteBook(bookIdx, divEl);
  });
});

// Select all read btns on .list-read
let readStatusBtn = Array.from(document.querySelectorAll('.list-read'));

// Change read status.
readStatusBtn.forEach((readBtn) => {
  readBtn.addEventListener('click', function (e) {
    let bookIdx = +e.target.parentElement.dataset.bookNumber;
    let btnEl = e.target;
    library.changeReadStatus(bookIdx, btnEl);
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

  // Check if there is value.
  if (titleIF.value && titleIF.value !== ' ') {
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
    library.createHTML(
      titleIF.value,
      authorIF.value,
      pagesIF.value,
      hasBeenRead
    );

    // Store book.
    newBook.storeThisBook();

    // Clear IF
    titleIF.value = '';
    authorIF.value = '';
    pagesIF.value = '';
  } else {
    // Add red border
    titleIF.style.border = '2px solid red';
  }

  deleteBookBtn = Array.from(document.querySelectorAll('.list-delete'));

  deleteBookBtn.forEach((delBtn) => {
    delBtn.addEventListener('click', function (e) {
      let bookIdx = +e.target.parentElement.dataset.bookNumber;
      let divEl = e.target.parentElement;

      library.deleteBook(bookIdx, divEl);
    });
  });

  readStatusBtn = Array.from(document.querySelectorAll('.list-read'));

  // Change read status.
  readStatusBtn.forEach((readBtn) => {
    readBtn.addEventListener('click', function (e) {
      let bookIdx = +e.target.parentElement.dataset.bookNumber;
      let btnEl = e.target;
      library.changeReadStatus(bookIdx, btnEl);
    });
  });
});

deleteAllBtn.addEventListener('click', library.deleteAllBooks);

// Toggle bg-active class
function toggleModal() {
  const modalBg = document.querySelector('.modal-bg');
  modalBg.classList.toggle('bg-active');
}

// Display and close modal window
displayModal.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);
