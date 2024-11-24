function open_menu() {
  document.getElementById("menu").style.removeProperty("width");
  document.getElementById("menu-open-button").style.left = "-100px";
  document.getElementById("homepage-content-frame").style.removeProperty("margin-left");

}
function close_menu() {
  document.getElementById("menu").style.width = "0px";
  document.getElementById("menu-open-button").style.left = "16px";
  document.getElementById("homepage-content-frame").style.marginLeft = "0px";
}

function open_pop(pop) {
  const popElement = document.getElementById(pop);
  popElement.style.display = "flex";

  function close(e) {
    const menus = document.querySelectorAll(".pop__menu-frame");
    const buttons = document.querySelectorAll(".pop-button");

    const isClickOutsideButton = !Array.from(buttons).some(button => button.contains(e.target));
    const isClickOutsideMenu = !Array.from(menus).some(menu => menu.contains(e.target));

    if (isClickOutsideButton && isClickOutsideMenu) {
      close_pop(pop);
      document.removeEventListener('click', close);
    }
  }

  document.addEventListener('click', close);
}

function close_pop() {
  const settingsFrames = document.querySelectorAll(".pop-window");
  settingsFrames.forEach(frame => {
    frame.style.removeProperty("display");
  });
  document.removeEventListener('click', close);
}


function clear_input(input_name) {
  document.getElementById(input_name).value = "";
}
// Themes

function theme_midnight() {
  document.documentElement.style.setProperty('--main-color-1', '#121212');
  document.documentElement.style.setProperty('--main-color-2', '#1E1E1E');
  document.documentElement.style.setProperty('--main-color-3', '#E0E0E0');
  document.documentElement.style.setProperty('--main-color-4', '#3A3A3A');

  document.documentElement.style.setProperty('--hover-color-1', '#333333');
  document.documentElement.style.setProperty('--hover-color-2', '#121212d4');
  document.documentElement.style.setProperty('--dark-cover', '#000000d5');
  document.documentElement.style.setProperty('--input-color', '#FFFFFF');
}

function theme_default() {
  document.documentElement.style.setProperty('--main-color-1', '#F8EDE3');
  document.documentElement.style.setProperty('--main-color-2', '#D0B8A8');
  document.documentElement.style.setProperty('--main-color-3', '#3B3030');
  document.documentElement.style.setProperty('--main-color-4', '#DFD0C6');

  document.documentElement.style.setProperty('--hover-color-1', '#3b30302a');
  document.documentElement.style.setProperty('--hover-color-2', '#f8ede3be');
  document.documentElement.style.setProperty('--dark-cover', '#000000d5');
  document.documentElement.style.setProperty('--input-color', '#000000');

}

function theme_blossom() {
  document.documentElement.style.setProperty('--main-color-1', '#FEE3E3');
  document.documentElement.style.setProperty('--main-color-2', '#F5B2B2');
  document.documentElement.style.setProperty('--main-color-3', '#7A2A2A');
  document.documentElement.style.setProperty('--main-color-4', '#F5CFCF');

  document.documentElement.style.setProperty('--hover-color-1', '#F09A9A');
  document.documentElement.style.setProperty('--hover-color-2', '#FEE3E3d4');
  document.documentElement.style.setProperty('--dark-cover', '#000000d5');
  document.documentElement.style.setProperty('--input-color', '#3A3A3A');
}

function theme_forest() {
  document.documentElement.style.setProperty('--main-color-1', '#A8D5BA');
  document.documentElement.style.setProperty('--main-color-2', '#7B9A8D');
  document.documentElement.style.setProperty('--main-color-3', '#2F4C4B');
  document.documentElement.style.setProperty('--main-color-4', '#C6E4D6');

  document.documentElement.style.setProperty('--hover-color-1', '#6B9A8B');
  document.documentElement.style.setProperty('--hover-color-2', '#A8D5BAd4');
  document.documentElement.style.setProperty('--dark-cover', '#000000d5');
  document.documentElement.style.setProperty('--input-color', '#1A2420');

}
function theme_retro_pop() {
  document.documentElement.style.setProperty('--main-color-1', '#F5D491');
  document.documentElement.style.setProperty('--main-color-2', '#E28D74');
  document.documentElement.style.setProperty('--main-color-3', '#2C2F45');
  document.documentElement.style.setProperty('--main-color-4', '#F6E1B8');

  document.documentElement.style.setProperty('--hover-color-1', '#D67A63');
  document.documentElement.style.setProperty('--hover-color-2', '#F5D491d4');
  document.documentElement.style.setProperty('--dark-cover', '#000000d5');
  document.documentElement.style.setProperty('--input-color', '#2C2F45');


}
// Theme load

