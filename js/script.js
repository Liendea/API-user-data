// - USERS -
// [X] 1. Hämta all användardata
// [X] 2. Skapa användarkort för alla användare och visa i DOM
// [X] 3. Lägg till funnktionaltet på korten ("more info" och filter möjlighet)
// [X] 4. Skapa profilbild på användarkort

// - INLÄGG -
// [X] 1. Hämta alla inlägg
// [X] 2. Lägg till random bild till varje inlägg
// [X] 3. Filtrera inlägg när användarkort klickas
// [X] 4. Lägg till gilla funktion på inläggen
//

let allUsers = [];
let allPosts = [];
let postElements = [];

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------//
  // ---------------------- USERS ---------------------------//

  // 1. Hämta all användardata och skapa användarkort och visa i DOM
  async function fetchUserData() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      const userData = await response.json(); // Konvertera till JS objekt
      allUsers = userData; // Lagra UserData i allUsers Array

      userData.forEach((user) => {
        const userDiv = createUserCard(user); // Skapa användarkort
        displayUserCard(userDiv); // Lägg till användarkort i DOM

        // Hantera "More info" knappen
        handleMoreInfoButton(userDiv);

        // Klicka på användarkortet för att visa inlägg
        handleUserCardClick(userDiv, user);
      });

      await getPosts(); // Hämta alla inlägg efter att användarna är laddade
    } catch (error) {
      console.error("Ett fel uppstod när användare skulle hämtas:", error);
    }
  }

  // 2. Skapa användarkort för alla användare och visa i DOM
  function createUserCard(user) {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user-card");

    userDiv.innerHTML = `
      <div class="img-container">
        <div class="profile-img"></div>
      </div>
      <div class="user-data">
        <h4>${user.username}</h4>
        <p>${user.name}</p>
        <p>${user.email}</p>
      </div>
      <div class="more-info hidden">
      <br>
        <hr>
        <br>
        <p>City: ${user.address.city}</p>
        <p>Phone: ${user.phone}</p>
        <p>Company: ${user.company.name}</p>
      </div>
      <div class="button-container">
        <button class="expand-btn">More info</button>
      </div>
    `;

    getProfileImg(userDiv, user); // Skapa profilbild
    return userDiv;
  }

  // Funktion för att lägga till användarkort i DOM
  function displayUserCard(userDiv) {
    const usersContainer = document.querySelector(".users-container");
    usersContainer.appendChild(userDiv);
  }

  // Funktion för att hantera "More info"-knappen
  function handleMoreInfoButton(userDiv) {
    const button = userDiv.querySelector(".expand-btn");

    button.addEventListener("click", () => {
      const moreInfoDiv = userDiv.querySelector(".more-info");
      moreInfoDiv.classList.toggle("hidden");

      if (moreInfoDiv.classList.contains("hidden")) {
        button.innerHTML = "More info";
      } else {
        button.innerHTML = "Less info";
      }
    });
  }

  // Funktion för att hantera användarkortets klick
  function handleUserCardClick(userDiv, user) {
    userDiv.addEventListener("click", () => {
      document.querySelectorAll(".user-card").forEach((div) => {
        div.classList.remove("active");
      });

      userDiv.classList.toggle("active");

      if (userDiv.classList.contains("active")) {
        filterPosts(user.id, user.username);
      } else {
        displayAllPosts();
      }
    });
  }

  // Funktion för att generera en profilbild baserat på användarens initialer
  function getProfileImg(userDiv, user) {
    const profileImg = userDiv.querySelector(".profile-img");
    const userInitials = getInitials(user.name);
    profileImg.textContent = userInitials;
  }

  // Funktion för att hämta initialer från användarens namn
  function getInitials(name) {
    const nameParts = name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  }

  // ---------------------------------------------------------//
  // ---------------------- POSTS ---------------------------//

  // Funktion för att hämta alla inlägg och visa dem i DOM
  async function fetchPosts() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    return response.json();
  }

  // Funktion för att hämta alla inlägg och skapa dem i DOM
  async function getPosts() {
    try {
      const postData = await fetchPosts();
      allPosts = postData;
      createPostElements(); // Skapa alla inlägg
    } catch (error) {
      console.error("Ett fel uppstod vid hämtning av inlägg:", error);
    }
  }

  // Skapa alla inlägg en gång och spara referenser i postElements
  function createPostElements() {
    const postsContainer = document.querySelector(".posts-container");
    postsContainer.innerHTML = ""; // Rensa inlägg vid start

    allPosts.forEach((post, index) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");
      postDiv.dataset.userId = post.userId; // Sätt data-attribute för användarens ID

      const user = allUsers.find((user) => user.id === post.userId);
      const username = user ? user.username : "Unknown";

      postDiv.innerHTML = `
        <h3>${username}</h3>
        <div class="post-img-container">
          <img class="post-img" src="" alt="random image" width="500">
        </div>
        <div class="interaction">
          <i class="fa-regular fa-heart fa-xl"></i>
        <span id="likes"> 0 </span> </div>
        <div class="post_content">
          <h4>${post.title}</h4>
          <p>${post.body}</p>
        </div>
      `;
      randomImage(postDiv, index);
      postsContainer.appendChild(postDiv);

      postElements.push(postDiv); // Spara referensen till postDiv i arrayen
    });

    // Gilla funktionalitet
    let heart_buttons = document.querySelectorAll(".interaction");

    heart_buttons.forEach((heart_button) => {
      let like_counter = 0;

      heart_button.addEventListener("click", () => {
        heart_button.classList.toggle("klickad");

        if (heart_button.classList.contains("klickad")) {
          like_counter++;
          heart_button.innerHTML = `<i class="fa-solid fa-heart fa-xl" style="color: #ff0000;"></i><span> ${like_counter}</span>`;
        } else {
          like_counter--;
          heart_button.innerHTML = `<i class="fa-regular fa-heart fa-xl"></i><span> ${like_counter}</span>`;
        }
      });
    });
  }

  // Funktion för att visa alla inlägg
  function displayAllPosts() {
    postElements.forEach((postDiv) => {
      postDiv.style.display = "block"; // Visa alla inlägg
    });
  }

  // Funktion för att visa inlägg för en specifik användare
  function filterPosts(userId) {
    postElements.forEach((postDiv) => {
      if (postDiv.dataset.userId == userId) {
        postDiv.style.display = "block"; // Visa inlägg för den valda användaren
      } else {
        postDiv.style.display = "none"; // Dölja inlägg som inte tillhör den valda användaren
      }
    });
  }

  // Funktion för att generera en slumpmässig bild
  function randomImage(postDiv, index) {
    const postImg = postDiv.querySelector(".post-img");
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const imageURL = `https://picsum.photos/id/${index + randomNumber}/600/400`;

    postImg.setAttribute("src", imageURL);
    postImg.onerror = function () {
      postImg.setAttribute("src", "/img/fallback-img.png");
    };
  }

  // Hantera när användaren klickar på "See all posts"
  const seeAllPosts = document.querySelector(".see-all-posts");
  seeAllPosts.addEventListener("click", () => {
    displayAllPosts(); // Visa alla inlägg när "See all posts" är klickat
  });

  // Anropa fetchUserData  för att starta processen
  fetchUserData();
});
