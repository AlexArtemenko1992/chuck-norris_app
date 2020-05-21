function customHttp() {
  return {
    getRequest(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
  };
}
const https = customHttp();

const jokesService = (function () {
  const apiUrl = "https://api.chucknorris.io/jokes/";
  return {
    randomJoke(cb) {
      https.getRequest(`${apiUrl}random`, cb);
    },
    categoryJoke(category, cb) {
      https.getRequest(`${apiUrl}random?category=${category}`, cb);
    },
    searchJoke(query, cb) {
      https.getRequest(`${apiUrl}search?query=${query}`, cb);
    },
  };
})();

// !---------------------- Burger ---------------------------
const asideBlock = document.querySelector(".aside-content");
const burgerMenu = document.querySelector(".burger-menu");
const burgerMenuBtn = document.querySelector(".burger-menu__button");
const burgerMenuOverlay = document.querySelector(".burger-menu__overlay");

function toggleMenu() {
  burgerMenu.classList.toggle("burger-menu_active");
  if (burgerMenu.classList.contains("burger-menu_active")) {
    asideBlock.style.display = "block";
  } else {
    asideBlock.style.display = "none";
  }
}

burgerMenuBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleMenu();
});

burgerMenuOverlay.addEventListener("click", (e) => {
  e.preventDefault();
  toggleMenu();
});

const searchPanel = document.querySelector(".search-panel");
const allFormRadioInputs = document.querySelectorAll(".radio");
const categoriesWrapper = document.querySelector(".categories-input-wrapper");
const searchWrapper = document.querySelector(".search-input-wrapper");
const selectionBtn = document.querySelector(".selection-btn");
const random = document.querySelector(".input-item-random");
const categories = document.querySelector(".input-item-categories");
const jokesList = document.querySelector(".jokes-list");
const favorite = document.querySelector(".aside-content");

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    const currentValue = JSON.parse(localStorage.getItem(key));
    const savedJoke = generateFavoriteItem(currentValue);
    favorite.insertAdjacentHTML("beforeend", savedJoke);
  });
  const favoriteItem = document.querySelectorAll(".favorite-item");
  favoriteItem.forEach((item) => {
    item.addEventListener("click", (e) => {
      console.log(e.target);
      if (e.target.classList.contains("fa-heart")) {
        console.log(item.id);
        localStorage.removeItem(item.id);
        item.remove();
      }
    });
  });
});

const categoryBtn = document.querySelector(".input-item-categories");
categoryBtn.addEventListener("change", (e) => {
  e.stopPropagation();
  if (e.target.id === "categories") {
    const btnGroup = createBtnGroup();
    categoriesWrapper.insertAdjacentHTML("beforeend", btnGroup);
  }
});

const searchField = document.querySelector(".input-item-searh");
searchField.addEventListener("change", (e) => {
  e.stopPropagation();
  if (e.target.id === "search") {
    const searchField = createSearchInput();
    searchWrapper.insertAdjacentHTML("beforeend", searchField);
  }
});

searchPanel.addEventListener("submit", (e) => {
  e.preventDefault();

  if (searchPanel.elements.random.checked) {
    jokesService.randomJoke((err, res) => {
      const buildHtml = buildJoke(res);
      jokesList.insertAdjacentHTML("afterbegin", buildHtml);
      heartsHendler(buildHtml, res);
    });
  }

  if (searchPanel.elements.categories.checked) {
    const toolBar = document.querySelector(".radio-toolbar");

    if (searchPanel.elements.radio1.checked) {
      const selectedBtn = searchPanel.elements.radio1.value;
      jokesService.categoryJoke(selectedBtn, (err, res) => {
        const buildHtml = buildJoke(res);
        jokesList.insertAdjacentHTML("afterbegin", buildHtml);
        heartsHendler(buildHtml, res);
      });
    }
    if (searchPanel.elements.radio2.checked) {
      const selectedBtn = searchPanel.elements.radio2.value;
      jokesService.categoryJoke(selectedBtn, (err, res) => {
        const buildHtml = buildJoke(res);
        jokesList.insertAdjacentHTML("afterbegin", buildHtml);
        heartsHendler(buildHtml, res);
      });
    }
    if (searchPanel.elements.radio3.checked) {
      const selectedBtn = searchPanel.elements.radio3.value;
      jokesService.categoryJoke(selectedBtn, (err, res) => {
        const buildHtml = buildJoke(res);
        jokesList.insertAdjacentHTML("afterbegin", buildHtml);
        heartsHendler(buildHtml, res);
      });
    }
    if (searchPanel.elements.radio4.checked) {
      const selectedBtn = searchPanel.elements.radio4.value;
      jokesService.categoryJoke(selectedBtn, (err, res) => {
        const buildHtml = buildJoke(res);
        jokesList.insertAdjacentHTML("afterbegin", buildHtml);
        heartsHendler(buildHtml, res);
      });
    }
    toolBar.remove();
  } else {
    createBtnGroup.remove();
  }

  if (searchPanel.elements.search.checked) {
    const searhInput = document.querySelector(".search-field-input");
    jokesService.searchJoke(searhInput.value, (err, res) => {
      const resultJoke = res.result[Math.floor(Math.random() * res.result.length)];
      const buildHtml = buildJoke(resultJoke);
      jokesList.insertAdjacentHTML("afterbegin", buildHtml);
      heartsHendler(buildHtml, resultJoke);
    });
    searhInput.value = "";
    const searchFieldWrapper = document.querySelector(".search-field");
    searchFieldWrapper.remove();
  }
});