function apply_theme(theme) {
  switch (theme) {
    case "midnight":
      theme_midnight();
      break;
    case "blossom":
      theme_blossom();
      break;
    case "forest":
      theme_forest();
      break;
    case "retro-pop":
      theme_retro_pop();
      break;
    default:
      theme_default();
  }
  localStorage.setItem("theme", theme);
}

function load_theme() {
  const savedTheme = localStorage.getItem("theme") || "default";
  apply_theme(savedTheme);
  document.getElementById(`${savedTheme}-theme-check`).checked = true;
  document.removeEventListener('DOMContentLoaded', load_theme);
}

document.addEventListener('DOMContentLoaded', load_theme);


//-----



function open_output() {
  document.getElementById("output-frame").style.display = "flex";
  document.addEventListener('click', function close(e) {
    const outputbody = document.getElementById("output-body");
    const button = document.getElementById("email-generate-button");
    const button1 = document.getElementById("open-output-button");

    if (!outputbody.contains(e.target) && !button.contains(e.target) && !button1.contains(e.target)) {
      close_output();
    }
  });

}
function close_output() {
  document.getElementById("output-frame").style.removeProperty("display");
  document.removeEventListener('click', close);
}
function clipboard_copy() {
  text_value = document.getElementById("output-box").value;
  navigator.clipboard.writeText(text_value);
}
//------------------------ EMAIL GENERATOR ------------------------

async function fetchEmailTemplate(subject, recipient_name, sender_name, email_details) {
  const response = await fetch(`http://127.0.0.1:5000/generate-email-template`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: subject,
      recipient_name: recipient_name,
      sender_name: sender_name,
      email_details: email_details
    })
  });

  if (response.ok) {
    const data = await response.json();
    return data.email;
  } else {
    console.error('Error fetching email template');
  }
}


async function generateText() {
  const subject = document.getElementById('email-input-3').value.trim();
  const recipient_name = document.getElementById('email-input-2').value.trim();
  const sender_name = document.getElementById('email-input-1').value.trim();
  const email_details = document.getElementById('email-details-input').value.trim();

  let outputText = '';
  document.getElementById('output-box').innerText = '';
  open_output();
  const emailTemplate = await fetchEmailTemplate(subject, recipient_name, sender_name, email_details);
  outputText = `${emailTemplate}`;

  document.getElementById('output-box').innerText = outputText;
}


//------------------------ SUGGESTIONS GENERATOR ------------------------


