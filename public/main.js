window.onload = () => {
  var avatars = document.querySelectorAll("#avatar");
  avatars.forEach((a) => {
    a.onerror = () => {
      a.src =
        "https://www.kindpng.com/picc/m/78-786678_avatar-hd-png-download.png";
    };
  });
  var covers = document.querySelectorAll("#cover");
  covers.forEach((a) => {
    a.onerror = () => {
      a.src =
        "https://pbs.twimg.com/media/DwTpoucU8AAZHo7?format=jpg&name=large";
    };
  });
  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    let imgsrc = image.getAttribute("src");

    if (imgsrc === "") {
      image.src = "/images/missing.png";
    }
  });

  let tweetForm = document.querySelector("#tweet-form");
  let tweetButton = document.querySelector("#tweet-button");

  if ((tweetButton.disabled = true)) {
    tweetButton.classList.add("opacity-50");
  }
  if (tweetForm.value.length > 0) {
    tweetButton.disabled = false;
    tweetButton.classList.remove("opacity-50");
  }

  document.querySelector("#tweet-form").addEventListener("keyup", (e) => {
    document.querySelector("#word-count").innerHTML = e.target.value.length;
    if (e.target.value.length > 0) {
      tweetButton.disabled = false;
      tweetButton.classList.remove("opacity-50");
    }
    if (e.target.value.length > 140) {
      tweetButton.disabled = true;
      tweetButton.classList.add("opacity-50");
      document.querySelector("#word-count").classList.add("text-red-500");
    }
    if (e.target.value.length < 140) {
      tweetButton.disabled = false;
      tweetButton.classList.remove("opacity-50");
      document.querySelector("#word-count").classList.remove("text-red-500");
    }
    if (e.target.value.length === 0) {
      tweetButton.disabled = true;
      tweetButton.classList.add("opacity-50");
      document.querySelector("#word-count").innerHTML = "";
    }
    console.log(e.target.value.length);
  });
};
