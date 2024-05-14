// var map = L.map("map").setView([-6, 106], 7);

var map = L.map("map", {
  center: [-6, 106],
  zoom: 7,
  zoomControl: false,
});

L.tileLayer(
  "https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: false,
    maxZoom: 13,
  }
).addTo(map);

var basemaps = {
  "Default Map": L.tileLayer(
    "https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: false,
      maxZoom: 13,
    }
  ),
  OpenStreetMap: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }
  ),
  mapbox: L.tileLayer.provider("MapBox", {
    id: "mapbox/streets-v12",
    accessToken:
      "pk.eyJ1IjoibmRhd2luYXRhOTYiLCJhIjoiY2xkZjI2M3h5MDE2MzQwbWl1azQ4bHU2MiJ9.MIsz5WLdvtStrD83-L4ajA",
  }),

  "Grayscale Map": L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 18,
      attribution: false,
    }
  ),
  "Streets Map": L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: false,
    }
  ),
  "Satelite Map": L.tileLayer(
    "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: false,
    }
  ),
};

L.control.layers(basemaps).addTo(map);

//lempeng dan sesar
$.getJSON("/assets/pusgen.json", function (data) {
  L.geoJSON(data, {
    style: function (feature) {
      return {
        color: "#ff8c00",
        weight: 2,
      };
    },
  }).addTo(map);
});

var logo = L.control({ position: "bottomright" });
logo.onAdd = function (map) {
  var div = L.DomUtil.create("div", "logo");
  div.innerHTML = "";
  return div;
};
logo.addTo(map);

// with socket
const socket = io("http://182.16.248.184:8000/");
var hypo = L.icon({
  iconUrl: "https://inatews.bmkg.go.id/assets_inatews/epic2.png",
  iconSize: [25, 25],
});
// var pulsingIcon = L.icon.pulse({iconSize:[20,20],color:'red'});

const svgMagnitude = document.getElementById("magnitude");
const svgEpicenter = document.getElementById("epicenter");
const svgOT = document.getElementById("ot");
const svgDepth = document.getElementById("depth");
const svgElem = document.getElementById("vmmi");
const svgDis = document.getElementById("jarak");
const svgKet = document.getElementById("ket");
const svgLeft = document.getElementById("timeleft");
const lokasi = document.getElementById("lokasi");

let waktuTiba;
let timePassed;
let timerInterval;
let FULL_DASH_ARRAY;
let TIME_LIMIT;
let remainingPathColor;
let COLOR_CODES;
var iterations;
var latlng2;
var group1 = L.featureGroup();
var p_wave;
var s_wave;
var interval;
var interval2;
var dateOT;

function penjalaran() {
  console.log("lagi run");
  if (iterations < 600) {
    if (map.hasLayer(group1)) {
      console.log("layer adaaaa");
      clearInterval(interval);
      clearInterval(interval2);
      map.removeLayer(group1);
      console.log("layer tidak adaaaa");
      group1 = L.featureGroup();
      p_wave = L.circle(latlng2, {
        radius: iterations * 8 * 1000,
        fillColor: false,
        color: "yellow",
        weight: 3,
        opacity: 1,
        fillOpacity: 0,
      }).addTo(group1);
      s_wave = L.circle(latlng2, {
        radius: iterations * 4 * 1000,
        fillColor: false,
        color: "red",
        weight: 3,
        opacity: 1,
        fillOpacity: 0,
      }).addTo(group1);
      interval = setInterval(foo, 1000);
      function foo() {
        iterations = (new Date(Date.now()) - dateOT) / 1000;
        console.log(iterations);
        if (iterations <= 900) {
          p_wave.setRadius(iterations * 8 * 1000);
          //console.log("iterasi ke" + iterations);
          //console.log(map.hasLayer(p_wave));
        } else {
          clearInterval(interval);
          map.removeLayer(p_wave);
        }
      }

      interval2 = setInterval(foo2, 1000);
      function foo2() {
        iterations = (new Date(Date.now()) - dateOT) / 1000;
        if (iterations <= 600) {
          s_wave.setRadius(iterations * 4 * 1000);
        } else {
          clearInterval(interval2);
          map.removeLayer(s_wave);
        }
      }
      map.addLayer(group1);
    } else {
      console.log("layer tidak adaaaa");
      group1 = L.featureGroup();
      var p_wave;
      var s_wave;
      p_wave = L.circle(latlng2, {
        radius: iterations * 8 * 1000,
        fillColor: false,
        color: "yellow",
        weight: 3,
        opacity: 1,
        fillOpacity: 0,
      }).addTo(group1);
      s_wave = L.circle(latlng2, {
        radius: iterations * 4 * 1000,
        fillColor: false,
        color: "red",
        weight: 3,
        opacity: 1,
        fillOpacity: 0,
      }).addTo(group1);
      interval = setInterval(foo, 1000);
      function foo() {
        iterations = (new Date(Date.now()) - dateOT) / 1000;
        if (iterations <= 900) {
          p_wave.setRadius(iterations * 8 * 1000);
        } else {
          clearInterval(interval);
          map.removeLayer(p_wave);
        }
      }
      interval2 = setInterval(foo2, 1000);
      function foo2() {
        iterations = (new Date(Date.now()) - dateOT) / 1000;
        if (iterations <= 600) {
          s_wave.setRadius(iterations * 4 * 1000);
        } else {
          clearInterval(interval2);
          map.removeLayer(s_wave);
        }
      }
      map.addLayer(group1);
    }
  }
}

