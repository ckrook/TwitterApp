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

  document.querySelector("#tweet-form").addEventListener("keyup", (e) => {
    document.querySelector("#word-count").innerHTML = e.target.value.length;
    if (e.target.value.length > 140) {
      document.querySelector("#tweet-button").disabled = true;
      document.querySelector("#tweet-button").classList.add("opacity-50");
      document.querySelector("#word-count").classList.add("text-red-500");
    }
    if (e.target.value.length < 140) {
      document.querySelector("#tweet-button").disabled = false;
      document.querySelector("#tweet-button").classList.remove("opacity-50");
      document.querySelector("#word-count").classList.remove("text-red-500");
    }
    if (e.target.value.length === 0) {
      document.querySelector("#word-count").innerHTML = "";
    }
    console.log(e.target.value.length);
  });
};
