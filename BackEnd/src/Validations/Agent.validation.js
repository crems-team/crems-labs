const { z } = require('zod');

const agentIdSchema = z.object({
  body: z.object({
    id: z.string().min(1, { message: "Agent ID is required." }).regex(/^\d+$/, { message: "Agent ID must contain only digits" }),
  }),
});

// Schéma pour la recherche par nom/prénom
const termSchema = z.object({
  query: z.object({
    term: z.string().min(1, { message: "Le terme de recherche est requis." }),
  }),
});

// Schéma pour getFirstName, qui attend lastName et term dans les query params
const firstNameSchema = z.object({
  query: z.object({
    lastName: z.string().min(1, { message: "Le nom de famille est requis." }),
    term: z.string().optional(), // Le prénom (term) est optionnel
  }),
});

// Schéma pour le classement, qui attend id et officeId dans le corps
const rankingSchema = z.object({
  body: z.object({
    id: z.string().min(1, { message: "L'ID de l'agent est requis." }),
    officeId: z.string().min(1, { message: "L'ID de l'agence est requis." }),
  }),
});

// Schéma pour la sauvegarde de l'historique
const saveHistorySchema = z.object({
    body: z.object({
        userId: z.string().min(1),
        savedType: z.string().min(1),
        fullName: z.string().min(1),
        agentIdC: z.string().min(1),
        state: z.string().min(1)
    })
})

module.exports = {
  agentIdSchema,
  termSchema,
  firstNameSchema,
  rankingSchema,
  saveHistorySchema
};