async function fetchEmailSuggestions(subject) {
  const response = await fetch(`http://127.0.0.1:5000/generate-suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject: subject })
  });

  if (response.ok) {
    const data = await response.json();
    return data.suggestions;
  } else {
    console.error('Error fetching email suggestions');
    return '';
  }
}

async function handleInput(element) {
  const subject = element.value.trim();
  const suggestionsBox = document.getElementById('suggestions-box');
  const suggestions_frame = document.getElementById('suggestions-box-flex');

  if (subject.length >= 3) {
    const suggestions = await fetchEmailSuggestions(subject);
    suggestionsBox.innerHTML = `
      Suggestions:<br>
      <div id="suggestion-text">
        ${suggestions.split('\n').join('<br>')}
      </div>
    `;
    
    suggestions_frame.style.display = "flex";
  } else {
    close_suggestions();
  }
}



function close_suggestions() {
  const suggestionsBox = document.getElementById('suggestions-box');
  const suggestions_frame = document.getElementById('suggestions-box-flex');
  suggestions_frame.style.removeProperty('display');
  suggestionsBox.innerHTML = ''; 
}


//------------------------ BOOK API ------------------------

let debounceTimeout;
let currentFetchController;
let searchInterval;

function startSearchingAnimation() {
  const bookDisplay = document.getElementById('book-display');
  let dotCount = 0;

  bookDisplay.innerHTML = '<div class="searching-message text">Searching</div>';
  const searchingMessage = document.querySelector('.searching-message');

  setTimeout(() => {
    searchInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4; 
      const dots = '.'.repeat(dotCount); 
      searchingMessage.textContent = `Searching${dots}`;
    }, 500); 
  }, 100); 
}

function stopSearchingAnimation() {
  clearInterval(searchInterval); 
}

function parseYearFilter(yearInput) {
  yearInput = yearInput.trim();

  // Match patterns like ">year", "<year", or "year1-year2"
  const greaterThanMatch = yearInput.match(/^>(\d{4})$/);
  const lessThanMatch = yearInput.match(/^<(\d{4})$/);
  const rangeMatch = yearInput.match(/^(\d{4})-(\d{4})$/);

  if (greaterThanMatch) {
    return { type: 'greater', year: parseInt(greaterThanMatch[1]) };
  } else if (lessThanMatch) {
    return { type: 'less', year: parseInt(lessThanMatch[1]) };
  } else if (rangeMatch) {
    return { type: 'range', yearStart: parseInt(rangeMatch[1]), yearEnd: parseInt(rangeMatch[2]) };
  } else if (!isNaN(yearInput) && yearInput !== "") {
    return { type: 'exact', year: parseInt(yearInput) };
  } else {
    return false; // Invalid year format
  }
}

async function fetchBookSuggestions() {
  const titleInput = document.getElementById('title-input').value.trim();
  const authorInput = document.getElementById('author-input').value.trim();
  const yearInput = document.getElementById('year-input').value.trim();

  const bookDisplay = document.getElementById('book-display');
  bookDisplay.innerHTML = '';

  // Stop the search if the year input is invalid
  const yearFilter = parseYearFilter(yearInput);
  if (yearInput && yearFilter === false) {
    console.log("Invalid year format. No search will be performed.");
    return;
  }

  if (titleInput.length < 2 && authorInput.length < 2 && yearInput.length < 2) {
    bookDisplay.innerHTML = ''; 
    return;
  }

  if (currentFetchController) {
    currentFetchController.abort();
  }
  startSearchingAnimation();

  currentFetchController = new AbortController();
  const { signal } = currentFetchController;

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(titleInput || authorInput || yearInput)}`, { signal });
    const data = await response.json();
    const books = data.docs.slice(0, 100); 

    stopSearchingAnimation();

    const sortedBooks = books.sort((a, b) => {
      const yearA = a.first_publish_year || Infinity;
      const yearB = b.first_publish_year || Infinity;
      return yearA - yearB;
    });

    bookDisplay.innerHTML = '';

    const authorSearchList = authorInput.split(',').map(author => author.trim().toLowerCase());

    sortedBooks.forEach(book => {
      const title = book.title || 'Unknown title';
      const authors = book.author_name || ['Unknown author'];
      const year = book.first_publish_year || 'Unknown year';
      const coverId = book.cover_i || '';

      const titleMatch = titleInput.length < 2 || title.toLowerCase().includes(titleInput.toLowerCase());

      const authorMatch = authorInput.length < 2 || authors.some(bookAuthor =>
        authorSearchList.some(inputAuthor => bookAuthor.toLowerCase().includes(inputAuthor))
      );

      let yearMatch = true;
      if (yearInput) {
        switch (yearFilter.type) {
          case 'greater':
            yearMatch = year > yearFilter.year;
            break;
          case 'less':
            yearMatch = year < yearFilter.year;
            break;
          case 'range':
            yearMatch = year >= yearFilter.yearStart && year <= yearFilter.yearEnd;
            break;
          case 'exact':
            yearMatch = year.toString() === yearFilter.year.toString();
            break;
        }
      }

      if (titleMatch && authorMatch && yearMatch) {
        const bookContent = document.createElement('div');
        bookContent.classList.add('book-content');

        const coverImage = coverId
          ? `<img src="https://covers.openlibrary.org/b/id/${coverId}-M.jpg" class="book-cover" alt="${title}">`
          : `<svg  version="1.0" viewBox="0 0 1300 1800" xmlns="http://www.w3.org/2000/svg" class="svg-style book-cover">
<g transform="translate(0 1800) scale(.1 -.1)">
<path d="m0 9e3v-9e3h6500 6500v9e3 9e3h-6500-6500v-9e3zm3235 5739c580-77 1230-307 1730-613 453-277 969-758 1280-1191l65-90-1-2445c0-1345-4-2465-7-2490l-7-44-116 129c-687 766-1680 1309-2698 1475-69 11-211 29-315 41-105 11-194 24-197 27-3 4-3 914 2 2022 4 1108 8 2284 8 2613l1 598 53-6c28-4 120-15 202-26zm6815-2588v-2619l-117-12c-794-80-1457-297-2080-680-330-203-579-405-905-734l-238-239v2495 2495l101 134c306 404 682 767 1064 1025 468 317 996 544 1529 659 176 37 508 88 614 93l32 2v-2619zm-7497 1352c4-54 9-971 12-2038 4-1067 10-1997 15-2067 17-231 27-238 360-263 225-17 326-28 499-56 610-98 1218-346 1709-698 193-138 554-442 541-455-3-4-75 18-160 47-373 130-771 227-1139 276-259 35-461 44-840 38-434-7-635-24-926-77-95-18-449-95-486-106-17-5-18 127-18 2683v2688l208 62c114 34 210 62 213 62 3 1 9-43 12-96zm8072 42c61-17 145-42 188-55l77-24-1-2201c-1-2163-8-3137-21-3150-3-4-102 14-220 38-498 106-774 137-1218 137-720 0-1234-84-1904-309-115-39-211-69-213-68-5 6 247 230 366 325 64 51 179 136 256 187 649 435 1347 666 2125 705 197 10 238 17 291 53 62 42 72 73 80 246 4 86 8 1057 8 2159l1 2003 38-7c20-4 87-21 147-39zm1056-7955c18-10 19-26 19-498 0-366-3-491-12-500-12-12-104-17-132-6-11 4-16 19-16 46v40l-41-36c-58-50-105-69-176-74-113-8-192 38-242 140-75 153-59 392 35 515 36 47 104 83 168 90 75 8 117-2 176-42l50-34v174c0 155 2 175 18 184 22 14 128 14 153 1zm-9826-54c60-16 92-31 123-59 18-17 22-31 22-78 0-97-13-107-79-63-45 29-120 54-165 54-94 0-181-63-217-158-30-79-37-225-15-312 33-132 108-195 232-195 62 0 80 5 147 39 41 21 80 35 85 32 16-10 23-85 12-127-10-35-18-44-63-65-76-35-150-47-247-41-112 6-185 35-255 99-60 55-105 137-124 226-16 75-13 246 4 321 29 122 105 231 200 286 87 51 236 69 340 41zm3690-24c23-15 62-80 172-288 78-148 152-290 165-316l23-47-4 318c-4 369-8 351 89 351 99 0 90 47 90-461 0-530 10-489-117-489-58 0-86 5-108 19-30 18-137 205-312 549l-73 143v-343c0-254-3-347-12-356-16-16-129-15-151 1-16 11-17 46-15 460 3 526-10 477 132 477 71 0 98-4 121-18zm2953 6c16-16 16-120 0-136-8-8-60-12-170-12h-158v-125-125h154c173 0 166 4 166-80s7-80-166-80h-154v-180c0-207 4-200-100-200-110 0-100-44-100 463 0 384 2 445 16 465 15 22 18 22 258 22 175 0 245-3 254-12zm-1200-60c7-7 12-43 12-90v-77l83-3 82-3v-70-70l-83-3-84-3 4-190c3-189 3-191 28-211 19-15 33-18 60-14 80 14 75 18 78-56 3-63 1-68-24-85-34-22-148-30-198-13-20 6-51 23-68 38-56 47-62 75-66 314l-4 217-46 3-47 3v70 70l48 3 47 3v79c0 65 3 81 18 89 24 15 145 14 160-1zm-4718-164c99-29 159-85 196-184 27-71 25-267-4-341-30-76-90-142-160-176-52-25-67-28-172-28-141 0-196 20-265 97-61 68-80 132-79 268 1 196 77 317 230 363 65 21 187 21 254 1zm1477 1c115-34 183-136 191-286 6-124 17-119-239-119h-209v-38c0-50 29-102 71-127 48-29 171-26 257 4 34 13 69 20 77 17 21-8 20-109-1-130-32-32-123-51-249-51-104 0-127 4-173 24-135 61-203 225-173 418 24 155 102 254 231 294 43 13 164 10 217-6zm763-5c22-22 28-99 10-145-9-24-14-26-38-19-72 21-108 6-163-70l-29-39v-207c0-147-3-209-12-218-16-16-150-16-166 0-17 17-17 669 0 686 12 12 104 17 132 6 11-4 16-19 16-52v-46l37 43c51 60 89 81 146 81 34 0 53-6 67-20zm1910 4c99-29 159-85 196-184 27-71 25-267-4-341-30-76-90-142-160-176-52-25-67-28-172-28-141 0-196 20-265 97-61 68-80 132-79 268 1 196 77 317 230 363 65 21 187 21 254 1zm2360 0c99-29 159-85 196-184 27-71 25-267-4-341-30-76-90-142-160-176-52-25-67-28-172-28-141 0-196 20-265 97-61 68-80 132-79 268 1 196 77 317 230 363 65 21 187 21 254 1zm1658 0c47-19 88-58 115-109 21-38 22-56 25-314 3-218 1-276-10-282-7-5-43-9-80-9-102 0-98-9-98 259 0 221-1 229-23 262-34 51-82 60-140 26-88-52-87-49-87-301 0-159-3-225-12-234-16-16-150-16-166 0-17 17-17 669 0 686 12 12 104 17 132 6 11-4 16-19 16-51v-46l46 42c25 24 64 51 87 62 52 23 144 25 195 3zm-7700-16c5-7 43-116 82-243 40-126 75-236 79-242 4-7 40 96 80 230 41 133 81 248 89 255 16 12 128 17 156 6 9-3 16-16 16-28 0-37-211-650-228-663-10-9-50-13-113-13-78 0-101 3-117 18-13 11-56 125-127 340-85 258-104 326-95 338 16 18 163 20 178 2zm6575 0c14-11 17-43 19-255 3-240 3-242 27-267 29-31 80-42 112-26 13 7 43 31 67 53l42 41v221c0 159 3 224 12 233 7 7 41 12 83 12s76-5 83-12c17-17 17-669 0-686-12-12-104-17-132-6-11 4-16 19-16 45 0 21-3 39-6 39-4 0-25-16-46-36-58-52-112-74-184-74-90 0-156 37-198 110l-31 55-3 274c-3 218-1 276 10 282 20 13 142 10 161-3z"/>
<path d="m11299 5127c-45-30-68-92-68-187-1-90 11-139 45-179 49-58 118-50 192 22l42 41v110c0 101-2 112-25 142-26 34-97 74-132 74-11 0-35-10-54-23z"/>
<path d="m2384 5146c-69-30-98-103-92-235 5-113 25-157 86-183 83-37 157-10 200 73 21 39 23 55 20 149-3 88-7 111-26 141-37 60-121 84-188 55z"/>
<path d="m3873 5160c-41-25-63-59-70-110l-6-40h138 138l-7 41c-10 61-33 99-71 115-47 19-84 18-122-6z"/>
<path d="m6534 5146c-69-30-98-103-92-235 5-113 25-157 86-183 83-37 157-10 200 73 21 39 23 55 20 149-3 88-7 111-26 141-37 60-121 84-188 55z"/>
<path d="m8894 5146c-69-30-98-103-92-235 5-113 25-157 86-183 83-37 157-10 200 73 21 39 23 55 20 149-3 88-7 111-26 141-37 60-121 84-188 55z"/>
</g>
</svg>`;

        bookContent.innerHTML = `
          ${coverImage}
          <div class="book-info-frame">
            <div>
              <div class="book-info-category text">Title</div>
              <div class="book-info">${title}</div>
            </div>
            <div>
              <div class="book-info-category text">Author</div>
              <div class="book-info">${authors.join(', ')}</div>
            </div>
            <div>
              <div class="book-info-category text">Publishing Year</div>
              <div class="book-info">${year}</div>
            </div>
          </div>
        `;

        bookContent.onclick = function () {
          document.getElementById('title-input').value = title;
          document.getElementById('author-input').value = authors.join(', ');
          document.getElementById('year-input').value = year;
          manualSearch();
        };

        bookDisplay.appendChild(bookContent);
      }
    });

    if (bookDisplay.innerHTML === '') {
      bookDisplay.innerHTML = '<div class="searching-message text">No results found</div>';
    }

  } catch (error) {
    stopSearchingAnimation(); 

    if (error.name === 'AbortError') {
      console.log('Previous request aborted due to new request.');
    } else {
      console.error('Error fetching book data:', error);
      bookDisplay.innerHTML = '<div class="searching-message text">Error fetching book data</div>';
    }
  }
}

