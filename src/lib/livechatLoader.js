const TRACKING_SRC = "https://cdn.livechatinc.com/tracking.js";
const DEFAULT_LICENSE = 19606134;
const DEFAULT_INTEGRATION = "manual_channels";

const BOOTSTRAP_IIFE = `(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="${TRACKING_SRC}",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice));`;

export function initLiveChat() {
  if (typeof window === "undefined") return;
  if (document.querySelector(`script[src="${TRACKING_SRC}"]`)) return;
  if (document.querySelector("script[data-livechat-bootstrap]")) return;

  const license = Number(import.meta.env.VITE_LIVECHAT_LICENSE) || DEFAULT_LICENSE;
  const integration =
    import.meta.env.VITE_LIVECHAT_INTEGRATION_NAME || DEFAULT_INTEGRATION;

  window.__lc = window.__lc || {};
  window.__lc.license = license;
  window.__lc.integration_name = integration;
  window.__lc.product_name = "livechat";

  const boot = document.createElement("script");
  boot.type = "text/javascript";
  boot.dataset.livechatBootstrap = "1";
  boot.textContent = BOOTSTRAP_IIFE;
  document.head.appendChild(boot);
}
