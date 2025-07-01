const urlSvil = 'http://localhost:8080/api/';
const urlTest = 'https://biblioteca-scolastica.onrender.com/api/';

const environment = 'test'; 

const baseUrl = (environment === 'svil' ? urlSvil : urlTest);

// Api libri
export const apigetMyLibry = (idUtente) => `${baseUrl}libri/getMyLibri?idUtente=${idUtente}`;
export const apigetAllLibry = `${baseUrl}libri/getAllLibri`;
export const apiConcediPrestito = `${baseUrl}libri/concedi`;
export const apiAggiungiLibro = `${baseUrl}libri/aggiungi`;
export const apiDeleteLibro = (idLibro) => `${baseUrl}libri/${idLibro}`;

// Api utente
export const apiBaseUtente = `${baseUrl}utente`;
export const apigetAllAlunni = `${baseUrl}utente/getAllUtenti/alunno`;
export const apiAddUtente = `${baseUrl}utente/aggiungiUtente`;
export const apiVerificaCodice = `${baseUrl}utente/verificaCodice`;

// Api prestiti
export const apiBasePrestito = `${baseUrl}prestiti`;
export const apiTerminaPrestito = (idPrestito) => `${baseUrl}prestiti/terminaPrestito/${idPrestito}`;
export const apiAllPrestiti = `${baseUrl}prestiti/getAllPrestito`;

// Api login
export const apiBaseLogin = `${baseUrl}login`;
