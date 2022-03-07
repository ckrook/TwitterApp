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
};
