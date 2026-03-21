import type { User } from '@prisma/client'; // ton modèle Prisma User

declare module 'express' {
    export interface Request {
        user?: User; // ajoute une propriété user optionnelle à l'objet Request
    }
}