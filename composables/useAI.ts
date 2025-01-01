import { ref } from "vue";
import OpenAI from "openai";

const isGenerating = ref(false);
const error = ref<string | null>(null);
const propertyData = ref(``);

const listPbmVisitorsGB = ref([
  "Code Wifi",
  "question oreillers",
  "Probleme Wifi",
  "Fonctionnement Television",
  "Remerciement",
  "Restaurant & bar à proximité",
]);

const listPbmVisitorsSerena = ref([
  "Probleme Wifi",
  "early check-in",
  "late check-out",
  "nuit supplémentaire",
  "Problème technique",
  "Manque de consommable",
  "Problème de ménage"
]);

export const useAI = () => {
  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.public.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Simuler une fonction "incomingChat" qui se déclenche quand un message arrive
  async function incomingChat(context: any) {
    isGenerating.value = true;
    error.value = null;

    const lastMessage = context.messages[context.messages.length - 1].message;

    // Étape 1 : Envoyer le message de l'utilisateur au modèle AI pour identifier le besoin
    const aiResponse = await identifyUserNeed(context, lastMessage);
    console.log("Besoin identifié :", aiResponse);

    // Étape 2 : Récuperer la data du logement
    const propertyDetail = await getPropertyDetail(context.booking.propertyId);

    // Étape 3 : Appeler une fonction en fonction du besoin identifié
    const result = await handleUserNeed(aiResponse, propertyDetail, context);

    // Étape 4 : Envoyer la réponse au chat
    console.log("Réponse envoyée à l'utilisateur :", result);
    return result;
  }

  // Fonction pour identifier le besoin de l'utilisateur via GPT-4 SELON LA LISTE DE PRBMS (listPbmVisitors)
  async function identifyUserNeed(context, lastMessage) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant qui identifie les besoins des utilisateurs. Tu as exclusivement le choix dans cette liste : ${listPbmVisitorsGB.value} ${listPbmVisitorsSerena.value}, si tu ne trouves pas de correspondance dans cette liste. Envoie 'non-identifié'.`,
          },
          {
            role: "system",
            content: `Voici l'historique des échanges avec : ${context.messages}. Prends cet échange en considération pour découvrir le besoin du voyageur. Le source : "guest" est le voyageur et "host" c'est toi.`,
          },
          {
            role: "user",
            content: `L'utilisateur a dit : "${lastMessage}". Quel est son besoin, utilise exactement l'intitulé présent dans la list de choix ?`,
          },
        ],
      });

      // Retourner le besoin identifié par l'AI
      return response.choices[0]?.message?.content;
    } catch (e) {
      error.value = "Failed to generate AI response";
      console.error("Error generating AI response:", e);
      return null;
    }
  }

  // Fonction pour récupérer les details de la propriétée
  async function getPropertyDetail(propertyId) {
    switch (propertyId) {
      //Case Pipot
      case 253239:
        return `Here is a list of information about the appartment:
          The apartment is located in the city Center of Boulogne sur Mer, France 62200, rue des pipots.
          The wifi password of the appartment is : '1234', it is not noted in the welcome leaflet, but written in Morse on the fridge, and on the bathroom mirror.
          The 2 additional pillows are located in the container next to the couch, otherwise you have 2 pillows on the bed at your arrival, including the bedsheets.
          The Coffee Machine is a Dolce Gusto and has 2 coffee capsule for your stay
          La télévision fonctionne avec le décodeur TV 'Free', il y a une telecomande pour la TV et une pour le décodeur TV.
          La terasse est accéssible par le salon et fait 10mètre carrée.
          `;

      default:
        return `You are a helpful Kitchen Chef assistant. 
          You should respond in French.
          You should always try to answer the question in a manner of a kitchen recipe.`;
    }
  }

  // Fonction pour gérer le besoin identifié
  async function handleUserNeed(userNeed, propertyDetail, context) {
    // REDIRECT TO SERENA IA
    if (listPbmVisitorsSerena.value.some((item) => userNeed.includes(item))) {

      console.log("Je vais Appeller la fonction nécessaire - FUCNTION CALLING");
      



      return "Je vais Appeller la fonction nécessaire";

      // Traite en direct GuestBot
    } else if (
      listPbmVisitorsGB.value.some((item) => userNeed.includes(item))
    ) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
          You are a helpful vacation rental property manager assistant. 
          You should respond in the langage the visitor is talking.

          Current booking context:
            - Guest Name: ${context.guest}
            - Check-in: ${context.booking.arrival}
            - Check-out: ${context.booking.departure} 
            - Property ID: ${context.booking.propertyId}
            - Room ID: ${context.booking.roomId}

          Here are the information about the property : "${propertyDetail}".
          
          Here is the historic of message of the conversation with the visitor: "${context.messages}", "source: 'host'" is you, and "source: guest'" is the visitor. You can use this historic to add sense to the last message.

          You can make a research to find restaurant & bar recommendations.
        
          Be professional, friendly, and provide accurate information based on the context.`,
          },
          {
            role: "user",
            content: `L'utilisateur a ce besoin : "${userNeed}". Apportes-lui une réponse sur un ton amical.`,
          },
        ],
      });

      return response.choices[0]?.message?.content;
    } else {
      return "Désolé, je ne suis pas sûr de comprendre votre besoin. Je vais contacter un responsable.";
    }
  }

  return {
    isGenerating,
    error,
    incomingChat,
  };
};