socket.on("event", (data) => {
  console.log(data);
  latlng2 = [data.epicenterLat, data.epicenterLon];
  var OTime = data.originTime;
  dateOT = new Date(OTime.split("+")[0] + "+00:00");
  let dftime = (new Date(Date.now()) - dateOT) / 1000;
  iterations = dftime;
  updateMarker(data.epicenterLat, data.epicenterLon);
  // Memusatkan peta pada episentrum gempa bumi
  map.setView(latlng2, 6);

  // Menunda refresh halaman hingga 30 detik
  setTimeout(() => {
    location.reload();
  }, 150000);

  console.log(iterations);
  penjalaran();
  var audio = new Audio("assets/alarm.wav");
  audio.autoplay = true;
  audio.play();
  $("#magnitude").text(data.magnitude);
  $("#epicenter").text(`${data.epicenterLat}, ${data.epicenterLon}`);
  $("#ot").text(data.originTime.toString() + " WIB");
  $("#depth").text(data.depth.toString() + " km");
  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((user) => {
      console.log("Latitude:", user.latitude);
      console.log("Longitude:", user.longitude);
      let lat2 = user.latitude;
      let lon2 = user.longitude;
      // let lat2 = -0.97289;
      // let lon2 = 116.70882;
      addMarker(lat2, lon2); // add marker to the map at user's location
      const distance = calculateDistance(
        data.epicenterLat,
        data.epicenterLon,
        lat2,
        lon2
      );
      console.log("Distance to latest earthquake:", distance, "km");

      // Calculate MMI and countdown time
      let mmi = mmiPredict(distance * 1000, data.magnitude);
      waktuTiba = countTime(distance, dftime);

      console.log("MMI:", mmi);
      console.log("Countdown:", waktuTiba);

      var dh = 0;
      if (parseFloat(c.depth) >= 15) {
        dh = 1;
      }
      var r_int = distance + 0.0055 * Math.exp(1.08 * parseFloat(c.magnitude));

      let intensitas =
        1.011 * parseFloat(data.magnitude) +
        -0.00564 * distance -
        Math.log(r_int) +
        0.01412 * (parseFloat(data.depth) - 15) * dh +
        0.251 +
        2.607 +
        -0.528 * Math.log(data.depth) +
        1.355;
      intensitas = Math.exp(intensitas);
      keterangan = conMMI(intensitas);
      intensitas = getMMI(intensitas);
      console.log("Intensitasa:", intensitas);

      $("#jarak").text(distance.toFixed(0) + " km");
      $("#vmmi").text(intensitas);
      $("#ket").text(keterangan);

      // jam countdown
      FULL_DASH_ARRAY = 283;
      let WARNING_THRESHOLD = 10;
      let ALERT_THRESHOLD = 5;

      COLOR_CODES = {
        info: {
          color: "green",
        },
        warning: {
          color: "orange",
          threshold: WARNING_THRESHOLD,
        },
        alert: {
          color: "red",
          threshold: ALERT_THRESHOLD,
        },
      };

      // TIME_LIMIT = waktuTiba;
      TIME_LIMIT = waktuTiba;
      timePassed = 0;
      let timeLeft = TIME_LIMIT;
      timerInterval = null;
      remainingPathColor = COLOR_CODES.info.color;

      document.getElementById("countdown").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45\"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
      )}</span>
    </div>
    `;

      startTimer();
      if (document.getElementById("countdown") !== null) {
      } else {
        console.log("Error: Element not found.");
      }
      // akhir jam countdown
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

let hypo1 = [0, 0];

var epicenterMarker = L.marker(hypo1, { icon: hypo }).addTo(map);

// var marker = L.marker(hypo1, {icon: pulsingIcon}).addTo(map);

function updateMarker(newlat, newlong) {
  map.removeLayer(epicenterMarker);
  epicenterMarker = L.marker([newlat, newlong], { icon: hypo }).addTo(map);
}

// function to add a marker to the map at given coordinates
function addMarker(lat, lng) {
  L.marker([lat, lng]).addTo(map); // add marker to the map
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // radius of the earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

mmiPredict = (distance, mag) => {
  let distanceLog = Math.log(distance / 1000);
  let rR = 0.696 * distanceLog;
  let maG = 0.87 * mag;
  let magRR = maG - rR;
  return Math.abs(Math.floor(1.379 + magRR));
};

// Mendapatkan alamat IP pengguna secara otomatis
fetch("https://ipinfo.io/json")
  .then((response) => response.json())
  .then((data) => {
    const ipAddress = data.ip;
    console.log("IP Address:", ipAddress);

    // Menggunakan Geolocation API untuk mendapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          console.log("Latitudes:", lat);
          console.log("Longitudes:", lon);

          // Lakukan sesuatu dengan informasi lokasi yang didapatkan
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  })
  .catch((error) => {
    console.error("Error getting IP address:", error);
  });

// rMMI = (mmi, mag) => {
//   let logDistance = (mmi - 1.379 - 0.87 * mag) / 0.696;
//   return Math.exp(logDistance);
// };

// pgaPredict = (akar, distance, mag) => {
//   let akar = 1.647 + 0.767 * mag - 0.074*mag*mag+(-3.162+0.321*mag)* Math.log10(math.sqrt(distance*distance+7.682*7.682));

//   let dist2 = math.sqrt(distance**2 + depth**2);
//   let rzhao = dist2 = 0.0055*math.exp(1.080*mag);
//   let zhao = 1.101 * mag  - 0.00564 * dist2 - math.log(rzhao)+0.01412*(depth-15)*dh+1.11;
//   let y =  2.607 + 0.528*math.log(dist2);
// };

countTime = (distance, dftime) => {
  let lagtime = Math.round(distance / 4 - dftime);
  if (lagtime < 0) {
    lagtime = 0;
  }
  return lagtime;
};

function getColor(d) {
  return d < 0.05
    ? "rgb(153, 0, 255)"
    : d < 0.075
    ? "rgb(93, 0, 255)"
    : d < 0.1
    ? "rgb(34, 0, 255)"
    : d < 0.2
    ? "rgb(0, 102, 255)"
    : d < 0.25
    ? "rgb(0, 157, 255)"
    : d < 0.5
    ? "rgb(191, 204, 255)"
    : d < 3.0
    ? "rgb(160, 230, 255)"
    : d < 28.0
    ? "rgb(128, 255, 255)"
    : d < 62.0
    ? "rgb(122, 255, 147)"
    : d < 120.0
    ? "rgb(255, 255, 0)"
    : d < 220.0
    ? "rgb(255, 200, 0)"
    : d < 400.0
    ? "rgb(255, 145, 0)"
    : d < 750.0
    ? "rgb(255, 0, 0)"
    : d < 1390.0
    ? "rgb(200, 0, 0)"
    : "rgb(128, 0, 0)";
}
function getColor1(d) {
  return d < 0.15
    ? "rgb(255, 255, 255)"
    : d < 0.5
    ? "rgb(0, 157, 255)"
    : d < 3.0
    ? "rgb(0, 102, 255)"
    : d < 28.0
    ? "rgb(128, 255, 255)"
    : d < 62.0
    ? "rgb(122, 255, 147)"
    : d < 120.0
    ? "rgb(255, 255, 0)"
    : d < 220.0
    ? "rgb(255, 200, 0)"
    : d < 400.0
    ? "rgb(255, 145, 0)"
    : d < 750.0
    ? "rgb(255, 0, 0)"
    : d < 1390.0
    ? "rgb(200, 0, 0)"
    : "rgb(128, 0, 0)";
}
function getradius(d) {
  return d < 0.5
    ? 5
    : d < 3.0
    ? 5.5
    : d < 28.0
    ? 6
    : d < 62.0
    ? 6.3
    : d < 120.0
    ? 6.5
    : d < 220.0
    ? 6.7
    : d < 400.0
    ? 7
    : d < 750.0
    ? 7.3
    : d < 1390.0
    ? 7.7
    : 8;
}
function getMMI(m) {
  var mmi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "X+"];
  return m > 1390.0
    ? mmi[10]
    : m > 750.0
    ? mmi[9]
    : m > 400.0
    ? mmi[8]
    : m > 220.0
    ? mmi[7]
    : m > 120.0
    ? mmi[6]
    : m > 62.0
    ? mmi[5]
    : m > 28.0
    ? mmi[4]
    : m > 12.0
    ? mmi[3]
    : m > 3.0
    ? mmi[2]
    : m > 0.5
    ? mmi[1]
    : mmi[0];
}

function conMMI(m) {
  var mmi;
  if (m > 1390.0) {
    mmi = "POTENSI GETARAN EKSTRIM";
  } else if (m > 750.0) {
    mmi = "POTENSI GETARAN EKSTRIM";
  } else if (m > 400.0) {
    mmi = "POTENSI GETARAN EKSTRIM";
  } else if (m > 220.0) {
    mmi = "POTENSI GETARAN SANGAT KUAT";
  } else if (m > 120.0) {
    mmi = "POTENSI GETARAN SANGAT KUAT";
  } else if (m > 62.0) {
    mmi = "POTENSI GETARAN KUAT";
  } else if (m > 28.0) {
    mmi = "POTENSI GETARAN SEDANG";
  } else if (m > 12.0) {
    mmi = "POTENSI GETARAN LEMAH";
  } else if (m > 3.0) {
    mmi = "POTENSI GETARAN SANGAT LEMAH";
  } else if (m > 0.5) {
    mmi = "POTENSI GETARAN SANGAT LEMAH";
  } else {
    mmi = "TIDAK TERASA GETARAN";
  }
  return mmi;
}
// fetch("https://ipapi.co/json/")
//       .then((response) => response.json())
//       .then((user) => {
//         console.log("Latitude:", user.latitude);
//         console.log("Longitude:", user.longitude);
//         let lat2 = user.latitude;
//         let lon2 = user.longitude;
//         addMarker(user.latitude, user.longitude); // add marker to the map at user's location
//         const distance = calculateDistance(c.epicenterLat, c.epicenterLon, lat2, lon2);
//         console.log("Distance to latest earthquake:", distance, "km");
//       });

const url = "https://event-eews.seismon.my.id/lastevent";
let c;
let lastUpdateTime;
function convertUTCToLocalTime(utcTime, timeZoneOffset) {
  const utcDate = new Date(utcTime);
  const localTime = new Date(
    utcDate.getTime() + timeZoneOffset * 60 * 60 * 1000
  );
  return localTime.toLocaleString(); // Mengembalikan waktu dalam format lokal yang sesuai
}

function updateRemainingTime() {
  axios
    .get(url)
    .then((response) => {
      // Mendapatkan nilai timestamp dari data JSON

      const sentTimeUTC = response.data.sent;
      const timeZoneOffset = 0;

      const sentTimeLocal = convertUTCToLocalTime(sentTimeUTC, timeZoneOffset);
      console.log("Sent Time (Local):", sentTimeLocal);

      const sentTime = sentTimeLocal;

      // Mengubah sentTime menjadi objek Date
      const sentTimeObj = new Date(sentTime);

      // Mendapatkan timestamp waktu terakhir kali data diperbarui dari respons
      lastUpdateTime = sentTimeObj.getTime();

      // Menghitung selisih waktu antara waktu terakhir kali data diperbarui dengan waktu saat ini
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastUpdateTime;

      // Menentukan format yang akan ditampilkan berdasarkan lamanya waktu tersisa
      let timeLeft;

      if (timeDiff < 60000) {
        // Kurang dari 60 detik, tampilkan detik saja
        const secondsDiff = Math.floor(timeDiff / 1000);
        timeLeft = `${secondsDiff} detik`;
      } else if (timeDiff < 3600000) {
        // Kurang dari 60 menit, tampilkan menit saja
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const secondsDiff = Math.floor((timeDiff % (1000 * 60)) / 1000);
        timeLeft = `${minutesDiff} menit ${secondsDiff} detik`;
      } else if (timeDiff < 86400000) {
        // Lebih dari atau sama dengan 1 jam dan kurang dari 24 jam, tampilkan jam, menit, dan detik
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesDiff = Math.floor(
          (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
        );
        const secondsDiff = Math.floor((timeDiff % (1000 * 60)) / 1000);
        timeLeft = `${hoursDiff} jam ${minutesDiff} menit ${secondsDiff} detik`;
      } else {
        // Lebih dari 24 jam, tampilkan dalam format hari
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesDiff = Math.floor(
          (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
        );
        const secondsDiff = Math.floor((timeDiff % (1000 * 60)) / 1000);
        // timeLeft = `${daysDiff} hari ${hoursDiff} jam ${minutesDiff} menit ${secondsDiff} detik`;
        timeLeft = `${daysDiff} hari`;
      }

      $("#timeleft").text(timeLeft);

      svgLeft.textContent = timeLeft.toString() + " yang lalu";
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
    });
}

// Memperbarui waktu tersisa setiap 1 detik (1000 milidetik)
setInterval(updateRemainingTime, 1000);

// Memperbarui waktu tersisa setiap 1 detik (1000 milidetik)
setInterval(updateRemainingTime, 1000);
axios
  .get(url)
  .then((response) => {
    c = response.data;
    // Update HTML and SVG elements using the c variable
    var minimap = L.map("minimap", { attributionControl: false }).setView(
      [c.epicenterLat, c.epicenterLon],
      5
    );

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution: false,
      }
    ).addTo(minimap);

    var pulseMarker = L.marker([c.epicenterLat, c.epicenterLon], {
      icon: L.icon.pulse({ iconSize: [10, 10], color: "red" }),
    }).addTo(minimap);

    setInterval(function () {
      axios.get(url).then((response) => {
        c = response.data;
        // Update marker position
        pulseMarker.setLatLng([c.epicenterLat, c.epicenterLon]);
        // Update map view
        minimap.setView([c.epicenterLat, c.epicenterLon], minimap.getZoom());
      });
    }, 20 * 1000); // Update every 60 seconds

    // updateMinimap(c.epicenterLat, c.epicenterLon);

    // Format originTime
    const dateTime = new Date(c.originTime);
    const formattedDate = `${dateTime.getDate().toString().padStart(2, "0")}-${(
      dateTime.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateTime.getFullYear()}`;
    const formattedTime = `${dateTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${dateTime.getSeconds().toString().padStart(2, "0")}`;
    const formattedOriginTime = `${formattedDate}, ${formattedTime}`;

    $("#epicenter").text(`${c.epicenterLat}, ${c.epicenterLon}`);
    $("#ot").text(c.originTime);
    $("#depth").text(c.depth);

    $("#magnitude").text(c.magnitude);
    svgMagnitude.textContent = c.magnitude.toString();
    svgEpicenter.textContent = `${c.epicenterLat}, ${c.epicenterLon}`;
    svgOT.textContent =
      formattedOriginTime.replace("T", ",").toString() + " UTC";
    svgDepth.textContent = c.depth.toString() + " km";

    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((user) => {
        console.log("Latitude:", user);
        let lat2 = user.latitude;
        let lon2 = user.longitude;
        addMarker(lat2, lon2);
        const distance = calculateDistance(
          c.epicenterLat,
          c.epicenterLon,
          lat2,
          lon2
        );
        // console.log("Distance to latest earthquake:", distance, "km");

        $("#lokasi").text(user.city + ", " + user.country_name);

        lokasi.textContent = user.city + ", " + user.country_name;
        // Calculate MMI and countdown time
        let mmi = mmiPredict(distance * 1000, c.magnitude);
        waktuTiba = countTime(distance);
        console.log("MMI:", mmi);
        console.log("Countdown:", waktuTiba);

        var dh = 0;
        if (parseFloat(c.depth) >= 15) {
          dh = 1;
        }
        var r_int =
          distance + 0.0055 * Math.exp(1.08 * parseFloat(c.magnitude));

        let intensitas =
          1.011 * parseFloat(c.magnitude) +
          -0.00564 * distance -
          Math.log(r_int) +
          0.01412 * (parseFloat(c.depth) - 15) * dh +
          0.251 +
          2.607 +
          -0.528 * Math.log(c.depth) +
          1.355;
        intensitas = Math.exp(intensitas);
        keterangan = conMMI(intensitas);
        intensitas = getMMI(intensitas);
        console.log("Intensitas:", intensitas);

        $("#ket").text(keterangan);
        $("#vmmi").text(intensitas);
        svgElem.textContent = keterangan.toString();
        svgElem.textContent = intensitas.toString();

        // jam countdown
        FULL_DASH_ARRAY = 283;
        let WARNING_THRESHOLD = 10;
        let ALERT_THRESHOLD = 5;

        COLOR_CODES = {
          info: {
            color: "green",
          },
          warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD,
          },
          alert: {
            color: "red",
            threshold: ALERT_THRESHOLD,
          },
        };

        // TIME_LIMIT = waktuTiba;
        TIME_LIMIT = 0;
        timePassed = 0;
        let timeLeft = TIME_LIMIT;
        timerInterval = null;
        remainingPathColor = COLOR_CODES.info.color;

        document.getElementById("countdown").innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining ${remainingPathColor}"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
    )}</span>
  </div>
  `;

        startTimer();
        if (document.getElementById("countdown") !== null) {
        } else {
          console.log("Error: Element not found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  })
  .catch((error) => {
    console.error(error);
  });

$(".leaflet-control-attribution").hide();

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    if (timeLeft <= 0) {
      timeLeft = 0;
      onTimesUp();
      clearInterval(timerInterval);
    }
    document.getElementById("base-timer-label").innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 120);
  let seconds = time % 120;

  if (seconds < 10) {
    seconds = `${seconds}`;
  }
  // for minute and second
  // return `${minutes}:${seconds}`;
  return `${seconds}`;
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtnSVG");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Get the modal glossary
var glos = document.getElementById("glossaryModal");

// Get the button that opens the modal
var but = document.getElementById("glossaryBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("exit")[0];

// When the user clicks the button, open the modal
but.onclick = function () {
  glos.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  glos.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == glos) {
    glos.style.display = "none";
  }
};

const pgaPred = (R, M, depth) => {
  let dh = 0;
  if (depth < 15) {
    dh = 1;
  }
  if (depth <= 50 && M <= 5.3) {
    //Akkar Boomer 2007
    let PGA =
      1.647 +
      0.767 * M -
      0.074 * M ** 2 +
      (-3.162 + 0.321 * M) * Math.log10(Math.sqrt(R ** 2 + 7.682 ** 2));
    return 10 ** PGA;
  } else {
    // Zhao
    let dist2 = Math.sqrt(R ** 2 + depth ** 2);
    let rzhao = dist2 + 0.0055 * Math.exp(1.08 * M);
    let ly =
      1.101 * M -
      0.00564 * dist2 -
      Math.log(rzhao) +
      0.01412 * (depth - 15) * dh +
      1.111;
    if (depth > 22 && depth < 50 && M <= 7.2 && M > 5.3) {
      ly = ly + (2.607 - 0.528 * Math.log(dist2));
    } else {
      ly = ly + (2.607 - 0.528 * Math.log(dist2));
    }
    let PGA = Math.exp(ly);
    return PGA;
  }
};

const mmi_worden = (PGA) => {
  // worde et all
  if (Math.log10(PGA) <= 1.57) {
    return 1.78 + 1.55 * Math.log10(PGA);
  } else {
    return -1.6 + 3.7 * Math.log(PGA);
  }
};
