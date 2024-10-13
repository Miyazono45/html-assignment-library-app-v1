let currentPage = "home";
let currentBook = null;
let books = [];
const url = "http://localhost:3333";

const main = document.querySelector("main");

const pageListMainContent = `<h2 class="text-2xl font-bold mb-4">Daftar Buku Perpustakaan</h2>

<table class="min-w-full border border-gray-300">
  <thead>
    <tr>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Judul</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Penulis</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Tahun Terbit</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Jumlah</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-center">Action</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>`;

const pageEditBookMainContent = `<h2 class="text-2xl font-bold mb-4">Edit Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleEditForm(event)">
</form>
`;

const pageAddBookMainContent = `<h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleAddForm(event)">
  <div class="mb-4">
    <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
    <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
    <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
    <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
    <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="flex justify-center">
    <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="Tambah Buku" />
  </div>
</form>
`;

async function handleClickEditButton(bookId) {
  try {
    const response = await fetch(`${url}/books/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application / json",
      },
    });

    const resJson = await response.json();
    currentBook = resJson;

    currentPage = "edit";
    loadPage();
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat mengambil data buku");
  }
}
async function handleClickDeleteButton(bookId) {
  try {
    // const confirmation = confirm("Apakah anda yakin ingin menghapus buku ini?");
    // if (!confirmation) {
    //   console.log("wkwwk");
    // } else {
    //   await deleteBook(bookId);
    //   loadPage();
    // }
    await deleteBook(bookId);
    loadPage();
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat menghapus buku");
  }
}

async function handleEditForm(event) {
  try {
    event.preventDefault();

    let book = {};

    book.id = currentBook.id;
    book.title = document.querySelector("#title").value;
    book.author = document.querySelector("#author").value;
    book.year = document.querySelector("#year").value;
    book.quantity = document.querySelector("#quantity").value;

    await editBook(book);

    currentBook = null;

    currentPage = "home";
    loadPage();
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat mengubah buku");
  }
}

async function handleAddForm(event) {
  try {
    event.preventDefault();
    let book = {};

    book.title = document.querySelector("#title").value;
    book.author = document.querySelector("#author").value;
    book.year = document.querySelector("#year").value;
    book.quantity = document.querySelector("#quantity").value;

    await addBook(book);

    currentPage = "home";
    loadPage();
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat menambah buku");
  }
}

function handleClickAddNav() {
  currentPage = "add";
  loadPage();
}

const navLinks = document.querySelectorAll("li a");
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", (e) => {
    handleClickAddNav();
  });
});

function generateRows(books) {
  let rows = "";
  if (books.length === 0) {
    rows = `<tr>
   <td colspan="6" class="px-6 py-4 border-b text-center">Tidak ada buku yang ditemukan</td>
</tr>`;
  } else {
    books.forEach((book, index) => {
      rows += `
      <tr class="book-item">
        <td class="px-6 py-4 border-b">${book.title}</td>
        <td class="px-6 py-4 border-b">${book.author}</td>
        <td class="px-6 py-4 border-b">${book.year}</td>
        <td class="px-6 py-4 border-b">${book.quantity}</td>
        <td class="px-6 py-4 border-b text-center">
          <button class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickEditButton(${book.id})">Edit</button>
          <button class="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickDeleteButton(${book.id})">Hapus</button>  
        </td>
      </tr>
      `;
    });
  }
  return rows;
}

function generateEditFormInput() {
  return `<div class="mb-4">
  <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
  <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.title}">
</div>
<div class="mb-4">
  <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
  <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.author}">
</div>
<div class="mb-4">
  <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
  <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.year}">
</div>
<div class="mb-4">
  <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
  <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.quantity}">
</div>
<div class="flex justify-center">
  <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="simpan" />
</div>`;
}

async function loadPage() {
  switch (currentPage) {
    case "home":
      await fetchBooks();
      console.log("ini loadpage");
      console.log(books);

      main.innerHTML = pageListMainContent;

      const tableBody = document.querySelector("tbody");

      const rows = generateRows(books);
      tableBody.innerHTML = rows;

      break;
    case "edit":
      main.innerHTML = pageEditBookMainContent;

      const form = document.querySelector("form");

      const formInput = generateEditFormInput();
      form.innerHTML = formInput;

      break;
    case "add":
      main.innerHTML = pageAddBookMainContent;
      break;
  }
}

async function fetchBooks() {
  try {
    const response = await fetch(`${url}/books`);
    const resJson = await response.json();
    console.log("ini fetch book");
    console.log(resJson);
    books = resJson;
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat mengambil data buku");
  }
}

async function addBook(book) {
  try {
    const result = await fetch(`${url}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: book.title,
        author: book.author,
        year: book.year,
        quantity: book.quantity,
      }),
    });
    const res = await result.json();
    console.log("ini addbook");
    console.log(res);
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat menambah buku");
  }
}

async function editBook(book) {
  try {
    await fetch(`${url}/books/${book.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: book.title,
        author: book.author,
        year: book.year,
        quantity: book.quantity,
      }),
    });
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat mengubah buku");
  }
}

async function deleteBook(bookId) {
  try {
    await fetch(`${url}/books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application / json",
      },
    });
    return 200;
  } catch (error) {
    console.log(error);
    console.log("Terjadi kesalahan saat menghapus buku");
  }
}

loadPage();
