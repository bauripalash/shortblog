let HOSTNAME = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`;

const appendPostList = S => {
  S = S.toString().split("@");
  let postName = S[0];
  let dt = new Date(S[1]);
  let postDate = dt.toDateString();
  let link = `<a href="#"> <span class="postdate">⌛ ${postDate} </span> &nbsp; <span class="postname">📝 ${postName} </span> </a>`;
  let lix = document.createElement("div");
  lix.setAttribute("class", "post_item");
  lix.onclick = function(e) {
    olink(postName);
  };
  lix.innerHTML = link;
  document.getElementById("post_ul").appendChild(lix);
};

const appendPageList = (N, active) => {
  let link = "";
  for (let i = 1; i <= N; i++) {
    if (i != active) {
      link += `<a href="#" onclick=olink("page${i.toString()}")> ${i} </a>`;
    } else {
      link += `<a class="active" href="#"> ${i} </a>`;
    }
  }
  document.getElementById("paginator").innerHTML = link;
};

const olink = S => {
  window.location.replace(window.location.origin + "/#/" + S);
  location.reload();
};

const displayError = code => {
  document.getElementById("articlebody").innerText = "😱\n" + code;
  document.getElementById("articlebody").style.fontSize = "70px";
  document.getElementById("articlebody").style.textAlign = "center";
  document.getElementById("spareuse").innerText = "The Page Cannot Be Found!";
  document.getElementById("spareuse").style.fontSize = "30px";
  document.getElementById("spareuse").style.textAlign = "center";
};

const displayPost = text => {
  ptext = text.match(
    /^(\[\[(.*)\]\])?\s?(\[\((.*)\)\])?\s?(\[\<(.*)\>\])?\s?([\s\S]*)$/
  );
  // console.log(ptext);
  // 2 > Article Header | 4 > Article Cover | 6 > Learn More Link | 7 > Article Text
  document.getElementById("articlebody").innerText = "\n" + ptext[7];
  if (ptext[4] != undefined) {
    document.getElementById("articleimg").style.display = "block";
    document.getElementById("articleimg").setAttribute("src", ptext[4]);
  }
  if (ptext[2] != undefined) {
    document.getElementById("articleheader").style.display = "block";
    document.getElementById("articleheader").innerText = ptext[2];
  }
  if (ptext[6] != undefined) {
    document.getElementById("spareuse").innerHTML = `<h4 style="text-align:center"><a href="${ptext[6]}">Read More!</a></h4>`
  }
};

const fetchPost = async url => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw res.status;
    }
    const data = await res.text();
    displayPost(data);
  } catch (error) {
    displayError(error);
  }
};
window.onload = e => {
  let slug = window.location.hash.substr(1);
  let page = -1;
  let ispage = slug.match(/^(\/page)([0-9]+)$/);
  if (ispage) {
    page = ispage[2];
  } else if (slug == "") {
    page = 1;
  }

  if (slug && page < 0) {
    document.getElementById("postlist").style.display = "none";
    document.getElementById("articlebody").style.display = "block";
    fetchPost(`/posts/${slug.substr(1)}`);
  } else if (page >= 0) {
    document.getElementById("articlebody").style.display = "none";
    document.getElementById("postlist").style.display = "block";
    document.getElementById("paginator_holder").style.display = "block";
    fetch(JSON_DATABASE)
      .then(response => {
        return response.json();
      })
      .then(DB => {
        DB = JSON.parse(DB);
        appendPageList(DB.length, page);
        for (i in DB[page - 1]) {
          appendPostList(DB[page - 1][i]);
        }
      });
  }
};
