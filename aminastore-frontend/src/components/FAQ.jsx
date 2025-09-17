// src/components/FAQ.jsx
import React, { useState } from "react";
import "../styles/FAQ.css";

const faqData = [
  {
    section: "Commandes",
    items: [
      {
        question: "Comment passer une commande ?",
        answer:
          "Ajoutez vos articles au panier, validez votre commande, choisissez votre mode de paiement et suivez les instructions. Une confirmation vous sera envoyée par SMS ou sur WhatsApp.",
      },
      {
        question: "Puis-je modifier ou annuler ma commande après validation ?",
        answer:
          "Une fois la commande confirmée, elle est traitée rapidement. Contactez-nous immédiatement pour toute modification ou annulation, mais nous ne pouvons garantir que ce sera possible après traitement.",
      },
      {
        question: "Puis-je commander par WhatsApp ou téléphone ?",
        answer:
          "Oui ! Envoyez-nous vos articles et quantités par WhatsApp au 771083763 ou appelez-nous. Nous vous guiderons pour finaliser la commande.",
      },
    ],
  },
  {
    section: "Livraison",
    items: [
      {
        question: "Quels sont les délais de livraison ?",
        answer:
          "Les délais varient entre 24h et 48h jours ouvrés selon votre localisation.",
      },
      {
        question: "Livrez-vous partout ?",
        answer:
          "Nous livrons dans tout le Sénégal et dans certains pays de la sous-région. Pour l’international, contactez-nous pour connaître les tarifs.",
      },
      {
        question: "Quels sont les frais de livraison ?",
        answer:
          "Les frais de livraison sont calculés en fonction de votre zone. Ils seront communiqués par le livreur avant la livraison.",
      },
      {
        question: "Puis-je suivre ma livraison ?",
        answer: "Oui, un numéro de suivi vous sera envoyé dès que votre commande est expédiée.",
      },
    ],
  },
  {
    section: "Paiement",
    items: [
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer: "Nous acceptons : Wave, Orange Money.",
      },
      {
        question: "Le paiement est-il sécurisé ?",
        answer:
          "Oui, toutes nos transactions sont sécurisées. Vos informations bancaires ne sont jamais stockées sur notre site.",
      },
      {
        question: "Puis-je payer en plusieurs fois ?",
        answer: "Non, pour l’instant, le paiement se fait en une seule fois.",
      },
    ],
  },
  {
    section: "Retours & Échanges",
    items: [
      {
        question: "Puis-je retourner un article ?",
        answer:
          "Oui, vous disposez de 24h après réception pour nous retourner un article non porté, non lavé et dans son emballage d’origine.",
      },
      {
        question: "Comment effectuer un retour ou un échange ?",
        answer:
          "Contactez-nous via WhatsApp  en précisant votre numéro de commande et la raison du retour.",
      },
      {
        question: "Les frais de retour sont-ils à ma charge ?",
        answer:
          "Oui, sauf en cas d’erreur de notre part (produit défectueux ou mauvais article envoyé).",
      },
      {
        question: "Puis-je échanger un article contre un autre ?",
        answer:
          "Oui, nous procédons à l’échange si le produit demandé est disponible et correspond à l’article acheté précédemment.",
      },
    ],
  },
  {
    section: "Produits",
    items: [
      {
        question: "Les articles sont-ils exactement comme sur les photos ?",
        answer:
          "Oui, nos photos sont fidèles aux produits. Des variations mineures de couleur peuvent exister selon la lumière ou l’écran.",
      },
      {
        question: "Comment choisir la bonne taille ?",
        answer:
          "Consultez notre guide des tailles disponible sur chaque fiche produit. Pour toute hésitation, notre service client peut vous conseiller.",
      },
    ],
  },
  {
    section: "Service client",
    items: [
      {
        question: "Comment vous contacter ?",
        answer:
          "Par WhatsApp au 771083763, ou via mail : aminastore87@gmail.com.",
      },
      {
        question: "Quels sont vos horaires ?",
        answer: "Du lundi au samedi, de 9h à 20h.",
      },
      {
        question: "Combien de temps pour obtenir une réponse ?",
        answer: "Nous répondons généralement sous 24 heures.",
      },
    ],
  },
  {
    section: "Sécurité et confidentialité",
    items: [
      {
        question: "Mes informations personnelles sont-elles protégées ?",
        answer:
          "Oui, vos données sont sécurisées et ne seront jamais partagées avec des tiers.",
      },
      
    ],
  },
];

const FAQ = () => {
  const [openSection, setOpenSection] = useState(null);

  return (
    <div className="faq-container">
      {faqData.map((section, i) => (
        <div key={i} className="faq-section mb-4">
          <h3 className="faq-section-title">{section.section}</h3>
          {section.items.map((item, j) => (
            <div key={j} className="faq-item mb-2">
              <h5
                className="faq-question"
                onClick={() =>
                  setOpenSection(openSection === `${i}-${j}` ? null : `${i}-${j}`)
                }
              >
                ❓ {item.question}
              </h5>
              <div
                className="faq-answer"
                style={{
                  maxHeight: openSection === `${i}-${j}` ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                {openSection === `${i}-${j}` && <p>{item.answer}</p>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
