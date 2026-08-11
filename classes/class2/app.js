import { books, rents, users } from "./db.js";
import {
  bookPatchValidate,
  bookUpdateValidate,
  bookValidate,
  rentValidate,
  userPatchValidate,
  userUpdateValidate,
  userValidate,
} from "./check.js";
import { messages } from "./messages.js";

// Import Express to create the server and handle HTTP routes
import express from "express";

// Initialize the Express application
const app = express();

// Configure Express to read request bodies in JSON format
app.use(express.json());

const validationOptions = {
  abortEarly: false,
  stripUnknown: true,
};

const validateBody = (schema, body, res) => {
  const { error, value } = schema.validate(body, validationOptions);

  if (error) {
    res.status(400).json({
      message: messages.invalidData,
      errors: error.details.map((detail) => detail.message),
    });
    return null;
  }

  return value;
};

const parseId = (id, res) => {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 0) {
    res.status(400).json({
      message: messages.invalidId,
    });
    return null;
  }

  return parsedId;
};

const removeRentsBy = (field, id) => {
  for (let index = rents.length - 1; index >= 0; index--) {
    if (rents[index][field] === id) {
      rents.splice(index, 1);
    }
  }
};

// POST '/bib/user' : register a user (user_id, name, cpf, email, password).
app.post("/bib/user", (req, res) => {
  const value = validateBody(userValidate, req.body, res);
  if (!value) return;

  const userExists = users.some((user) => {
    return (
      (value.user_id !== undefined && user.user_id === value.user_id) ||
      user.cpf === value.cpf ||
      user.email === value.email
    );
  });

  if (userExists) {
    return res.status(409).json({
      message: messages.dataAlreadyExists,
    });
  }

  users.push(value);

  return res.status(201).json({
    message: messages.createdSuccessfully,
    user: value,
  });
});

// POST '/bib/livro' : register a book (book_id, title, isbn, edition, year).
app.post("/bib/livro", (req, res) => {
  const value = validateBody(bookValidate, req.body, res);
  if (!value) return;

  const bookExists = books.some((book) => {
    return (
      (value.book_id !== undefined && book.book_id === value.book_id) ||
      book.isbn === value.isbn
    );
  });

  if (bookExists) {
    return res.status(409).json({
      message: messages.dataAlreadyExists,
    });
  }

  books.push(value);

  return res.status(201).json({
    message: messages.createdSuccessfully,
    book: value,
  });
});

// POST '/bib/locar' : register a book rent (user_id, book_id, status).
app.post("/bib/locar", (req, res) => {
  const value = validateBody(rentValidate, req.body, res);
  if (!value) return;

  const userExists = users.some((user) => user.user_id === value.user_id);
  const bookExists = books.some((book) => book.book_id === value.book_id);

  if (!userExists || !bookExists) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  const rentExists = rents.some((rent) => {
    return rent.user_id === value.user_id && rent.book_id === value.book_id;
  });

  if (rentExists) {
    return res.status(409).json({
      message: messages.dataAlreadyExists,
    });
  }

  rents.push(value);

  return res.status(201).json({
    message: messages.createdSuccessfully,
    rent: value,
  });
});

// GET '/bib/user' : list users (JSON format).
app.get("/bib/user", (req, res) => {
  return res.status(200).json(users);
});

// GET '/bib/livro' : list books (JSON format).
app.get("/bib/livro", (req, res) => {
  return res.status(200).json(books);
});

// GET '/bib/livro/:id' : list a book by id (JSON format).
app.get("/bib/livro/:id", (req, res) => {
  const bookId = parseId(req.params.id, res);
  if (bookId === null) return;

  const book = books.find((book) => book.book_id === bookId);

  if (!book) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  return res.status(200).json(book);
});

// GET '/bib/locar' : list book rents with user name, book name, and rent status (JSON format).
app.get("/bib/locar", (req, res) => {
  const rentList = rents.map((rent) => {
    const user = users.find((user) => user.user_id === rent.user_id);
    const book = books.find((book) => book.book_id === rent.book_id);

    return {
      user_name: user?.name,
      book_title: book?.title,
      status: rent.status,
    };
  });

  return res.status(200).json(rentList);
});

