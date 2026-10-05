"use strict";

/* =====================================================
   CONFIGURAÇÃO — edite somente este bloco
   ===================================================== */
const CONFIG = {
  // WhatsApp com código do país e DDD, só números. Exemplo: "5548999999999"
  whatsappNumber: "[COLOQUE O NÚMERO]",
  // Instagram sem o @. Exemplo: "dra.carolinemeurer"
  instagramUser: "[COLOQUE O @]",
  // Endereço exibido na seção Localização
  address: "[COLOQUE O ENDEREÇO COMPLETO]",
  // Google Maps: abra o local > Compartilhar > Incorporar um mapa > copie só o src="..."
  mapsEmbedUrl: "",
  // Mensagem padrão dos botões sem data-msg
  defaultMessage: "Olá, Dra. Caroline! Gostaria de mais informações.",
};

/* ===== Utilidades ===== */
const onlyDigits = (value) => value.replace(/\D/g, "");
const hasPhone = () => onlyDigits(CONFIG.whatsappNumber).length >= 12;
const hasInstagram = () => /^[\w.]+$/.test(CONFIG.instagramUser);

const buildWhatsAppUrl = (message) =>
  `https://wa.me/${onlyDigits(CONFIG.whatsappNumber)}?text=${encodeURIComponent(message)}`;

/* ===== Links de WhatsApp e Instagram ===== */
document.querySelectorAll("[data-wa]").forEach((el) => {
  if (hasPhone()) {
    el.href = buildWhatsAppUrl(el.dataset.msg || CONFIG.defaultMessage);
  } else {
    el.href = "#agendar";
    el.removeAttribute("target");
  }
  if (el.dataset.show === "phone" && hasPhone()) el.textContent = CONFIG.whatsappNumber;
});

document.querySelectorAll("[data-ig]").forEach((el) => {
  if (hasInstagram()) {
    el.href = `https://instagram.com/${CONFIG.instagramUser}`;
    if (el.dataset.show === "ig") el.textContent = `@${CONFIG.instagramUser}`;
  } else {
    el.href = "#topo";
    el.removeAttribute("target");
  }
});

/* ===== Endereço e Google Maps ===== */
document.getElementById("endereco").textContent = CONFIG.address;

if (CONFIG.mapsEmbedUrl) {
  const mapBox = document.getElementById("mapa");
  const iframe = document.createElement("iframe");
  iframe.src = CONFIG.mapsEmbedUrl;
  iframe.title = "Mapa com a localização da Dra. Caroline Meurer";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.allowFullscreen = true;
  mapBox.replaceChildren(iframe);
}

/* ===== Menu mobile ===== */
const menu = document.getElementById("menu");
const toggle = document.querySelector(".menu-toggle");

const setMenu = (open) => {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};

toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ===== Formulário -> WhatsApp ===== */
const form = document.getElementById("form");
const errorBox = document.getElementById("erro");

const showError = (text) => {
  errorBox.textContent = text;
  errorBox.hidden = !text;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nome = data.get("nome").trim();
  const tel = onlyDigits(data.get("tel"));
  const interesse = data.get("interesse");
  const msg = data.get("msg").trim();

  if (nome.length < 2) return showError("Informe seu nome.");
  if (tel.length < 10) return showError("Informe um telefone com DDD.");
  if (!hasPhone()) return showError("O número de WhatsApp da Dra. ainda não foi configurado em script.js.");

  showError("");
  const text = [
    "Olá, Dra. Caroline! Vim pelo site e gostaria de agendar uma avaliação.",
    `Nome: ${nome}`,
    `Telefone: ${data.get("tel").trim()}`,
    `Interesse: ${interesse}`,
    msg && `Mensagem: ${msg}`,
  ].filter(Boolean).join("\n");

  window.open(buildWhatsAppUrl(text), "_blank", "noopener");
});

/* ===== Ano do rodapé ===== */
document.getElementById("ano").textContent = new Date().getFullYear();