function debounceSearch(func, delay) {
  return function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
  };
}

const manualSearch = debounceSearch(fetchBookSuggestions, 300);





//------------------------ REFERENCE MAKER ------------------------


let ieeeCounter = 1;

function formatAuthorName(name, referenceFormat) {
  const nameParts = name.trim().split(' ');
  if (nameParts.length === 0) {
    return '';
  }

  const lastName = nameParts.pop(); // Last name
  const initials = nameParts.map(n => n.charAt(0).toUpperCase() + '.').join(' '); // Initials
  
  if (referenceFormat === 'mla') {
    return `${lastName}, ${nameParts.join(' ')}`; // MLA: Last, First
  }
  
  if (referenceFormat === 'ieee') {
    return `${initials} ${lastName}`; // IEEE: Initials Last
  }

  return `${lastName}, ${initials}`; // Default to APA: Last, Initials
}

function formatAuthors(authors, referenceFormat) {
  const authorList = authors.split(',').map(author => author.trim());
  return authorList.map(author => formatAuthorName(author, referenceFormat)).join(', ');
}




function loadReferences() {
  const savedReferences = localStorage.getItem('references');
  const savedIeeeCounter = localStorage.getItem('ieeeCounter');
  
  if (savedReferences) {
    const referencesArray = JSON.parse(savedReferences);
    referencesArray.forEach(reference => {
      displayReference(reference);
    });
  }

  if (savedIeeeCounter) {
    ieeeCounter = parseInt(savedIeeeCounter, 10);
  }
}

