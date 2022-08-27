document.addEventListener("DOMContentLoaded", () => {//Getting the list of books:
  fetch("http://localhost:3000/books") 
  .then(resp => resp.json()) 
  .then((bookInfo) => generateBookList(bookInfo));
});

const bookList = document.querySelector("#list");

// creating a book list
function generateBookList(books) {
  const bookLI = document.createElement("li");
  bookLI.textContent = books.title;
  bookLI.id = books.id;
  bookList.appendChild(bookLI);

  bookLI.addEventListener("click", (event) => {showBook(event.target.id);});
}

// initiazing the book details
const bookPanel = document.querySelector("#show-panel");
function showBook(bookID) {
  fetch(`http://localhost:3000/books/${bookID}`) 
  .then(resp => resp.json()) 
  .then((bookInfo) => {
    bookPanel.innerHTML = ""; //Clearing  the panel:

    const bookImage = document.createElement("img");
    bookImage.src = bookInfo.img_url;

    const bookTitle = document.createElement("p");
    bookTitle.innerHTML = "<strong>" + bookInfo.title + "</strong>";

    const bookAuthor = document.createElement("p");
    bookAuthor.innerHTML = "<strong>" + bookInfo.author + "</strong>";
          
    const bookDescription = document.createElement("p");
    bookDescription.textContent = bookInfo.description;
   
    const likesList = document.createElement("ul");
  
    bookPanel.appendChild(bookImage, bookTitle, bookAuthor, bookDescription, likesList)

    for(user of bookInfo.users) {
      const likeUser = document.createElement("li");
      likeUser.textContent = user.username;
      likesList.appendChild(likeUser);
    }

    const likeButton = document.createElement("button");
    likeButton.textContent = "Like";
    likeButton.id = bookID;
    bookPanel.appendChild(likeButton);

    likeButton.addEventListener("click", (event) => {  //First we are getting the list of people who like the given book:
      fetch(`http://localhost:3000/books/${event.target.id}`) 
      .then(resp => resp.json()) 
      .then((selectedBookInfo) => { //Then we are getting a list of all users:
        fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then((users) => {
          const randomUser = Math.floor(Math.random() * users.length);
          const currentUser = users[randomUser];
          let match = 0;  //Assuming that  there is no match:

          for(selectedBookUser of selectedBookInfo.users) {
            if(selectedBookUser.id == currentUser.id) {
              match = 1;  //This is a match:
              break;
            }
          }

          if(match === 0) { //if the user is not  on the list. We will add him/her:
            selectedBookInfo.users.push(currentUser);
            const fetchURL = `http://localhost:3000/books/${event.target.id}`;
            const configurationObject = {
              method: "PATCH", 
              headers: {
                "Content-Type": "application/json", 
                "Accept": "application/json"
              },
              body: JSON.stringify({
                "users": selectedBookInfo.users 
              })
            }
            
            fetch(fetchURL, configurationObject) 
            .then((response) => response.json())
            .then(showBook(event.target.id));
          }
        })
      })
    })
  })
}