// PUT '/bib/user/:id' : update a user by id.
app.put("/bib/user/:id", (req, res) => {
  const userId = parseId(req.params.id, res);
  if (userId === null) return;

  const userIndex = users.findIndex((user) => user.user_id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  const value = validateBody(userUpdateValidate, req.body, res);
  if (!value) return;

  const userExists = users.some((user) => {
    return (
      user.user_id !== userId &&
      (user.cpf === value.cpf || user.email === value.email)
    );
  });

  if (userExists) {
    return res.status(409).json({
      message: messages.dataAlreadyExists,
    });
  }

  users[userIndex] = {
    ...value,
    user_id: userId,
  };

  return res.status(200).json({
    message: messages.updatedSuccessfully,
    user: users[userIndex],
  });
});

// PATCH '/bib/user/:id' : partially update a user by id.
app.patch("/bib/user/:id", (req, res) => {
  const userId = parseId(req.params.id, res);
  if (userId === null) return;

  const userIndex = users.findIndex((user) => user.user_id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  const value = validateBody(userPatchValidate, req.body, res);
  if (!value) return;

  const userExists = users.some((user) => {
    return (
      user.user_id !== userId &&
      ((value.cpf !== undefined && user.cpf === value.cpf) ||
        (value.email !== undefined && user.email === value.email))
    );
  });

  if (userExists) {
    return res.status(409).json({
      message: messages.dataAlreadyExists,
    });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...value,
    user_id: userId,
  };

  return res.status(200).json({
    message: messages.updatedSuccessfully,
    user: users[userIndex],
  });
});

// PUT '/bib/livro/:id' : update a book by id.
app.put("/bib/livro/:id", (req, res) => {
  const bookId = parseId(req.params.id, res);
  if (bookId === null) return;

  const bookIndex = books.findIndex((book) => book.book_id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  const value = validateBody(bookUpdateValidate, req.body, res);
  if (!value) return;

  const bookExists = books.some((book) => {
    return book.book_id !== bookId && book.isbn === value.isbn;
  });

  if (bookExists) {
    return res.status(409).json({
      message: messages.dataAlreadyExists,
    });
  }

  books[bookIndex] = {
    ...value,
    book_id: bookId,
  };

  return res.status(200).json({
    message: messages.updatedSuccessfully,
    book: books[bookIndex],
  });
});

// PATCH '/bib/livro/:id' : partially update a book by id.
app.patch("/bib/livro/:id", (req, res) => {
  const bookId = parseId(req.params.id, res);
  if (bookId === null) return;

  const bookIndex = books.findIndex((book) => book.book_id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  const value = validateBody(bookPatchValidate, req.body, res);
  if (!value) return;

  const bookExists = books.some((book) => {
    return (
      book.book_id !== bookId &&
      value.isbn !== undefined &&
      book.isbn === value.isbn
    );
  });

  if (bookExists) {
    return res.status(409).json({
      message: messages.dataAlreadyExists,
    });
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...value,
    book_id: bookId,
  };

  return res.status(200).json({
    message: messages.updatedSuccessfully,
    book: books[bookIndex],
  });
});

// DELETE '/bib/user/:id' : remove a user by id and all related rents.
app.delete("/bib/user/:id", (req, res) => {
  const userId = parseId(req.params.id, res);
  if (userId === null) return;

  const userIndex = users.findIndex((user) => user.user_id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  const [deletedUser] = users.splice(userIndex, 1);
  removeRentsBy("user_id", userId);

  return res.status(200).json({
    message: messages.deletedSuccessfully,
    user: deletedUser,
  });
});

// DELETE '/bib/livro/:id' : remove a book by id and all related rents.
app.delete("/bib/livro/:id", (req, res) => {
  const bookId = parseId(req.params.id, res);
  if (bookId === null) return;

  const bookIndex = books.findIndex((book) => book.book_id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      message: messages.dataNotFound,
    });
  }

  const [deletedBook] = books.splice(bookIndex, 1);
  removeRentsBy("book_id", bookId);

  return res.status(200).json({
    message: messages.deletedSuccessfully,
    book: deletedBook,
  });
});