function saveReferences(referencesArray) {
  localStorage.setItem('references', JSON.stringify(referencesArray));
}

function saveIeeeCounter() {
  localStorage.setItem('ieeeCounter', ieeeCounter.toString());
}

function addFormattedReference() {
  const title = document.getElementById('title-input').value.trim();
  const author = document.getElementById('author-input').value.trim();
  const year = document.getElementById('year-input').value.trim();
  const publisher = document.getElementById('publisher-input').value.trim();
  const referenceFormat = document.getElementById('reference-format-options').value;

  if (!title || !author || !year || !publisher) {
    return;
  }

  let outputText = '';
  const savedReferences = JSON.parse(localStorage.getItem('references')) || [];

  switch (referenceFormat.toLowerCase()) {
    case 'apa':
      outputText = `${formatAuthors(author, referenceFormat)} (${year}). *${title}*. ${publisher}.\n\n`;
      break;
    case 'mla':
      outputText = `${formatAuthors(author, referenceFormat)}. *${title}*. ${publisher}, ${year}.\n\n`;
      break;
    case 'ieee':
      outputText = `[${ieeeCounter}] ${formatAuthors(author, referenceFormat)}, “${title},” ${publisher}, ${year}.\n\n`;
      ieeeCounter++;
      saveIeeeCounter();
      break;
    default:
      outputText = 'Invalid reference format.\n\n';
  }

  displayReference(outputText);
  savedReferences.push(outputText);
  saveReferences(savedReferences);

  document.getElementById('title-input').value = '';
  document.getElementById('author-input').value = '';
  document.getElementById('year-input').value = '';
  document.getElementById('publisher-input').value = '';
  open_ref_output();
}