function createBtnGroup() {
  return `
    <div class="radio-toolbar"> 
        <input type="radio" id="radio1" name="radios" value="animal" checked>
        <label for="radio1">ANIMAL</label>
        
        <input type="radio" id="radio2" name="radios" value="career">
        <label for="radio2">CAREER</label>
        
        <input type="radio" id="radio3" name="radios" value="celebrity">
        <label for="radio3">CELEBRITY</label>

        <input type="radio" id="radio4" name="radios" value="dev">
        <label for="radio4">DEV</label>
    </div> 
 	`;
}

function createSearchInput() {
  return `
		<div class='search-field'>
			<input type='text' placeholder='Free text search' class='search-field-input'/>
		</div>
	`;
}

function buildJoke(jokes) {
  const { categories, id, updated_at, url, value } = jokes;
  return `
		<div class='joke-item'>
      <i class="far fa-heart"></i>
			<div class='joke-icon-message'>
        <i class="far fa-comment-alt"></i>
        <span class="comment-line"></span>
			</div>
			<div class='joke-item_info'>
				<span class='joke-item_id'>ID: <a href='${url}' class='joke-item_link'>${id}  <i class="fas fa-external-link-alt"></i></a></span>
				<p class='joke-item_text'>${value}</p>
				<div class='joke-item-date'>
					<span class='joke-item-lastUpd'>Last update: <span>${updated_at}</span></span>
					<span class='joke-item-category'>${categories[0] || "Categories not found"}</span>
				</div>
			</div>
		</div>
	`;
}

function generateFavoriteItem(data) {
  const { id, updated_at, url, value } = data;
  const currentDate = new Date();
  const lastDate = new Date(updated_at);
  const result = Math.floor(
    (currentDate.toLocaleTimeString() - lastDate.toLocaleTimeString()) / 1000 / 60 / 60,
  );
  console.log(result);

  return `
		<div class='favorite-item' id='${id}'>
      <i class="fas fa-heart"></i>
			<div class='favorite-icon-message'>
        <i class="far fa-comment-alt"></i>
        <span class="comment-line"></span>
			</div>
			<div class='favorite-item_info'>
				<span class='favorite-item_id'>ID: <a href='${url}' class='joke-item_link'>${id}  <i class="fas fa-external-link-alt"></i></a></span>
				<p class='favorite-item_text'>${value}</p>
				<div class='favorite-item-date'>
					<span class='favorite-item-lastUpd'>Last update: <span>${updated_at}</span></span>
				</div>
			</div>
		</div>
	`;
}

function heartsHendler(item, res) {
  console.log(item, res);
  const jokeItem = document.querySelector(".joke-item");
  jokeItem.setAttribute("id", res.id);

  jokeItem.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-heart")) {
      e.target.classList.toggle("fas");

      if (e.target.classList.contains("fas")) {
        localStorage.setItem(res.id, JSON.stringify(res));
        const newItem = JSON.parse(localStorage.getItem(res.id));
        const newItemHtml = generateFavoriteItem(newItem);
        favorite.insertAdjacentHTML("beforeend", newItemHtml);
      }
      if (!e.target.classList.contains("fas")) {
        localStorage.removeItem(res.id);
        const favoriteItem = document.querySelector(".favorite-item");
        favoriteItem.remove();
      }
    }
  });
}
