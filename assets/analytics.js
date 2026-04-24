(function () {
  var CF_TOKEN = "0f1fc7882d7c46929365e9c3da20e004";
  if (!CF_TOKEN || CF_TOKEN === "REPLACE_WITH_TOKEN_FROM_USER") return;
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
  document.head.appendChild(s);
})();