function displayReference(outputText) {
  const outputBox = document.getElementById('output-box');
  const referenceDiv = document.createElement('div');
  referenceDiv.classList.add('reference-entry');
  referenceDiv.textContent = outputText;
  const lineBreak = document.createElement('br');
  outputBox.appendChild(referenceDiv);
  outputBox.appendChild(lineBreak);
}


function formatAuthors(author) {
  return author;
}

function shouldLoadReferences() {
  const currentPage = window.location.pathname;
  // Load references only on '/book-reference' page
  return currentPage === '/book-reference';
}

document.addEventListener('DOMContentLoaded', function() {
  if (shouldLoadReferences()) {
    loadReferences();
  }
}, { once: true });




//------------------------ OUTPUT BOOK REF ------------------------

function open_ref_output() {
  document.getElementById("output-frame").style.display = "flex";
  document.addEventListener('click', function close(e) {
    const outputbody = document.getElementById("output-body");
    const button = document.getElementById("reference-generate-button");
    const button1 = document.getElementById("open-output-button");

    if (!outputbody.contains(e.target) && !button.contains(e.target) && !button1.contains(e.target)) {
      close_output();
    }
  });

}
function close_output() {
  document.getElementById("output-frame").style.removeProperty("display");
  document.removeEventListener('click', close);
}

function clear_output() {
  document.getElementById('output-box').innerHTML = '';
  ieeeCounter = 1;
  localStorage.removeItem('references');
  localStorage.removeItem('ieeeCounter');
}

//------------------------ PUBLISHER SUGGESTIONS ------------------------
let allPublishers = [];
let currentFetch;
let publisherSearchInterval;

