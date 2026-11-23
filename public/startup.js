performance.mark("inova:html-ready");
document.getElementById("startup-retry")?.addEventListener("click", () => location.reload());
setTimeout(() => {
  const message = document.getElementById("startup-slow");
  if (message) message.hidden = false;
}, 8000);
setTimeout(() => {
  const retry = document.getElementById("startup-retry");
  if (retry) retry.hidden = false;
}, 30000);
