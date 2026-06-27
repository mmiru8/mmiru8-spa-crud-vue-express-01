###### \# SPA CRUD Vue Express 01

###### 

###### \## Descriere

###### 

###### Aplicație Single Page pentru gestionarea produselor de unghii și a comenzilor.

###### 

###### \## Tehnologii folosite

###### 

###### \- Vue 3

###### \- Vue Router

###### \- Pinia

###### \- Express

###### \- Firebase Authentication

###### \- Firebase Firestore

###### \- Faker

###### 

###### \## Funcționalități

###### 

###### \- Autentificare utilizatori

###### \- Rol administrator / utilizator

###### \- CRUD produse pentru administrator

###### \- Plasare comenzi

###### \- Actualizare automată a stocului

###### \- Schimbare status comenzi

###### \- Căutare produse

###### \- Validări frontend

###### \- Validări backend

###### \- Script pentru generarea datelor

###### 

###### \## Cont administrator

###### 

###### Email:

###### 

###### ```text

###### admin@test.com

###### ```

###### 

###### Parolă:

###### 

###### ```text

###### admin123

###### ```

###### 

###### \## Pornire frontend

###### 

###### ```bash

###### cd frontend

###### npm install

###### npm run dev

###### ```

###### 

###### \## Pornire backend

###### 

###### ```bash

###### cd backend

###### npm install

###### node src/server.js

###### ```

###### 

###### \## Script generare date

###### 

###### ```bash

###### cd backend

###### node scripts/seedProducts.js

###### ```

###### 

###### \## Structura proiectului

###### 

###### ```text

###### backend

###### &#x20;├── src

###### &#x20;│   ├── controllers

###### &#x20;│   ├── middleware

###### &#x20;│   ├── routes

###### &#x20;│   └── server.js

###### &#x20;└── scripts

###### 

###### frontend

###### &#x20;└── src

###### &#x20;    ├── router

###### &#x20;    ├── services

###### &#x20;    ├── stores

###### &#x20;    └── views

###### ```

###### 

###### \## Modelare Firestore

###### 

###### Colecții utilizate:

###### 

###### \- products

###### \- orders

###### 

###### O comandă conține `productId` și `productName`, realizând relația dintre produse și comenzi.

###### 

###### Funcționalități administrator

###### Adaugă produs

###### Editează produs

###### Șterge produs

###### Marchează comanda ca expediată

###### Funcționalități utilizator

###### Înregistrare

###### Login

###### Vizualizare produse

###### Căutare produse

###### Plasare comandă

###### 

