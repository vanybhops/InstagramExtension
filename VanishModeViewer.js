const inj = () => {
  const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  async function instagramify(link, threadUserName, type, fromWS = false) {
      while (document.readyState != "complete") {
          await sleep(100);
      }
      await sleep(100);
      let els;
      if (fromWS == true) {
          els = document.querySelector(`a[href*="direct/t/${threadUserName}"]`)?.parentElement?.parentElement || "regex it is"
          if (els == "regex it is"){
            let tempusers = [];
            document.body.innerHTML.match(/(?<=alt=")[a-zA-Z0-9._]*(?='s)/gm).forEach(x => {
                if (tempusers.includes(x)) {
                    threadUserName = x;
                    return els = document.querySelector(`[alt="${x}'s profile picture"]`)
                        .parentElement
                        .parentElement
                        .parentElement
                        .parentElement
                        .parentElement;
                }
                tempusers.push(x)
            })
        }
      } else {
        let regex=new RegExp(`${threadUserName}'s profile picture`, "gm");
        if (document.body.innerHTML.match(regex).length>1) {
            els = document.querySelector(`[alt="${threadUserName}'s profile picture"]`)
                        .parentElement
                        .parentElement
                        .parentElement
                        .parentElement
                        .parentElement;
        }
        else{
            els = document.querySelector(`[alt="${threadUserName}'s profile picture"]`)
            .parentElement
            .parentElement
            .parentElement
            .parentElement
            .parentElement
            .parentElement
            .parentElement;
        }
      }
      localStorage.setItem(threadUserName, localStorage.getItem(threadUserName) === null ? link + ":" : localStorage.getItem(threadUserName) + `,${link}`)
      let divz = document.createElement("div")
      els.appendChild(divz)
      divz.style.zIndex="9999"
      divz.style.height = "72px"
      divz.style.width = "72px"
      divz.style.right = "0%"
      divz.style.position = "absolute"
      let button = document.createElement("button")
      button.style.border = "none"
      button.style.height = "inherit"
      button.style.width = "inherit"
      button.style.background = "inherit"
      button.style.cursor = "grabbing"
      divz.appendChild(button)
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      button.appendChild(svg)
      let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      svg.style.width = "inherit"
      svg.style.height = "inherit"
      circle.setAttributeNS(null, "cx", 35)
      circle.setAttributeNS(null, "cy", 35)
      circle.setAttributeNS(null, "r", 10)
      circle.setAttributeNS(null, "stroke", "cyan")
      circle.setAttributeNS(null, "stroke-width", "10")
      circle.setAttributeNS(null, "fill", "white")
      svg.appendChild(circle)
      button.onclick = async function() {
          let terenary = document.createElement("video")
          terenary.setAttribute(type == "video" ? "src" : "poster", link)
          document.body.appendChild(terenary)
          terenary.requestFullscreen()
          terenary.autoplay = true
          while (!terenary.readyState > 0 && type == "video")
              await sleep(10)
          await sleep(100)
          divz.style.display = "none"
          divz.style.zIndex = "-1000000"
          await sleep(isNaN(terenary.duration) ? 5000 : Math.round(terenary.duration * 1000))
          terenary.webkitExitFullscreen()
          terenary.remove()
          divz.remove()
      }
  };
  let enc = new TextDecoder("utf-8");
  (function() {

      var ws = window.WebSocket;

      window.WebSocket = function(a, b) {
          var that = b ? new ws(a, b) : new ws(a);
          that.addEventListener("message", (x) => {
              let data = enc.decode(x.data);
              try {
                  let threadLink = String(data.match(/(?<=\/direct_v2\/threads\/)[0-9]*/))
                  let placehold = data.match(/(?<=\[{)(.*)(?=}])/)[0];
                  let newjson = JSON.parse(`{` + placehold.match(/(?<=\[{)(.*)(?=}])/)[0] + `}`);
                  let nj = JSON.parse(newjson["value"]);
                  switch (nj["raven_media"]["video_versions"]) {
                      case undefined:
                          instagramify(
                            nj['raven_media']['image_versions2']["candidates"][0]["url"], 
                            threadLink, 
                            "image", fromWS = true
                            );
                          break;
                      default:
                          instagramify(nj['raven_media']['video_versions'][0]["url"], threadLink, "video", fromWS = true);
                          break;
                  }
              } catch (e) {}
          });
          return that;
      };
      window.WebSocket.prototype = ws.prototype;
  }());
  var send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(method, uri, async, user, pass) {
      this.addEventListener("readystatechange", function(event) {
          if (this.readyState == 4) {
              var self = this;
              var response = {
                  method: method,
                  uri: uri,
                  pictures: self.responseText,
                  responseURL: self.responseURL
              };
              if (response.responseURL.includes('ajax/navigation/')) {}
              if (response.responseURL.includes("inbox/?persistentBadging=true")) {
                  let pictures = JSON.parse(response.pictures);
                  for (let i = 0; i < 10; i++) {
                      for (let x = 0; x < 10; x++) {
                          try {
                              switch (pictures["inbox"]["threads"][i]["items"][x]['raven_media']) {
                                  case undefined:
                                      break;
                                  default:
                                      switch (pictures["inbox"]["threads"][i]["items"][x]['raven_media']["video_versions"]) {
                                          case undefined:
                                              instagramify(
                                                  pictures["inbox"]["threads"][i]["items"][x]['raven_media']['image_versions2']["candidates"][0]["url"],
                                                  pictures["inbox"]["threads"][i]["items"][x]['raven_media']?.user?.username,
                                                  "image"
                                                  );
                                              break;
                                          default:
                                              instagramify(
                                                  pictures["inbox"]["threads"][i]["items"][x]['raven_media']['video_versions'][0]["url"],
                                                  pictures["inbox"]["threads"][i]["items"][x]['raven_media']?.user?.username,
                                                  "video"
                                                  );
                                              break;
                                      };
                              };
                          } catch {}
                      };
                  };
              };
          } else {};
      }, false);
      send.call(this, method, uri, async, user, pass);
  };
},
injectScript = text => {
  let script = document.createElement("script");
  script.innerHTML = text;
  script = document.documentElement.appendChild(script);
  setTimeout(() => {
      document.documentElement.removeChild(script);
  }, 10)
},
encodeString = str => str ? str.split("\\").join("\\\\").split("\"").join("\\\"") : str;
injectScript(`const test=${inj.toString()};test()`);