async function fetchPublisherSuggestions() {
    const titleInput = document.getElementById('title-input').value.trim();
    const authorInput = document.getElementById('author-input').value.trim();
    const yearInput = document.getElementById('year-input').value.trim();
    const publisherSuggestions = document.getElementById('publisher-suggestions');
    const publisherInput = document.getElementById('publisher-input');
    
    publisherSuggestions.innerHTML = '';

    if (titleInput.length < 2 && authorInput.length < 2 && yearInput.length < 2) {
        publisherSuggestions.style.display = 'none';
        return;
    }

    if (currentFetch) {
        currentFetch.abort();
    }
    
    currentFetch = new AbortController();
    const { signal } = currentFetch;
    stopPublisherSearchAnimation(publisherInput);
    startPublisherSearchAnimation(publisherInput);

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(titleInput || authorInput || yearInput)}`, { signal });
        const data = await response.json();
        const books = data.docs;

        const publishers = new Set();
        books.forEach(book => {
            if (book.publisher) {
                book.publisher.forEach(pub => publishers.add(pub));
            }
        });

        allPublishers = Array.from(publishers);

        allPublishers.forEach(publisher => {
            const publisherDiv = document.createElement('div');
            publisherDiv.classList.add('publisher-suggestion', 'text');
            publisherDiv.textContent = publisher;

            publisherDiv.onclick = () => {
                document.getElementById('publisher-input').value = publisher;
                hideSuggestions();
            };
            publisherSuggestions.appendChild(publisherDiv);
        });

        publisherSuggestions.style.display = 'block';

        stopPublisherSearchAnimation(publisherInput);

        if (publishers.size === 0) {
            publisherSuggestions.innerHTML = '';
        }

    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching publisher suggestions:', error);
            publisherSuggestions.innerHTML = '';
        }
        stopPublisherSearchAnimation(publisherInput);
    }
}

function startPublisherSearchAnimation(input) {
    let dots = '';
    publisherSearchInterval = setInterval(() => {
        dots += '.';
        if (dots.length > 3) {
            dots = '';
        }
        input.placeholder = 'Searching' + dots;
    }, 500);
}

function stopPublisherSearchAnimation(input) {
    clearInterval(publisherSearchInterval);
    input.placeholder = '';
}

function filterPublishers() {
    const titleInput = document.getElementById('title-input').value.trim();
    const authorInput = document.getElementById('author-input').value.trim();
    const yearInput = document.getElementById('year-input').value.trim();

    if (titleInput.length < 2 || authorInput.length < 2 || yearInput.length < 2) { return; }

    const input = document.getElementById('publisher-input').value.toLowerCase();
    const publisherSuggestions = document.getElementById('publisher-suggestions');
    publisherSuggestions.innerHTML = '';

    const filteredPublishers = allPublishers.filter(publisher =>
        publisher.toLowerCase().includes(input)
    );

    filteredPublishers.forEach(publisher => {
        const publisherDiv = document.createElement('div');
        publisherDiv.classList.add('publisher-suggestion', 'text');
        publisherDiv.textContent = publisher;

        publisherDiv.onclick = () => {
            document.getElementById('publisher-input').value = publisher;
            hideSuggestions();
        };
        publisherSuggestions.appendChild(publisherDiv);
    });

    if (filteredPublishers.length > 0) {
        publisherSuggestions.style.display = 'block';
    } else {
        publisherSuggestions.style.display = 'none';
    }
}

function hideSuggestions() {
    if (currentFetch) {
        currentFetch.abort();
    }

    const publisherSuggestions = document.getElementById('publisher-suggestions');
    publisherSuggestions.innerHTML = '';
    publisherSuggestions.style.display = 'none';

    document.removeEventListener('click', handleOutsideClick);
}

function handlePublisherInputFocus() {
    const publisherInput = document.getElementById('publisher-input').value.trim();

    if (publisherInput.length > 0) {
        filterPublishers();
    } else {
        fetchPublisherSuggestions();
    }

    document.addEventListener('click', handleOutsideClick);
}

function handleOutsideClick(event) {
    const publisherInput = document.getElementById('publisher-input');
    const publisherSuggestions = document.getElementById('publisher-suggestions');

    if (!publisherInput.contains(event.target) && !publisherSuggestions.contains(event.target)) {
        hideSuggestions();
    }
}

//------------------------ ------------------------ ------------------------

function toggleReferenceMenu(){
  const toggleSwitch = document.getElementById('toggle-reference');
  const bookInputContainer = document.getElementById('book-input-container');
  const articleInputContainer = document.getElementById('article-input__box');

  if (toggleSwitch.checked) {
    bookInputContainer.style.display = 'none';
    articleInputContainer.style.display = 'flex';
  } else {
    bookInputContainer.style.removeProperty("display");
    articleInputContainer.style.removeProperty("display");
    
  }
}

//------------------------ EXTRACT ARTICLE INFO ------------------------

async function fetchWebInfo(link) {
  const response = await fetch(`http://127.0.0.1:5000/extract-web-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ link: link })
  });

  if (response.ok) {
    const data = await response.json();
    return {
      title: data.title,
      author_names: data.author_names,
      publish_date: data.publish_date,
      favicon: data.favicon
    };
  } else {
    console.error('Error fetching web info');
    return null; 
  }
}

async function handleURL(url) {
  const link = url.value.trim();
  const author_input = document.getElementById('article__author-input');
  const date_input = document.getElementById('article__date-input');
  const title_input = document.getElementById('article__title-input'); 
  const favicon_img = document.getElementById('website-icon');

  const webInfo = await fetchWebInfo(link);

  if (webInfo) {
    author_input.value = webInfo.author_names.join(', '); 
    date_input.value = webInfo.publish_date; 
    title_input.value = webInfo.title; 
    favicon_img.src = webInfo.favicon;
  } else {
    console.error('Failed to fetch web information.');
  }
}




function close_suggestions() {
  const suggestionsBox = document.getElementById('suggestions-box');
  const suggestions_frame = document.getElementById('suggestions-box-flex');
  suggestions_frame.style.removeProperty('display');
  suggestionsBox.innerHTML = ''; 
}


//------------------------ ------------------------ ------------------------

function check_toggle_reference(){
  const toggleSwitch = document.getElementById('toggle-reference');

  if (toggleSwitch.checked) {
    addFormattedArticleReference();
  } else {
    addFormattedReference();
  }
}

//------------------------ ARTICLE REFERENCE ------------------------


