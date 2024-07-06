// global
const categoryBtns = document.getElementById("category-btns-section");
const contentSection = document.getElementById("content");
let data;
let sortByAssending = false;


const category = async () => {
    const categories = await fetch("https://openapi.programming-hero.com/api/videos/categories")
      .then(res => res.json())
      .then(data => data.data)
      .catch(err => console.log(err));

    categories.forEach((category, index) => {
      const button = document.createElement("div");

      button.innerHTML = `
        <button type="button" class="btn ${index === 0 ? 'btn-danger' : 'btn-outline-secondary'}">${category.category}</button>
      `;

      const btnElement = button.querySelector("button");

      btnElement.addEventListener("click", () => {
        const allButtons = categoryBtns.querySelectorAll("button");
        allButtons.forEach(btn => btn.classList.remove("btn-danger"));
        allButtons.forEach(btn => btn.classList.add("btn-outline-secondary"));

        btnElement.classList.remove("btn-outline-secondary");
        btnElement.classList.add("btn-danger");

        fetchData(category.category_id);
      });

      categoryBtns.appendChild(button);
    });
};

const fetchData = async (id) => {
    
    data = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
      .then(res => res.json())
      .then(data => data.data)
      .catch(err => console.log(err));
    showContent(data);
};

const getTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    const result = `${(hours != 0) ? `${hours} hours `:""}${(minutes != 0) ? `${minutes} mins `:""}${(seconds != 0) ? `${seconds} secs `:""}ago`

    return result;

}

const showContent = () => {

    contentSection.innerHTML = "";

    if(data.length == 0){
        const card = document.createElement("div");
        card.className = "col-md-3";
        card.style = "width: 18rem;";

        card.innerHTML = `
                <img src="images/icon.png" class="card-img-top" alt="...">
                <h3 class="card-title text-center">Opps!! Sorry There is No content here</h3>
                
            </div>
        `
        contentSection.appendChild(card);
    }

    
    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "card col-md-3";
        card.style = "width: 18rem;";
        const time = getTime(item.others.posted_date);
        card.innerHTML = `
                <img src="${item.thumbnail}" class="card-img-top w-100" height=150px alt="...">
                ${(time != "ago") ?
                    `<p class="float-end position-absolute top-50 end-0 translate-middle-y me-3 bg-black text-white"">${time}</p>`:""}
                
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text text-secondary">${item.authors[0].profile_name} <i class="${item.authors[0].verified? "bi bi-patch-check-fill text-primary":""}"></i></p>
                    <p class="card-text text-danger">${item.others.views} views</p>
                </div>
                
            </div>
        `
        contentSection.appendChild(card);
    });
}


const sortView = () => {
    data.sort((a,b) => {
        const viewsA = parseFloat(a.others.views.slice(0, -1));
        const viewsB = parseFloat(b.others.views.slice(0, -1));
        
        if (sortByAssending) {
            return viewsA - viewsB; // Ascending order
        } else {
            return viewsB - viewsA; // Descending order
        }
    });
    sortByAssending = !sortByAssending;
    console.log(sortByAssending);
    showContent();
}


category();
fetchData(1000);