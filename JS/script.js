const apiKey = "574e80c2a6msh1c2548d27b37c48p181a51jsn7dbe12aa510d";

document
  .getElementById("ai-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const queryInput = document.getElementById("user-input").value;

    const url = `https://youtube-data-api-v33.p.rapidapi.com/search?part=snippet&type=video&q=${encodeURIComponent(
      queryInput
    )}&maxResults=10&key=${apiKey}`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "youtube-data-api-v33.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      console.log(result);

      if (result.items && result.items.length > 0) {
        const items = result.items;

        let mainSliderContent = "";
        let thumbnailSliderContent = "";

        items.forEach((item) => {
          const title = item.snippet.title;
          const videoId = item.id.videoId;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const thumbnailUrl = item.snippet.thumbnails.medium.url;

          mainSliderContent += `
            <li class="splide__slide" data-video-id="${videoId}">
              <a href="${videoUrl}" target="_blank">
                <img src="${thumbnailUrl}" alt="${title}" />
              </a>
              <h3>${title}</h3>
            </li>`;

          thumbnailSliderContent += `
            <li class="splide__slide" data-video-id="${videoId}">
              <img src="${thumbnailUrl}" alt="${title}" />
            </li>`;
        });

        document.getElementById("main-slider-list").innerHTML =
          mainSliderContent;
        document.getElementById("thumbnail-slider-list").innerHTML =
          thumbnailSliderContent;

        var main = new Splide("#main-slider", {
          type: "fade",
          heightRatio: 0.5,
          pagination: false,
          arrows: false,
          cover: true,
        });

        var thumbnails = new Splide("#thumbnail-slider", {
          rewind: true,
          fixedWidth: 104,
          fixedHeight: 58,
          isNavigation: true,
          gap: 10,
          focus: "center",
          pagination: false,
          cover: true,
          dragMinThreshold: {
            mouse: 4,
            touch: 10,
          },
          breakpoints: {
            640: {
              fixedWidth: 66,
              fixedHeight: 38,
            },
          },
        });

        main.sync(thumbnails);
        main.mount();
        thumbnails.mount();

        document
          .querySelectorAll("#thumbnail-slider-list .splide__slide")
          .forEach((item) => {
            item.addEventListener("mouseenter", async function () {
              const videoId = this.getAttribute("data-video-id");

              const analyticsUrl = `https://youtube-data-api-v33.p.rapidapi.com/videos?part=statistics&id=${videoId}&key=${apiKey}`;
              const analyticsOptions = {
                method: "GET",
                headers: {
                  "x-rapidapi-key": apiKey,
                  "x-rapidapi-host": "youtube-data-api-v33.p.rapidapi.com",
                },
              };

              try {
                const analyticsResponse = await fetch(
                  analyticsUrl,
                  analyticsOptions
                );
                const analyticsResult = await analyticsResponse.json();

                if (analyticsResult.items && analyticsResult.items.length > 0) {
                  const stats = analyticsResult.items[0].statistics;

                  document.getElementById(
                    "views"
                  ).textContent = `Views: ${Number(
                    stats.viewCount
                  ).toLocaleString({
                    language: "EN",
                  })}`;
                  document.getElementById(
                    "likes"
                  ).textContent = `Likes: ${Number(
                    stats.likeCount
                  ).toLocaleString({ language: "EN" })}`;
                  document.getElementById(
                    "comments"
                  ).textContent = `Comments: ${Number(
                    stats.commentCount
                  ).toLocaleString({ language: "EN" })}`;
                }
              } catch (error) {
                console.error(error);
              }
            });
          });
      } else {
        document.getElementById("response-output").innerText =
          "No results found.";
      }
    } catch (error) {
      console.error(error);
      document.getElementById("response-output").innerText =
        "An error occurred. Please try again.";
    }
  });