function formatArticleAuthorName(name, referenceFormat) {
  const nameParts = name.trim().split(' ');

  if (nameParts.length === 0) {
      return '';
  }

  const isFullName = (part) => /^[A-Za-z]+$/.test(part);
  const fullNames = nameParts.filter(isFullName);

  if (referenceFormat === 'apa') {
      if (fullNames.length === 1) {
          const lastName = fullNames[0];
          const initials = nameParts.filter(part => part.length === 2).map(n => n.charAt(0).toUpperCase() + '.').join(' ');
          return `${lastName}, ${initials}`;
      } else {
          const initials = nameParts.slice(0, -1).map(n => n.charAt(0).toUpperCase() + '.').join(' ');
          const lastName = fullNames[fullNames.length - 1];
          return `${lastName}, ${initials}`;
      }
  } else if (referenceFormat === 'mla') {
      return fullNames.reverse().join(', ');
  } else if (referenceFormat === 'ieee') {
      if (fullNames.length === 1) {
          return name;
      } else {
          const initials = nameParts.slice(0, -1).map(n => n.charAt(0).toUpperCase() + '.').join(' ');
          const lastName = fullNames[fullNames.length - 1];
          return `${initials} ${lastName}`;
      }
  }

  return name;
}


function formatArticleAuthors(authors, referenceFormat) {
  const authorList = authors.split(',').map(author => author.trim());
  return authorList.map(author => formatArticleAuthorName(author, referenceFormat)).join(', ');
}

function formatDate(date, referenceFormat) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const monthAbbreviations = [
    "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", 
    "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
  ];

  const regex = /(\d{4})[,\s]+([a-zA-Z]+)[\s]*(\d{1,2})?|\b(\d{1,2})[\s\-\/]+([a-zA-Z]+)[\s\-\/]+(\d{4})\b|(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/;
  const match = date.match(regex);

  let year, month, day;

  if (!match) {
    return 'Invalid date format';
  }

  if (match[1]) {
    year = match[1];
    month = match[2];
    day = match[3] ? match[3] : '';
  } else if (match[4]) {
    day = match[4];
    month = match[5];
    year = match[6];
  } else if (match[7]) {
    day = match[7];
    month = match[8];
    year = match[9];
  }

  if (!year) {
    return 'Invalid date format';
  }

  if (!isNaN(month)) {
    month = parseInt(month, 10);
  } else {
    month = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase()) + 1;
  }

  if (referenceFormat === 'apa') {
    return day ? `${year}, ${monthNames[month - 1]} ${day}` : `${year}, ${monthNames[month - 1]}`;
  } else if (referenceFormat === 'mla') {
    return day ? `${day} ${monthNames[month - 1]} ${year}` : `${monthNames[month - 1]} ${year}`;
  } else if (referenceFormat === 'ieee') {
    return day ? `[${year}] ${monthAbbreviations[month - 1]} ${day}` : `[${year}] ${monthAbbreviations[month - 1]}`;
  }
  
  return date;
}



function addFormattedArticleReference() {
  const link = document.getElementById('article__link-input').value.trim();
  const title = document.getElementById('article__title-input').value.trim();
  const authors = document.getElementById('article__author-input').value.trim();
  const date = document.getElementById('article__date-input').value.trim();
  const referenceFormat = document.getElementById('reference-format-options').value;

  if (!link || !title || !authors || !date) {
    return;
  }

  let outputText = '';
  const savedReferences = JSON.parse(localStorage.getItem('references')) || [];

  const formattedAuthors = formatArticleAuthors(authors, referenceFormat);
  const formattedDate = formatDate(date, referenceFormat);

  let websiteName;
  try {
    const url = new URL(link);
    websiteName = url.hostname.replace('www.', ''); 
  } catch (error) {
    console.error('Invalid URL:', error);
    return; 
  }

  switch (referenceFormat.toLowerCase()) {
    case 'apa':
      outputText = `${formattedAuthors} (${formattedDate}). *${title}*. Retrieved from ${link}\n\n`;
      break;
    case 'mla':
      outputText = `${formattedAuthors}. “${title}.” *${websiteName}*, ${formattedDate}, ${link}.\n\n`;
      break;
    case 'ieee':
      outputText = `[${ieeeCounter}] ${formattedAuthors}, “${title},” *${websiteName}*, [Online]. Available: ${link}. [Accessed: ${formattedDate}].\n\n`;
      ieeeCounter++;
      saveIeeeCounter();
      break;
    default:
      outputText = 'Invalid reference format.\n\n';
  }

  displayReference(outputText);
  savedReferences.push(outputText);
  saveReferences(savedReferences);

  document.getElementById('article__link-input').value = '';
  document.getElementById('article__title-input').value = '';
  document.getElementById('article__author-input').value = '';
  document.getElementById('article__date-input').value = '';
  open_ref_output();
}

